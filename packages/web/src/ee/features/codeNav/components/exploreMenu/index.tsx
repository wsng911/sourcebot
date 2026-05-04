'use client';

import { useBrowseState } from "@/app/(app)/browse/hooks/useBrowseState";
import { find搜索BasedSymbolDefinitions, find搜索BasedSymbolReferences } from "@/app/api/(client)/client";
import { AnimatedResizableHandle } from "@/components/ui/animatedResizableHandle";
import { Badge } from "@/components/ui/badge";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { measure, unwrapServiceError } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { GlobeIcon, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { VscSymbolMisc } from "react-icons/vsc";
import { ReferenceList } from "./referenceList";
import { KeyboardShortcutHint } from "@/app/components/keyboardShortcutHint";
import { useHotkeys } from "react-hotkeys-hook";
import useCaptureEvent from "@/hooks/useCaptureEvent";

interface ExploreMenuProps {
    selectedSymbolInfo: {
        symbol名称: string;
        repo名称: string;
        revision名称: string;
        language: string;
    }
}

export const ExploreMenu = ({
    selectedSymbolInfo,
}: ExploreMenuProps) => {
    const captureEvent = useCaptureEvent();
    const {
        state: { activeExploreMenuTab },
        updateBrowseState,
    } = useBrowseState();

    const [isGlobal搜索Enabled, setIsGlobal搜索Enabled] = useState(false);

    const {
        data: referencesResponse,
        isError: isReferencesResponseError,
        isPending: isReferencesResponsePending,
        isLoading: isReferencesResponseLoading,
    } = useQuery({
        queryKey: ["references", selectedSymbolInfo.symbol名称, selectedSymbolInfo.repo名称, selectedSymbolInfo.revision名称, selectedSymbolInfo.language, isGlobal搜索Enabled],
        queryFn: async () => {
            const response = await measure(() => unwrapServiceError(
                find搜索BasedSymbolReferences({
                    symbol名称: selectedSymbolInfo.symbol名称,
                    language: selectedSymbolInfo.language,
                    revision名称: selectedSymbolInfo.revision名称,
                    repo名称: isGlobal搜索Enabled ? undefined : selectedSymbolInfo.repo名称
                })
            ), 'find搜索BasedSymbolReferences', false);

            captureEvent('wa_explore_menu_references_loaded', {
                durationMs: response.durationMs,
                isGlobal搜索Enabled,
            })

            return response.data;
        }
    });

    const {
        data: definitionsResponse,
        isError: isDefinitionsResponseError,
        isPending: isDefinitionsResponsePending,
        isLoading: isDefinitionsResponseLoading,
    } = useQuery({
        queryKey: ["definitions", selectedSymbolInfo.symbol名称, selectedSymbolInfo.repo名称, selectedSymbolInfo.revision名称, selectedSymbolInfo.language, isGlobal搜索Enabled],
        queryFn: async () => {
            const response = await measure(() => unwrapServiceError(
                find搜索BasedSymbolDefinitions({
                    symbol名称: selectedSymbolInfo.symbol名称,
                    language: selectedSymbolInfo.language,
                    revision名称: selectedSymbolInfo.revision名称,
                    repo名称: isGlobal搜索Enabled ? undefined : selectedSymbolInfo.repo名称
                })
            ), 'find搜索BasedSymbolDefinitions', false);

            captureEvent('wa_explore_menu_definitions_loaded', {
                durationMs: response.durationMs,
                isGlobal搜索Enabled,
            })

            return response.data;
        }
    });

    useHotkeys('shift+a', () => {
        setIsGlobal搜索Enabled(prev => !prev);
    }, {
        enableOnFormTags: true,
        enableOnContent编辑able: true,
        description: "搜索 all repositories",
    });

    const isPending = isReferencesResponsePending || isDefinitionsResponsePending;
    const isLoading = isReferencesResponseLoading || isDefinitionsResponseLoading;
    const isError = isDefinitionsResponseError || isReferencesResponseError;

    if (isPending || isLoading) {
        return (
            <div class名称="flex flex-row items-center justify-center h-full">
                <Loader2 class名称="w-4 h-4 animate-spin mr-2" />
                加载中...
            </div>
        )
    }

    if (isError) {
        return (
            <div class名称="flex flex-row items-center justify-center h-full">
                <p>Error loading {activeExploreMenuTab}</p>
            </div>
        )
    }

    const data = activeExploreMenuTab === "references" ?
        referencesResponse :
        definitionsResponse;

    return (
        <ResizablePanelGroup
            direction="horizontal"
        >
            <ResizablePanel
                minSize={10}
                maxSize={20}
                class名称="flex flex-col h-full"
            >
                <div class名称="flex flex-col p-2">
                    <div class名称="flex flex-row items-center justify-between">

                        <Tooltip
                            delayDuration={100}
                        >
                            <TooltipTrigger
                                disabled={true}
                                class名称="mr-auto"
                            >
                                <Badge
                                    variant="outline"
                                    class名称="w-fit h-fit flex-shrink-0 select-none"
                                >
                                    搜索 Based
                                </Badge>
                            </TooltipTrigger>
                            <TooltipContent
                                side="top"
                                align="center"
                            >
                                Symbol references and definitions found using a best-guess search heuristic.
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span>
                                    <Toggle
                                        pressed={isGlobal搜索Enabled}
                                        onPressedChange={setIsGlobal搜索Enabled}
                                    >
                                        <GlobeIcon class名称="w-4 h-4" />
                                    </Toggle>
                                </span>
                            </TooltipTrigger>
                            <TooltipContent side="top" align="center">
                                搜索 all repositories
                                <KeyboardShortcutHint
                                    shortcut="shift+a"
                                    class名称="ml-2"
                                />
                            </TooltipContent>
                        </Tooltip>
                    </div>
                    <div class名称="flex flex-col gap-1 mt-4">
                        <Entry
                            name="References"
                            isSelected={activeExploreMenuTab === "references"}
                            count={referencesResponse?.stats.matchCount}
                            onClicked={() => {
                                updateBrowseState({ activeExploreMenuTab: "references" });
                            }}
                        />
                        <Entry
                            name="Definitions"
                            isSelected={activeExploreMenuTab === "definitions"}
                            count={definitionsResponse.stats.matchCount}
                            onClicked={() => {
                                updateBrowseState({ activeExploreMenuTab: "definitions" });
                            }}
                        />
                    </div>
                </div>
            </ResizablePanel>
            <AnimatedResizableHandle />
            <ResizablePanel>
                {data.files.length > 0 ? (
                    <ReferenceList
                        data={data}
                        revision名称={selectedSymbolInfo.revision名称}
                    />
                ) : (
                    <div class名称="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <VscSymbolMisc class名称="w-6 h-6 mb-2" />
                        <p class名称="text-sm">No {activeExploreMenuTab} found</p>
                    </div>
                )}
            </ResizablePanel>
        </ResizablePanelGroup>

    )
}

interface EntryProps {
    name: string;
    isSelected: boolean;
    count?: number;
    onClicked: () => void;
}

const Entry = ({
    name,
    isSelected,
    count,
    onClicked,
}: EntryProps) => {
    const countText = useMemo(() => {
        if (count === undefined) {
            return "?";
        }

        if (count > 999) {
            return "999+";
        }
        return count.toString();
    }, [count]);

    return (
        <div
            class名称={clsx(
                "flex flex-row items-center justify-between p-1 rounded-md cursor-pointer gap-2 select-none",
                {
                    "hover:bg-gray-200 dark:hover:bg-gray-700": !isSelected,
                    "bg-blue-200 dark:bg-blue-400": isSelected,
                }
            )}
            onClick={() => onClicked()}
        >
            <p class名称="text-sm font-medium">{name}</p>
            <div class名称="px-2 py-0.5 bg-accent text-sm rounded-md">
                {countText}
            </div>
        </div>
    );
}
