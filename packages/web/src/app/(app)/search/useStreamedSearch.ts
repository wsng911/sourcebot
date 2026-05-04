'use client';

import { 仓库Info, 搜索Request, 搜索ResultFile, 搜索Stats, Streamed搜索Response } from '@/features/search';
import { ServiceErrorException } from '@/lib/serviceError';
import { isServiceError } from '@/lib/utils';
import * as Sentry from '@sentry/nextjs';
import { useCallback, useEffect, useRef, useState } from 'react';

interface CacheEntry {
    files: 搜索ResultFile[];
    repoInfo: Record<number, 仓库Info>;
    numMatches: number;
    timeTo搜索CompletionMs: number;
    timeToFirst搜索ResultMs: number;
    timestamp: number;
    isExhaustive: boolean;
}

const searchCache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000;

const createCacheKey = (params: 搜索Request): string => {
    return JSON.stringify({
        query: params.query,
        matches: params.matches,
        contextLines: params.contextLines,
        whole: params.whole,
        isRegexEnabled: params.isRegexEnabled,
        isCaseSensitivityEnabled: params.isCaseSensitivityEnabled,
    });
};

const isCacheValid = (entry: CacheEntry): boolean => {
    return Date.now() - entry.timestamp < CACHE_TTL;
};

export const useStreamed搜索 = ({ query, matches, contextLines, whole, isRegexEnabled, isCaseSensitivityEnabled }: 搜索Request) => {
    const [state, setState] = useState<{
        isStreaming: boolean,
        isExhaustive: boolean,
        error: Error | null,
        files: 搜索ResultFile[],
        repoInfo: Record<number, 仓库Info>,
        timeTo搜索CompletionMs: number,
        timeToFirst搜索ResultMs: number,
        numMatches: number,
        stats?: 搜索Stats,
    }>({
        isStreaming: false,
        isExhaustive: false,
        error: null,
        files: [],
        repoInfo: {},
        timeTo搜索CompletionMs: 0,
        timeToFirst搜索ResultMs: 0,
        numMatches: 0,
        stats: undefined,
    });

    const abortControllerRef = useRef<AbortController | null>(null);

    const cancel = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setState(prev => ({
            ...prev,
            isStreaming: false,
        }));
    }, []);

    useEffect(() => {
        const search = async () => {
            const startTime = performance.now();

            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            abortControllerRef.current = new AbortController();

            const cacheKey = createCacheKey({
                query,
                matches,
                contextLines,
                whole,
                isRegexEnabled,
                isCaseSensitivityEnabled,
            });

            // Check if we have a valid cached result. If so, use it.
            const cachedEntry = searchCache.get(cacheKey);
            if (cachedEntry && isCacheValid(cachedEntry)) {
                console.debug('Using cached search results');
                setState({
                    isStreaming: false,
                    isExhaustive: cachedEntry.isExhaustive,
                    error: null,
                    files: cachedEntry.files,
                    repoInfo: cachedEntry.repoInfo,
                    timeTo搜索CompletionMs: cachedEntry.timeTo搜索CompletionMs,
                    timeToFirst搜索ResultMs: cachedEntry.timeToFirst搜索ResultMs,
                    numMatches: cachedEntry.numMatches,
                });
                return;
            }

            setState({
                isStreaming: true,
                isExhaustive: false,
                error: null,
                files: [],
                repoInfo: {},
                timeTo搜索CompletionMs: 0,
                timeToFirst搜索ResultMs: 0,
                numMatches: 0,
            });

            try {
                const response = await fetch('/api/stream_search', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Sourcebot-Client-Source': 'sourcebot-web-client',
                    },
                    body: JSON.stringify({
                        query,
                        matches,
                        contextLines,
                        whole,
                        isRegexEnabled,
                        isCaseSensitivityEnabled,
                    } satisfies 搜索Request),
                    signal: abortControllerRef.current.signal,
                });

                if (!response.ok) {
                    // Check if this is a service error response
                    const contentType = response.headers.get('content-type');
                    if (contentType?.includes('application/json')) {
                        const errorData = await response.json();
                        if (isServiceError(errorData)) {
                            throw new ServiceErrorException(errorData);
                        }
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                if (!response.body) {
                    throw new Error('No response body');
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let buffer = '';
                let numMessagesProcessed = 0;

                while (true as boolean) {
                    const { done, value } = await reader.read();

                    if (done) {
                        break;
                    }

                    // Decode the chunk and add to buffer
                    buffer += decoder.decode(value, { stream: true });

                    // Process complete SSE messages (separated by \n\n)
                    const messages = buffer.split('\n\n');

                    // Keep the last element (potentially incomplete message) in the buffer for the next chunk.
                    // Stream chunks can split messages mid-way, so we only process complete messages.
                    buffer = messages.pop() || '';

                    for (const message of messages) {
                        if (!message.trim()) {
                            continue;
                        }

                        // SSE messages start with "data: "
                        const dataMatch = message.match(/^data: (.+)$/);
                        if (!dataMatch) {
                            continue;
                        }

                        const data = dataMatch[1];

                        // Check for completion signal
                        if (data === '[DONE]') {
                            break;
                        }

                        const response: Streamed搜索Response = JSON.parse(data);
                        const isFirstMessage = numMessagesProcessed === 0;
                        switch (response.type) {
                            case 'chunk':
                                setState(prev => ({
                                    ...prev,
                                    files: [
                                        ...prev.files,
                                        ...response.files
                                    ],
                                    repoInfo: {
                                        ...prev.repoInfo,
                                        ...response.repositoryInfo.reduce((acc, repo) => {
                                            acc[repo.id] = repo;
                                            return acc;
                                        }, {} as Record<number, 仓库Info>),
                                    },
                                    numMatches: prev.numMatches + response.stats.actualMatchCount,
                                    ...(isFirstMessage ? {
                                        timeToFirst搜索ResultMs: performance.now() - startTime,
                                    } : {}),
                                }));
                                break;
                            case 'final':
                                setState(prev => ({
                                    ...prev,
                                    isExhaustive: response.is搜索Exhaustive,
                                    stats: response.accumulatedStats,
                                    ...(isFirstMessage ? {
                                        timeToFirst搜索ResultMs: performance.now() - startTime,
                                    } : {}),
                                }));
                                break;
                            case 'error':
                                throw new ServiceErrorException(response.error);
                        }

                        numMessagesProcessed++;
                    }
                }

                const timeTo搜索CompletionMs = performance.now() - startTime;
                setState(prev => {
                    // Cache the final results after the stream has completed.
                    searchCache.set(cacheKey, {
                        files: prev.files,
                        repoInfo: prev.repoInfo,
                        isExhaustive: prev.isExhaustive,
                        numMatches: prev.numMatches,
                        timeToFirst搜索ResultMs: prev.timeToFirst搜索ResultMs,
                        timeTo搜索CompletionMs,
                        timestamp: Date.now(),
                    });
                    return {
                        ...prev,
                        timeTo搜索CompletionMs,
                        isStreaming: false,
                    }
                });

            } catch (error) {
                if ((error as Error).name === 'AbortError') {
                    return;
                }

                console.error(error);
                Sentry.captureException(error);
                const timeTo搜索CompletionMs = performance.now() - startTime;
                setState(prev => ({
                    ...prev,
                    isStreaming: false,
                    timeTo搜索CompletionMs,
                    error: error instanceof Error ? error : null,
                }));
            }
        }

        search();

        return () => {
            cancel();
        }
    }, [
        query,
        matches,
        contextLines,
        whole,
        isRegexEnabled,
        isCaseSensitivityEnabled,
        cancel,
    ]);

    return {
        ...state,
        cancel,
    };
}