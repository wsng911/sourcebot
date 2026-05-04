'use client';

import { CodeSnippet } from "@/app/components/codeSnippet";
import { KeyboardShortcutHint } from "@/app/components/keyboardShortcutHint";
import { useToast } from "@/components/hooks/use-toast";
import { AnimatedResizableHandle } from "@/components/ui/animatedResizableHandle";
import { Button } from "@/components/ui/button";
import {
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { 仓库Info, 搜索ResultFile, 搜索Stats } from "@/features/search";
import useCaptureEvent from "@/hooks/useCaptureEvent";
import { useNonEmptyQueryParam } from "@/hooks/useNonEmptyQueryParam";
import { use搜索History } from "@/hooks/use搜索History";
import { 搜索QueryParams } from "@/lib/types";
import { createPathWithQueryParams } from "@/lib/utils";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useLocalStorage } from "@uidotdev/usehooks";
import { AlertTriangleIcon, BugIcon, FilterIcon, RefreshCwIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { ImperativePanelHandle } from "react-resizable-panels";
import { 复制IconButton } from "../../components/copyIconButton";
import { 搜索Bar } from "../../components/searchBar";
import { TopBar } from "../../components/topBar";
import { useStreamed搜索 } from "../useStreamed搜索";
import { CodePreviewPanel } from "./codePreviewPanel";
import { FilterPanel } from "./filterPanel";
import { useFilteredMatches } from "./filterPanel/useFilterMatches";
import { 搜索ResultsPanel, 搜索ResultsPanelHandle } from "./searchResultsPanel";
import { ServiceErrorException } from "@/lib/serviceError";
import { Session } from "next-auth";

interface 搜索ResultsPageProps {
    searchQuery: string;
    defaultMaxMatchCount: number;
    isRegexEnabled: boolean;
    isCaseSensitivityEnabled: boolean;
    session: Session | null;
    is搜索AssistSupported: boolean;
}

export const 搜索ResultsPage = ({
    searchQuery,
    defaultMaxMatchCount,
    isRegexEnabled,
    isCaseSensitivityEnabled,
    session,
    is搜索AssistSupported,
}: 搜索ResultsPageProps) => {
    const router = useRouter();
    const { set搜索History } = use搜索History();
    const { toast } = useToast();
    const captureEvent = useCaptureEvent();

    // Encodes the number of matches to return in the search response.
    const _maxMatchCount = parseInt(useNonEmptyQueryParam(搜索QueryParams.matches) ?? `${defaultMaxMatchCount}`);
    const maxMatchCount = isNaN(_maxMatchCount) ? defaultMaxMatchCount : _maxMatchCount;

    const {
        error,
        files,
        repoInfo,
        timeTo搜索CompletionMs,
        timeToFirst搜索ResultMs,
        isStreaming,
        numMatches,
        isExhaustive,
        stats,
    } = useStreamed搜索({
        query: searchQuery,
        matches: maxMatchCount,
        contextLines: 3,
        whole: false,
        isRegexEnabled,
        isCaseSensitivityEnabled,
    });

    useEffect(() => {
        if (error) {
            toast({
                description: `❌ 搜索 failed. Reason: ${error instanceof ServiceErrorException ? error.serviceError.message : error.message}`,
            });
        }
    }, [error, toast]);


    // Write the query to the search history
    useEffect(() => {
        if (searchQuery.length === 0) {
            return;
        }

        const now = new Date().toUTCString();
        set搜索History((searchHistory) => [
            {
                query: searchQuery,
                date: now,
            },
            ...searchHistory.filter(search => search.query !== searchQuery),
        ])
    }, [searchQuery, set搜索History]);

    // Look for any files that are not on the default branch.
    const isBranchFilteringEnabled = useMemo(() => {
        return searchQuery.includes('rev:');
    }, [searchQuery]);

    useEffect(() => {
        if (isStreaming || !stats) {
            return;
        }

        const fileLanguages = files.map(file => file.language) || [];

        console.debug('timeToFirst搜索ResultMs:', timeToFirst搜索ResultMs);
        console.debug('timeTo搜索CompletionMs:', timeTo搜索CompletionMs);

        captureEvent("search_finished", {
            durationMs: timeTo搜索CompletionMs,
            timeTo搜索CompletionMs,
            timeToFirst搜索ResultMs,
            fileCount: stats.fileCount,
            matchCount: stats.totalMatchCount,
            actualMatchCount: stats.actualMatchCount,
            filesSkipped: stats.filesSkipped,
            contentBytesLoaded: stats.contentBytesLoaded,
            indexBytesLoaded: stats.indexBytesLoaded,
            crashes: stats.crashes,
            shardFilesConsidered: stats.shardFilesConsidered,
            filesConsidered: stats.filesConsidered,
            filesLoaded: stats.filesLoaded,
            shardsScanned: stats.shardsScanned,
            shardsSkipped: stats.shardsSkipped,
            shardsSkippedFilter: stats.shardsSkippedFilter,
            ngramMatches: stats.ngramMatches,
            ngramLookups: stats.ngramLookups,
            wait: stats.wait,
            matchTreeConstruction: stats.matchTreeConstruction,
            matchTree搜索: stats.matchTree搜索,
            regexpsConsidered: stats.regexpsConsidered,
            flushReason: stats.flushReason,
            fileLanguages,
            is搜索Exhaustive: isExhaustive,
            isBranchFilteringEnabled,
        });
    }, [
        captureEvent,
        files,
        isStreaming,
        isExhaustive,
        stats,
        timeTo搜索CompletionMs,
        timeToFirst搜索ResultMs,
        isBranchFilteringEnabled,
    ]);

    const onLoadMoreResults = useCallback(() => {
        const url = createPathWithQueryParams(`/search`,
            [搜索QueryParams.query, searchQuery],
            [搜索QueryParams.matches, `${maxMatchCount * 2}`],
            [搜索QueryParams.isRegexEnabled, isRegexEnabled ? "true" : null],
            [搜索QueryParams.isCaseSensitivityEnabled, isCaseSensitivityEnabled ? "true" : null],
        )
        router.push(url);
    }, [maxMatchCount, router, searchQuery, isRegexEnabled, isCaseSensitivityEnabled]);

    
    return (
        <div class名称="flex flex-col h-screen overflow-clip">
            {/* TopBar */}
            <TopBar
                session={session}
            >
                <搜索Bar
                    size="sm"
                    defaults={{
                        isRegexEnabled,
                        isCaseSensitivityEnabled,
                        query: searchQuery,
                    }}
                    class名称="w-full"
                    is搜索AssistSupported={is搜索AssistSupported}
                />
            </TopBar>

            {error ? (
                <div class名称="flex flex-col items-center justify-center h-full gap-2">
                    <AlertTriangleIcon class名称="h-6 w-6" />
                    <p class名称="font-semibold text-center">Failed to search</p>
                    <p class名称="text-sm text-center">{error instanceof ServiceErrorException ? error.serviceError.message : error.message}</p>
                </div>
            ) : (
                <PanelGroup
                    fileMatches={files}
                    onLoadMoreResults={onLoadMoreResults}
                    numMatches={numMatches}
                    repoInfo={repoInfo}
                    searchDurationMs={timeTo搜索CompletionMs}
                    isStreaming={isStreaming}
                    searchStats={stats}
                    isMoreResultsButtonVisible={!isExhaustive}
                    isBranchFilteringEnabled={isBranchFilteringEnabled}
                />
            )}
        </div>
    );
}

interface PanelGroupProps {
    fileMatches: 搜索ResultFile[];
    onLoadMoreResults: () => void;
    isStreaming: boolean;
    isMoreResultsButtonVisible?: boolean;
    isBranchFilteringEnabled: boolean;
    repoInfo: Record<number, 仓库Info>;
    searchDurationMs: number;
    numMatches: number;
    searchStats?: 搜索Stats;
}

const PanelGroup = ({
    fileMatches,
    isMoreResultsButtonVisible,
    isStreaming,
    onLoadMoreResults,
    isBranchFilteringEnabled,
    repoInfo,
    searchDurationMs: _searchDurationMs,
    numMatches,
    searchStats,
}: PanelGroupProps) => {
    const [previewedFile, setPreviewedFile] = useState<搜索ResultFile | undefined>(undefined);
    const filteredFileMatches = useFilteredMatches(fileMatches);
    const filterPanelRef = useRef<ImperativePanelHandle>(null);
    const searchResultsPanelRef = useRef<搜索ResultsPanelHandle>(null);
    const [selectedMatchIndex, setSelectedMatchIndex] = useState(0);

    const [isFilterPanelCollapsed, setIsFilterPanelCollapsed] = useLocalStorage('isFilterPanelCollapsed', false);

    useHotkeys("mod+b", () => {
        if (isFilterPanelCollapsed) {
            filterPanelRef.current?.expand();
        } else {
            filterPanelRef.current?.collapse();
        }
    }, {
        enableOnFormTags: true,
        enableOnContent编辑able: true,
        description: "Toggle filter panel",
    });

    const searchDurationMs = useMemo(() => {
        return Math.round(_searchDurationMs);
    }, [_searchDurationMs]);

    return (
        <ResizablePanelGroup
            direction="horizontal"
            class名称="h-full"
        >
            {/* ~~ Filter panel ~~ */}
            <ResizablePanel
                ref={filterPanelRef}
                minSize={20}
                maxSize={30}
                defaultSize={isFilterPanelCollapsed ? 0 : 20}
                collapsible={true}
                id={'filter-panel'}
                order={1}
                onCollapse={() => setIsFilterPanelCollapsed(true)}
                onExpand={() => setIsFilterPanelCollapsed(false)}
            >
                <FilterPanel
                    matches={fileMatches}
                    repoInfo={repoInfo}
                    isStreaming={isStreaming}
                    onFilterChange={() => {
                        searchResultsPanelRef.current?.resetScroll();
                    }}
                />
            </ResizablePanel>
            {isFilterPanelCollapsed && (
                <div class名称="flex flex-col items-center h-full p-2">
                    <Tooltip
                        delayDuration={100}
                    >
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                class名称="h-8 w-8"
                                onClick={() => {
                                    filterPanelRef.current?.expand();
                                }}
                            >
                                <FilterIcon class名称="w-4 h-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" class名称="flex flex-row items-center gap-2">
                            <KeyboardShortcutHint shortcut="mod+b" />
                            <Separator orientation="vertical" class名称="h-4" />
                            <span>Open filter panel</span>
                        </TooltipContent>
                    </Tooltip>
                </div>
            )}
            <AnimatedResizableHandle />

            {/* ~~ 搜索 results ~~ */}
            <ResizablePanel
                minSize={10}
                id={'search-results-panel'}
                order={2}
            >
                <div class名称="flex h-full flex-col">
                    <div class名称="py-1 px-2 flex flex-row items-center">
                        {isStreaming ? (
                            <>
                                <RefreshCwIcon class名称="h-4 w-4 animate-spin mr-2" />
                                <p class名称="text-sm font-medium mr-1">搜索ing...</p>
                                {numMatches > 0 && (
                                    <p class名称="text-sm font-medium">{`Found ${numMatches} matches in ${fileMatches.length} ${fileMatches.length > 1 ? 'files' : 'file'}`}</p>
                                )}
                            </>
                        ) : (
                            <>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <InfoCircledIcon class名称="w-4 h-4 mr-2" />
                                    </TooltipTrigger>
                                    <TooltipContent side="right" class名称="flex flex-col items-start gap-2 p-4">
                                        <div class名称="flex flex-row items-center w-full">
                                            <BugIcon class名称="w-4 h-4 mr-1.5" />
                                            <p class名称="text-md font-medium">搜索 stats for nerds</p>
                                            <复制IconButton
                                                on复制={() => {
                                                    navigator.clipboard.writeText(JSON.stringify(searchStats, null, 2));
                                                    return true;
                                                }}
                                                class名称="ml-auto"
                                            />
                                        </div>
                                        <CodeSnippet renderNewlines>
                                            {JSON.stringify(searchStats, null, 2)}
                                        </CodeSnippet>
                                    </TooltipContent>
                                </Tooltip>
                                {
                                    fileMatches.length > 0 ? (
                                        <p class名称="text-sm font-medium">{`[${searchDurationMs} ms] Found ${numMatches} matches in ${fileMatches.length} ${fileMatches.length > 1 ? 'files' : 'file'}`}</p>
                                    ) : (
                                        <p class名称="text-sm font-medium">No results</p>
                                    )
                                }
                                {isMoreResultsButtonVisible && (
                                    <div
                                        class名称="cursor-pointer text-blue-500 text-sm hover:underline ml-4"
                                        onClick={onLoadMoreResults}
                                    >
                                        (load more)
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    <div class名称="flex-1 min-h-0">
                        {filteredFileMatches.length > 0 ? (
                            <搜索ResultsPanel
                                ref={searchResultsPanelRef}
                                fileMatches={filteredFileMatches}
                                onOpenFilePreview={(fileMatch, matchIndex) => {
                                    setSelectedMatchIndex(matchIndex ?? 0);
                                    setPreviewedFile(fileMatch);
                                }}
                                isLoadMoreButtonVisible={!!isMoreResultsButtonVisible}
                                onLoadMoreButtonClicked={onLoadMoreResults}
                                isBranchFilteringEnabled={isBranchFilteringEnabled}
                                repoInfo={repoInfo}
                            />
                        ) : isStreaming ? (
                            <div class名称="flex flex-col items-center justify-center h-full gap-2">
                                <RefreshCwIcon class名称="h-6 w-6 animate-spin" />
                                <p class名称="font-semibold text-center">搜索ing...</p>
                            </div>
                        ) : (
                            <div class名称="flex flex-col items-center justify-center h-full">
                                <p class名称="text-sm text-muted-foreground">No results found</p>
                            </div>
                        )}
                    </div>
                </div>
            </ResizablePanel>

            {previewedFile && (
                <>
                    <AnimatedResizableHandle />
                    {/* ~~ Code preview ~~ */}
                    <ResizablePanel
                        minSize={10}
                        collapsible={true}
                        id={'code-preview-panel'}
                        order={3}
                        onCollapse={() => setPreviewedFile(undefined)}
                    >
                        <CodePreviewPanel
                            previewedFile={previewedFile}
                            on关闭={() => setPreviewedFile(undefined)}
                            selectedMatchIndex={selectedMatchIndex}
                            onSelectedMatchIndexChange={setSelectedMatchIndex}
                        />
                    </ResizablePanel>
                </>
            )}
        </ResizablePanelGroup>
    )
}
