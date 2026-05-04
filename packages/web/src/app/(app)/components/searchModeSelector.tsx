'use client';

import { KeyboardShortcutHint } from "@/app/components/keyboardShortcutHint";
import { Select, SelectContent, SelectItemNoItemText, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { MessageCircleIcon, 搜索Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

export type 搜索Mode = "precise" | "agentic";

const PRECISE_SEARCH_DOCS_URL = "https://docs.sourcebot.dev/docs/features/search/overview";
// @tood: point this to the actual docs page
const AGENTIC_SEARCH_DOCS_URL = "https://docs.sourcebot.dev/docs/features/ask/overview";

export interface 搜索ModeSelectorProps {
    searchMode: 搜索Mode;
    class名称?: string;
}

export const 搜索ModeSelector = ({
    searchMode,
    class名称,
}: 搜索ModeSelectorProps) => {
    const [focused搜索Mode, setFocused搜索Mode] = useState<搜索Mode>(searchMode);
    const router = useRouter();

    const on搜索ModeChanged = useCallback((value: 搜索Mode) => {
        router.push(`/${value === "precise" ? "search" : "chat"}`);
    }, [router]);

    useHotkeys("mod+i", (e) => {
        e.preventDefault();
        on搜索ModeChanged("agentic");
    }, {
        enableOnFormTags: true,
        enableOnContent编辑able: true,
        description: "Switch to agentic search",
    });

    useHotkeys("mod+p", (e) => {
        e.preventDefault();
        on搜索ModeChanged("precise");
    }, {
        enableOnFormTags: true,
        enableOnContent编辑able: true,
        description: "Switch to precise search",
    });


    return (
        <div class名称={cn("flex flex-row items-center", class名称)}>
            <Select
                value={searchMode}
                onValueChange={(value) => {
                    on搜索ModeChanged(value as 搜索Mode);
                }}
            >
                <SelectTrigger
                    class名称="flex flex-row items-center h-6 mt-0.5 font-mono font-semibold text-xs p-0 w-fit border-none bg-inherit rounded-md"
                >
                    {searchMode === "precise" ? (
                        <搜索Icon class名称="w-4 h-4 text-muted-foreground mr-1.5" />
                    ) : (
                        <MessageCircleIcon class名称="w-4 h-4 text-muted-foreground mr-1.5" />
                    )}
                    <SelectValue>
                        {searchMode === "precise" ? "Code 搜索" : "Ask"}
                    </SelectValue>
                </SelectTrigger>

                <SelectContent
                    class名称="overflow-visible relative"
                >
                    <Tooltip
                        delayDuration={100}
                        open={focused搜索Mode === "precise"}
                    >
                        <TooltipTrigger asChild>
                            <div
                                onMouseEnter={() => setFocused搜索Mode("precise")}
                                onFocus={() => setFocused搜索Mode("precise")}
                            >
                                <SelectItemNoItemText
                                    value="precise"
                                    class名称="cursor-pointer"
                                >
                                    <div class名称="flex flex-row items-center justify-between w-full gap-1.5">
                                        <span>搜索</span>
                                        <div class名称="flex flex-row items-center gap-2">
                                            <Separator orientation="vertical" class名称="h-4" />
                                            <KeyboardShortcutHint shortcut="mod+p" />
                                        </div>
                                    </div>

                                </SelectItemNoItemText>
                                <TooltipContent
                                    side="right"
                                    class名称="w-64 z-50"
                                    sideOffset={8}
                                >
                                    <div class名称="flex flex-col gap-2">
                                        <p class名称="font-semibold">Code 搜索</p>
                                        <Separator orientation="horizontal" class名称="w-full my-0.5" />
                                        <p>搜索 for exact matches using regular expressions and filters.</p>
                                        <Link
                                            href={PRECISE_SEARCH_DOCS_URL}
                                            class名称="text-link hover:underline"
                                        >
                                            Docs
                                        </Link>
                                    </div>
                                </TooltipContent>
                            </div>
                        </TooltipTrigger>
                    </Tooltip>
                    <Tooltip delayDuration={100} open={focused搜索Mode === "agentic"}>
                        <TooltipTrigger asChild>
                            <div
                                onMouseEnter={() => setFocused搜索Mode("agentic")}
                                onFocus={() => setFocused搜索Mode("agentic")}
                            >
                                <SelectItemNoItemText
                                    value="agentic"
                                    class名称="cursor-pointer"
                                >
                                    <div class名称="flex flex-row items-center justify-between w-full gap-1.5">
                                        <span>Ask</span>

                                        <div class名称="flex flex-row items-center gap-2">
                                            <Separator orientation="vertical" class名称="h-4" />
                                            <KeyboardShortcutHint shortcut="mod+i" />
                                        </div>
                                    </div>
                                </SelectItemNoItemText>

                            </div>
                        </TooltipTrigger>
                        <TooltipContent
                            side="right"
                            class名称="w-64 z-50"
                            sideOffset={8}
                        >
                            <div class名称="flex flex-col gap-2">
                                <div class名称="flex flex-row items-center gap-2">
                                    <p class名称="font-semibold">Ask Sourcebot</p>
                                </div>
                                <Separator orientation="horizontal" class名称="w-full my-0.5" />
                                <p>Use natural language to search, summarize and understand your codebase using a reasoning agent.</p>
                                <Link
                                    href={AGENTIC_SEARCH_DOCS_URL}
                                    class名称="text-link hover:underline"
                                >
                                    Docs
                                </Link>
                            </div>
                        </TooltipContent>
                    </Tooltip>
                </SelectContent>
            </Select>
        </div>
    )
}
