'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import useCaptureEvent from '@/hooks/useCaptureEvent';
import { cn, getShortenedNumberDisplayString } from '@/lib/utils';
import isEqual from "fast-deep-equal/react";
import { useStickToBottom } from 'use-stick-to-bottom';
import { Brain, ChevronDown, ChevronRight, Clock, InfoIcon, Loader2, Scan搜索Icon, Wrench, Zap } from 'lucide-react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { usePrevious } from '@uidotdev/usehooks';
import { SBChatMessageMetadata, SBChatMessagePart } from '../../types';
import { 搜索ScopeIcon } from '../searchScopeIcon';
import { MarkdownRenderer } from './markdownRenderer';
import { FindSymbolDefinitionsToolComponent } from './tools/findSymbolDefinitionsToolComponent';
import { FindSymbolReferencesToolComponent } from './tools/findSymbolReferencesToolComponent';
import { GlobToolComponent } from './tools/globToolComponent';
import { GrepToolComponent } from './tools/grepToolComponent';
import { GetDiffToolComponent } from './tools/getDiffToolComponent';
import { ListCommitsToolComponent } from './tools/listCommitsToolComponent';
import { ListReposToolComponent } from './tools/listReposToolComponent';
import { ListTreeToolComponent } from './tools/listTreeToolComponent';
import { ReadFileToolComponent } from './tools/readFileToolComponent';
import { ToolOutputGuard } from './tools/toolOutputGuard';


interface DetailsCardProps {
    chatId: string;
    isExpanded: boolean;
    onExpandedChanged: (isExpanded: boolean) => void;
    isThinking: boolean;
    isStreaming: boolean;
    thinkingSteps: SBChatMessagePart[][];
    metadata?: SBChatMessageMetadata;
}

const DetailsCardComponent = ({
    chatId,
    isExpanded,
    onExpandedChanged,
    isThinking,
    isStreaming,
    metadata,
    thinkingSteps,
}: DetailsCardProps) => {
    const captureEvent = useCaptureEvent();

    const toolCallCount = useMemo(() => thinkingSteps.flat().filter(part => part.type.startsWith('tool-')).length, [thinkingSteps]);

    const handleExpandedChanged = useCallback((next: boolean) => {
        captureEvent('wa_chat_details_card_toggled', { chatId, isExpanded: next });
        onExpandedChanged(next);
    }, [chatId, captureEvent, onExpandedChanged]);

    return (
        <Card class名称="mb-4">
            <Collapsible open={isExpanded} onOpenChange={handleExpandedChanged}>
                <CollapsibleTrigger asChild>
                    <CardContent
                        class名称={cn("p-3 cursor-pointer hover:bg-muted", {
                            "rounded-lg": !isExpanded,
                            "rounded-t-lg": isExpanded,
                        })}
                    >
                        <div class名称="flex items-center justify-between w-full">
                            <div class名称="flex items-center space-x-4">

                                <p class名称="flex items-center font-semibold text-muted-foreground text-sm">
                                    {isThinking ? (
                                        <>
                                            <Loader2 class名称="w-4 h-4 animate-spin mr-1 flex-shrink-0" />
                                            Thinking...
                                        </>
                                    ) : (
                                        <>
                                            <InfoIcon class名称="w-4 h-4 mr-1 flex-shrink-0" />
                                            Details
                                        </>
                                    )}
                                </p>
                                {!isStreaming && (
                                    <>
                                        <Separator orientation="vertical" class名称="h-4" />
                                        {(metadata?.selected搜索Scopes && metadata.selected搜索Scopes.length > 0) && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div class名称="flex items-center text-xs cursor-help">
                                                        <Scan搜索Icon class名称="w-3 h-3 mr-1 flex-shrink-0" />
                                                        {metadata.selected搜索Scopes.length} search scope{metadata.selected搜索Scopes.length === 1 ? '' : 's'}
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent side="bottom">
                                                    <div class名称="max-w-xs">
                                                        <div class名称="space-y-2">
                                                            {metadata.selected搜索Scopes.map((item) => (
                                                                <div key={item.value} class名称="flex items-center gap-2 text-xs">
                                                                    <搜索ScopeIcon searchScope={item} class名称="h-3 w-3" />
                                                                    <span>{item.name}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </TooltipContent>
                                            </Tooltip>
                                        )}
                                        {metadata?.model名称 && (
                                            <div class名称="flex items-center text-xs">
                                                <Brain class名称="w-3 h-3 mr-1 flex-shrink-0" />
                                                {metadata?.model名称}
                                            </div>
                                        )}
                                        {metadata?.totalTokens && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div class名称="flex items-center text-xs cursor-help">
                                                        <Zap class名称="w-3 h-3 mr-1 flex-shrink-0" />
                                                        {getShortenedNumberDisplayString(metadata.totalTokens, 0)} tokens
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent side="bottom">
                                                    <div class名称="space-y-1 text-xs">
                                                        <div class名称="flex justify-between gap-4">
                                                            <span class名称="text-muted-foreground">Input</span>
                                                            <span>{metadata.totalInputTokens?.toLocaleString() ?? '—'}</span>
                                                        </div>
                                                        <div class名称="flex justify-between gap-4">
                                                            <span class名称="text-muted-foreground">Output</span>
                                                            <span>{metadata.totalOutputTokens?.toLocaleString() ?? '—'}</span>
                                                        </div>
                                                        <div class名称="flex justify-between gap-4 border-t border-border pt-1">
                                                            <span class名称="text-muted-foreground">Total</span>
                                                            <span>{metadata.totalTokens.toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                </TooltipContent>
                                            </Tooltip>
                                        )}
                                        {metadata?.totalResponseTimeMs && (
                                            <div class名称="flex items-center text-xs">
                                                <Clock class名称="w-3 h-3 mr-1 flex-shrink-0" />
                                                {Math.round(metadata.totalResponseTimeMs / 1000)} seconds
                                            </div>
                                        )}
                                        {toolCallCount > 0 && (
                                            <div class名称="flex items-center text-xs">
                                                <Wrench class名称="w-3 h-3 mr-1 flex-shrink-0" />
                                                {toolCallCount} tool call{toolCallCount === 1 ? '' : 's'}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {isExpanded ? (
                                <ChevronDown class名称="w-4 h-4 text-muted-foreground" />
                            ) : (
                                <ChevronRight class名称="w-4 h-4 text-muted-foreground" />
                            )}
                        </div>
                    </CardContent>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <CardContent class名称="mt-2 p-0">
                        <ThinkingSteps
                            thinkingSteps={thinkingSteps}
                            isStreaming={isStreaming}
                            isThinking={isThinking}
                        />
                    </CardContent>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    )
}

export const DetailsCard = memo(DetailsCardComponent, isEqual);


const ThinkingSteps = ({ thinkingSteps, isStreaming, isThinking }: { thinkingSteps: SBChatMessagePart[][], isStreaming: boolean, isThinking: boolean }) => {
    const { scrollRef, contentRef, scrollToBottom } = useStickToBottom();
    const [shouldStick, setShouldStick] = useState(isThinking);
    const prevIsThinking = usePrevious(isThinking);

    useEffect(() => {
        if (prevIsThinking && !isThinking) {
            scrollToBottom();
            setShouldStick(false);
        } else if (!prevIsThinking && isThinking) {
            setShouldStick(true);
        }
    }, [isThinking, prevIsThinking, scrollToBottom]);

    return (
        <div ref={scrollRef} class名称="max-h-[350px] overflow-y-auto px-6 py-2">
            <div ref={shouldStick ? contentRef : undefined}>
                {thinkingSteps.length === 0 ? (
                    isStreaming ? (
                        <Skeleton class名称="h-24 w-full" />
                    ) : (
                        <p class名称="text-sm text-muted-foreground">No thinking steps</p>
                    )
                ) : thinkingSteps.map((step, index) => (
                    <div key={index}>
                        {step.map((part, index) => (
                            <div key={index} class名称="mb-2">
                                <StepPartRenderer part={part} />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}


export const StepPartRenderer = ({ part }: { part: SBChatMessagePart }) => {
    switch (part.type) {
        case 'reasoning':
        case 'text':
            return (
                <MarkdownRenderer
                    content={part.text}
                    class名称="text-sm prose-p:m-0 prose-code:text-xs"
                />
            )
        case 'tool-read_file':
            return (
                <ToolOutputGuard
                    part={part}
                    loadingText="Reading file..."
                >
                    {(output) => <ReadFileToolComponent {...output} />}
                </ToolOutputGuard>
            )
        case 'tool-grep':
            return (
                <ToolOutputGuard
                    part={part}
                    loadingText={'搜索ing...'}
                >
                    {(output) => <GrepToolComponent {...output} />}
                </ToolOutputGuard>
            )
        case 'tool-glob':
            return (
                <ToolOutputGuard
                    part={part}
                    loadingText="搜索ing files..."
                >
                    {(output) => <GlobToolComponent {...output} />}
                </ToolOutputGuard>
            )
        case 'tool-find_symbol_definitions':
            return (
                <ToolOutputGuard
                    part={part}
                    loadingText="Resolving definitions..."
                >
                    {(output) => <FindSymbolDefinitionsToolComponent {...output} />}
                </ToolOutputGuard>
            )
        case 'tool-find_symbol_references':
            return (
                <ToolOutputGuard
                    part={part}
                    loadingText="Resolving references..."
                >
                    {(output) => <FindSymbolReferencesToolComponent {...output} />}
                </ToolOutputGuard>
            )
        case 'tool-list_repos':
            return (
                <ToolOutputGuard
                    part={part}
                    loadingText="Listing repositories..."
                >
                    {(output) => <ListReposToolComponent {...output} />}
                </ToolOutputGuard>
            )
        case 'tool-list_commits':
            return (
                <ToolOutputGuard
                    part={part}
                    loadingText="Listing commits..."
                >
                    {(output) => <ListCommitsToolComponent {...output} />}
                </ToolOutputGuard>
            )
        case 'tool-get_diff':
            return (
                <ToolOutputGuard
                    part={part}
                    loadingText="Comparing revisions..."
                >
                    {(output) => <GetDiffToolComponent {...output} />}
                </ToolOutputGuard>
            )
        case 'tool-list_tree':
            return (
                <ToolOutputGuard
                    part={part}
                    loadingText="Listing tree..."
                >
                    {(output) => <ListTreeToolComponent {...output} />}
                </ToolOutputGuard>
            )
        case 'data-source':
        case 'dynamic-tool':
        case 'file':
        case 'source-document':
        case 'source-url':
        case 'step-start':
            return null;
        default:
            // Guarantees this switch-case to be exhaustive
            part satisfies never;
            return null;
    }
}