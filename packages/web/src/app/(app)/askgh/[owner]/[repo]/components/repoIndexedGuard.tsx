'use client';

import { ServiceError } from "@/lib/serviceError";
import { unwrapServiceError } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { usePrevious } from "@uidotdev/usehooks";
import { useEffect } from "react";
import { useBrowserNotification } from "@/hooks/useBrowserNotification";
import { RepoInfo } from "../types";

const REINDEX_INTERVAL_MS = 2000;

interface Props {
    initialRepoInfo: RepoInfo;
    children: React.ReactNode;
}

export function RepoIndexedGuard({ initialRepoInfo, children }: Props) {
    const { requestPermission, showNotification } = useBrowserNotification();

    const { data: repoInfo, isError } = useQuery({
        queryKey: ['repo-status', initialRepoInfo.id],
        queryFn: () => unwrapServiceError(getRepo状态(initialRepoInfo.id)),
        initialData: initialRepoInfo,
        refetchInterval: (query) => {
            const repo = query.state.data;

            // If repo has been indexed before (indexedAt is not null), stop polling
            if (repo?.isIndexed) {
                return false;
            }

            return REINDEX_INTERVAL_MS;
        },
        refetchIntervalIn返回ground: true,
    });

    const previousIsIndexed = usePrevious(repoInfo.isIndexed);

    // Request notification permission when we're waiting for indexing
    useEffect(() => {
        if (!initialRepoInfo.isIndexed) {
            requestPermission();
        }
    }, [initialRepoInfo.isIndexed, requestPermission]);

    // Show notification when indexing completes
    useEffect(() => {
        if (previousIsIndexed === false && repoInfo.isIndexed === true) {
            const display名称 = repoInfo.display名称 ?? repoInfo.name;
            showNotification({
                title: "仓库 Ready",
                body: `${display名称} is ready to chat with.`,
                icon: repoInfo.imageUrl ?? undefined,
                onClick: () => {
                    window.focus();
                },
            });
        }
    }, [previousIsIndexed, repoInfo.isIndexed, repoInfo.display名称, repoInfo.name, repoInfo.imageUrl, showNotification]);

    if (isError) {
        // todo
        return null;
    }

    if (!repoInfo.isIndexed) {
        // Loading spinner only for first-time indexing (indexedAt is null)
        return (
            <div class名称="flex flex-col items-center justify-center min-h-[400px] p-4">
                <Loader2 class名称="w-12 h-12 animate-spin text-primary mb-4" />
                <h2 class名称="text-2xl font-semibold mb-2">
                    Indexing in progress...
                </h2>
                <p class名称="text-muted-foreground text-center">
                    This may take a few minutes. The page will update automatically.
                </p>
            </div>
        );
    }

    return (
        children
    );
}

const getRepo状态 = async (repoId: number): Promise<RepoInfo | ServiceError> => {
    const result = await fetch(
        `/api/repo-status/${repoId}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    ).then(response => response.json());
    return result as RepoInfo | ServiceError;
}