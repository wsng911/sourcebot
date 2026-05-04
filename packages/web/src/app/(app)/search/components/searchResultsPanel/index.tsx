'use client';

import { 仓库Info, 搜索ResultFile } from "@/features/search";
import { useVirtualizer, VirtualItem } from "@tanstack/react-virtual";
import { useDebounce } from "@uidotdev/usehooks";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { useMap } from "usehooks-ts";
import { FileMatchContainer, MAX_MATCHES_TO_PREVIEW } from "./fileMatchContainer";

interface 搜索ResultsPanelProps {
    fileMatches: 搜索ResultFile[];
    onOpenFilePreview: (fileMatch: 搜索ResultFile, matchIndex?: number) => void;
    isLoadMoreButtonVisible: boolean;
    onLoadMoreButtonClicked: () => void;
    isBranchFilteringEnabled: boolean;
    repoInfo: Record<number, 仓库Info>;
}

export interface 搜索ResultsPanelHandle {
    resetScroll: () => void;
}

const ESTIMATED_LINE_HEIGHT_PX = 20;
const ESTIMATED_NUMBER_OF_LINES_PER_CODE_CELL = 10;
const ESTIMATED_MATCH_CONTAINER_HEIGHT_PX = 30;

type ScrollHistoryState = {
    scrollOffset?: number;
    measurementsCache?: VirtualItem[];
    showAllMatchesMap?: [string, boolean][];
}

/**
 * Unique key for a given file match. Used to store the "show all matches" state for a
 * given file match.
 */
const getFileMatchKey = (fileMatch: 搜索ResultFile) => {
    return `${fileMatch.repository}-${fileMatch.file名称.text}`;
}

export const 搜索ResultsPanel = forwardRef<搜索ResultsPanelHandle, 搜索ResultsPanelProps>(({
    fileMatches,
    onOpenFilePreview,
    isLoadMoreButtonVisible,
    onLoadMoreButtonClicked,
    isBranchFilteringEnabled,
    repoInfo,
}, ref) => {
    const parentRef = useRef<HTMLDivElement>(null);

    // Restore the scroll offset, measurements cache, and other state from the history
    // state. This enables us to restore the scroll offset when the user navigates back
    // to the page.
    // @see: https://github.com/TanStack/virtual/issues/378#issuecomment-2173670081
    const {
        scrollOffset: restoreOffset,
        measurementsCache: restoreMeasurementsCache,
        showAllMatchesMap: restoreShowAllMatchesStates,
    } = (history.state ?? {}) as ScrollHistoryState;

    const [showAllMatchesMap, showAllMatches操作] = useMap<string, boolean>(restoreShowAllMatchesStates || []);

    const virtualizer = useVirtualizer({
        count: fileMatches.length,
        getScrollElement: () => parentRef.current,
        estimateSize: (index) => {
            const fileMatch = fileMatches[index];
            const showAllMatches = showAllMatchesMap.get(getFileMatchKey(fileMatch));

            // Quick guesstimation ;) This needs to be quick since the virtualizer will
            // run this upfront for all items in the list.
            const numCodeCells = fileMatch.chunks
                .slice(0, showAllMatches ? fileMatch.chunks.length : MAX_MATCHES_TO_PREVIEW)
                .length;

            const estimatedSize =
                numCodeCells * ESTIMATED_NUMBER_OF_LINES_PER_CODE_CELL * ESTIMATED_LINE_HEIGHT_PX +
                ESTIMATED_MATCH_CONTAINER_HEIGHT_PX;

            return estimatedSize;
        },
        initialOffset: restoreOffset,
        initialMeasurementsCache: restoreMeasurementsCache,
        enabled: true,
        overscan: 10,
        debug: false,
    });

    const resetScroll = useCallback(() => {
        virtualizer.scrollToIndex(0);
    }, [virtualizer]);

    // Expose the resetScroll function to parent components
    useImperativeHandle(ref, () => ({
        resetScroll,
    }), [resetScroll]);


    // 保存 the scroll state to the history stack.
    const debouncedScrollOffset = useDebounce(virtualizer.scrollOffset, 500);
    useEffect(() => {
        history.replaceState(
            {
                scrollOffset: debouncedScrollOffset ?? undefined,
                measurementsCache: virtualizer.measurementsCache,
                showAllMatchesMap: Array.from(showAllMatchesMap.entries()),
            } satisfies ScrollHistoryState,
            '',
            window.location.href
        );
    }, [debouncedScrollOffset, virtualizer.measurementsCache, showAllMatchesMap]);

    const onShowAllMatchesButtonClicked = useCallback((fileMatchKey: string, index: number) => {
        const wasShown = showAllMatchesMap.get(fileMatchKey) ?? false;
        showAllMatches操作.set(fileMatchKey, !wasShown);

        // When collapsing, scroll to the top of the file match container. This ensures
        // that the focused "show fewer matches" button is visible.
        if (wasShown) {
            virtualizer.scrollToIndex(index, {
                align: 'start'
            });
        }
    }, [showAllMatches操作, showAllMatchesMap, virtualizer]);


    return (
        <div
            ref={parentRef}
            style={{
                width: "100%",
                height: "100%",
                overflowY: 'auto',
                contain: 'strict',
            }}
        >
            <div
                style={{
                    height: virtualizer.getTotalSize(),
                    width: "100%",
                    position: "relative",
                }}
            >
                {virtualizer.getVirtualItems().map((virtualRow) => {
                    const file = fileMatches[virtualRow.index];
                    return (
                        <div
                            key={virtualRow.key}
                            data-index={virtualRow.index}
                            ref={virtualizer.measureElement}
                            style={{
                                position: 'absolute',
                                transform: `translateY(${virtualRow.start}px)`,
                                top: 0,
                                left: 0,
                                width: '100%',
                            }}
                        >
                            <FileMatchContainer
                                file={file}
                                onOpenFilePreview={(matchIndex) => {
                                    onOpenFilePreview(file, matchIndex);
                                }}
                                showAllMatches={showAllMatchesMap.get(getFileMatchKey(file)) ?? false}
                                onShowAllMatchesButtonClicked={() => {
                                    onShowAllMatchesButtonClicked(getFileMatchKey(file), virtualRow.index);
                                }}
                                isBranchFilteringEnabled={isBranchFilteringEnabled}
                                repoInfo={repoInfo}
                                yOffset={virtualRow.start}
                            />
                        </div>
                    )
                })}
            </div>
            {isLoadMoreButtonVisible && (
                <div class名称="p-3">
                    <span
                        class名称="cursor-pointer text-blue-500 hover:underline"
                        onClick={onLoadMoreButtonClicked}
                    >
                        Load more results
                    </span>
                </div>
            )}
        </div>
    )
});

搜索ResultsPanel.display名称 = '搜索ResultsPanel';
