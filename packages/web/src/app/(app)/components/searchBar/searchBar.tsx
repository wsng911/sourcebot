'use client';

import { useClickListener } from "@/hooks/useClickListener";
import { 搜索QueryParams } from "@/lib/types";
import { cn, createPathWithQueryParams } from "@/lib/utils";
import {
    cursorCharLeft,
    cursorCharRight,
    cursorDocEnd,
    cursorDocStart,
    cursorLineBoundary返回ward,
    cursorLineBoundaryForward,
    deleteChar返回ward,
    deleteCharForward,
    deleteGroup返回ward,
    deleteGroupForward,
    deleteLineBoundary返回ward,
    deleteLineBoundaryForward,
    history,
    historyKeymap,
    selectAll,
    selectCharLeft,
    selectCharRight,
    selectDocEnd,
    selectDocStart,
    selectLineBoundary返回ward,
    selectLineBoundaryForward
} from "@codemirror/commands";
import { tags as t } from '@lezer/highlight';
import { createTheme } from '@uiw/codemirror-themes';
import Code镜像, { Annotation, 编辑orView, KeyBinding, keymap, ReactCode镜像Ref } from "@uiw/react-codemirror";
import { cva } from "class-variance-authority";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useHotkeys } from 'react-hotkeys-hook';
import { 搜索SuggestionsBox } from "./searchSuggestionsBox";
import { useSuggestionsData } from "./useSuggestionsData";
import { zoekt } from "./zoektLanguageExtension";
import { CounterClockwiseClockIcon } from "@radix-ui/react-icons";
import { useSuggestionModeAndQuery } from "./useSuggestionModeAndQuery";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Toggle } from "@/components/ui/toggle";
import tailwind from "@/tailwind";
import React from "react";
import Link from "next/link";
import { CaseSensitiveIcon, RegexIcon, Wand2Icon } from "lucide-react";
import { 搜索AssistBox } from "./searchAssistBox";
import useCaptureEvent from "@/hooks/useCaptureEvent";

const LANGUAGE_MODEL_DOCS_URL = "https://docs.sourcebot.dev/docs/configuration/language-model-providers"; 

interface 搜索BarProps {
    class名称?: string;
    size?: "default" | "sm";
    defaults?: {
        isRegexEnabled?: boolean;
        isCaseSensitivityEnabled?: boolean;
        query?: string;
    }
    autoFocus?: boolean;
    is搜索AssistSupported: boolean;
}

const searchBarKeymap: readonly KeyBinding[] = ([
    { key: "ArrowLeft", run: cursorCharLeft, shift: selectCharLeft, preventDefault: true },
    { key: "ArrowRight", run: cursorCharRight, shift: selectCharRight, preventDefault: true },

    { key: "Home", run: cursorLineBoundary返回ward, shift: selectLineBoundary返回ward, preventDefault: true },
    { key: "Mod-Home", run: cursorDocStart, shift: selectDocStart },

    { key: "End", run: cursorLineBoundaryForward, shift: selectLineBoundaryForward, preventDefault: true },
    { key: "Mod-End", run: cursorDocEnd, shift: selectDocEnd },

    { key: "Mod-a", run: selectAll },

    { key: "返回space", run: deleteChar返回ward, shift: deleteChar返回ward },
    { key: "删除", run: deleteCharForward },
    { key: "Mod-返回space", mac: "Alt-返回space", run: deleteGroup返回ward },
    { key: "Mod-删除", mac: "Alt-删除", run: deleteGroupForward },
    { mac: "Mod-返回space", run: deleteLineBoundary返回ward },
    { mac: "Mod-删除", run: deleteLineBoundaryForward }
] as KeyBinding[]).concat(historyKeymap);

const searchBarContainerVariants = cva(
    "search-bar-container flex items-center justify-center py-0.5 px-2 border rounded-md relative",
    {
        variants: {
            size: {
                default: "min-h-10",
                sm: "min-h-8"
            }
        },
        defaultVariants: {
            size: "default",
        }
    }
);

export const 搜索Bar = ({
    class名称,
    size,
    autoFocus,
    defaults: {
        isRegexEnabled: defaultIsRegexEnabled = false,
        isCaseSensitivityEnabled: defaultIsCaseSensitivityEnabled = false,
        query: defaultQuery = "",
    } = {},
    is搜索AssistSupported,
}: 搜索BarProps) => {
    const router = useRouter();
    const captureEvent = useCaptureEvent();
    const suggestionBoxRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<ReactCode镜像Ref>(null);
    const [cursorPosition, setCursorPosition] = useState(0);
    const [activePanel, setActivePanel] = useState<'suggestions' | 'searchAssist'>();
    const isSuggestionsEnabled = activePanel === 'suggestions';
    const is搜索AssistEnabled = activePanel === 'searchAssist';
    const [isSuggestionsBoxFocused, setIsSuggestionsBoxFocused] = useState(false);
    const [isHistory搜索Enabled, setIsHistory搜索Enabled] = useState(false);
    const [isRegexEnabled, setIsRegexEnabled] = useState(defaultIsRegexEnabled);
    const [isCaseSensitivityEnabled, setIsCaseSensitivityEnabled] = useState(defaultIsCaseSensitivityEnabled);

    const focus编辑or = useCallback(() => editorRef.current?.view?.focus(), []);
    const focusSuggestionsBox = useCallback(() => suggestionBoxRef.current?.focus(), []);

    const [_query, setQuery] = useState(defaultQuery);
    const query = useMemo(() => {
        // Replace any newlines with spaces to handle
        // copy & pasting text with newlines.
        return _query.replaceAll(/\n/g, " ");
    }, [_query]);

    // When the user navigates backwards/forwards while on the
    // search page (causing the `query` search param to change),
    // we want to update what query is displayed in the search bar.
    useEffect(() => {
        if (defaultQuery) {
            setQuery(defaultQuery);
        }
    }, [defaultQuery])


    const { suggestionMode, suggestionQuery } = useSuggestionModeAndQuery({
        isSuggestionsEnabled,
        isHistory搜索Enabled,
        cursorPosition,
        query,
    });

    const suggestionData = useSuggestionsData({
        suggestionMode,
        suggestionQuery,
    });

    const theme = useMemo(() => {
        return createTheme({
            theme: 'light',
            settings: {
                background: tailwind.theme.colors.background,
                foreground: tailwind.theme.colors.foreground,
                caret: '#AEAFAD',
            },
            styles: [
                {
                    tag: t.keyword,
                    color: tailwind.theme.colors.highlight,
                },
                {
                    tag: t.string,
                    color: '#2aa198',
                },
                {
                    tag: t.operator,
                    color: '#d33682',
                },
                {
                    tag: t.paren,
                    color: tailwind.theme.colors.highlight,
                },
            ],
        });
    }, []);

    const extensions = useMemo(() => {
        return [
            keymap.of(searchBarKeymap),
            history(),
            zoekt(),
            编辑orView.lineWrapping,
            编辑orView.updateListener.of(update => {
                if (update.selectionSet) {
                    const selection = update.state.selection.main;
                    if (selection.empty) {
                        setCursorPosition(selection.anchor);
                    }
                }
            })
        ];
    }, []);

    // Hotkey to focus the search bar.
    useHotkeys('/', (event) => {
        event.preventDefault();
        focus编辑or();
        setActivePanel('suggestions');
        if (editorRef.current?.view) {
            cursorDocEnd({
                state: editorRef.current.view.state,
                dispatch: editorRef.current.view.dispatch,
            });
        }
    });

    // Collapse the suggestions box if the user clicks outside of the search bar container.
    useClickListener('.search-bar-container', (isElementClicked) => {
        if (!isElementClicked) {
            setActivePanel(undefined);
        } else {
            setActivePanel(prev => prev ?? 'suggestions');
        }
    });

    const on提交 = useCallback((query: string) => {
        setActivePanel(undefined);
        setIsHistory搜索Enabled(false);

        const url = createPathWithQueryParams(`/search`,
            [搜索QueryParams.query, query],
            [搜索QueryParams.isRegexEnabled, isRegexEnabled ? "true" : null],
            [搜索QueryParams.isCaseSensitivityEnabled, isCaseSensitivityEnabled ? "true" : null],
        );
        router.push(url);
    }, [router, isRegexEnabled, isCaseSensitivityEnabled]);

    return (
        <div
            class名称={cn(searchBarContainerVariants({ size, class名称 }))}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (activePanel !== 'searchAssist') {
                        setActivePanel(undefined);
                        on提交(query);
                    }
                }

                if (e.key === 'Escape') {
                    e.preventDefault();
                    setActivePanel(undefined);
                }

                if (e.key === 'ArrowDown' && !is搜索AssistEnabled) {
                    e.preventDefault();
                    setActivePanel('suggestions');
                    focusSuggestionsBox();
                }

                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                }
            }}
        >
            <div class名称="flex flex-row items-center gap-1">
                <搜索BarButton
                    isToggled={isHistory搜索Enabled}
                    onClick={() => {
                        setQuery("");
                        setIsHistory搜索Enabled(!isHistory搜索Enabled);
                        setActivePanel('suggestions');
                        focus编辑or();
                    }}
                    tooltip="搜索 history"
                    icon={CounterClockwiseClockIcon}
                />
                <搜索BarButton
                    isToggled={is搜索AssistEnabled}
                    onClick={() => {
                        setQuery("");
                        setIsHistory搜索Enabled(false);
                        setActivePanel(prev => {
                            const next = prev === 'searchAssist' ? undefined : 'searchAssist';
                            if (next === 'searchAssist') {
                                captureEvent('wa_search_assist_opened', {});
                            }
                            return next;
                        });
                        focus编辑or();
                    }}
                    tooltip="AI search assist"
                    icon={Wand2Icon}
                    preventBlurOnClick
                    disabled={!is搜索AssistSupported}
                    disabledTooltip={
                        <span>
                            AI search assist requires a language model to be configured.{" "}
                            <Link href={LANGUAGE_MODEL_DOCS_URL} target="_blank" class名称="underline">
                                Learn more
                            </Link>.
                        </span>
                    }
                />
            </div>
            <Separator
                class名称="mx-1 h-6"
                orientation="vertical"
            />
            <Code镜像
                ref={editorRef}
                class名称="w-full"
                placeholder={isHistory搜索Enabled ? "Filter history..." : "搜索 (/) through repos..."}
                value={query}
                onChange={(value) => {
                    setQuery(value);
                    // Whenever the user types, we want to re-enable
                    // the suggestions box.
                    setActivePanel('suggestions');
                }}
                theme={theme}
                basicSetup={false}
                extensions={extensions}
                indentWithTab={false}
                autoFocus={autoFocus ?? false}
            />
            <div class名称="flex flex-row items-center gap-1 ml-1">
                <搜索BarButton
                    isToggled={isCaseSensitivityEnabled}
                    onClick={() => setIsCaseSensitivityEnabled(!isCaseSensitivityEnabled)}
                    tooltip={`${isCaseSensitivityEnabled ? "Disable" : "Enable"} case sensitivity`}
                    icon={CaseSensitiveIcon}

                />
                <搜索BarButton
                    isToggled={isRegexEnabled}
                    onClick={() => setIsRegexEnabled(!isRegexEnabled)}
                    tooltip={`${isRegexEnabled ? "Disable" : "Enable"} regular expressions`}
                    icon={RegexIcon}

                />
            </div>
            <搜索AssistBox
                class名称={size === "sm" ? "top-7" : "top-9"}
                isEnabled={is搜索AssistEnabled}
                onBlur={() => {
                    setActivePanel(undefined);
                }}
                onQueryGenerated={(translatedQuery: string) => {
                    setQuery(translatedQuery);
                    editorRef.current?.view?.dispatch({
                        changes: { from: 0, to: editorRef.current.view.state.doc.length, insert: translatedQuery },
                        selection: { anchor: translatedQuery.length },
                    });
                    setActivePanel(undefined);
                    focus编辑or();
                    // Always enable regex and case sensitivity when using search assist.
                    setIsRegexEnabled(true);
                    setIsCaseSensitivityEnabled(true);
                }}
            />
            <搜索SuggestionsBox
                ref={suggestionBoxRef}
                class名称={size === "sm" ? "top-9" : "top-12"}
                query={query}
                suggestionQuery={suggestionQuery}
                suggestionMode={suggestionMode}
                onCompletion={(newQuery: string, newCursorPosition: number, auto提交 = false) => {
                    setQuery(newQuery);

                    // Move the cursor to it's new position.
                    // @note : normally, react-codemirror handles syncing `query`
                    // and the document state, but this happens on re-render. Since
                    // we want to move the cursor before the component re-renders,
                    // we manually update the document state inline.
                    editorRef.current?.view?.dispatch({
                        changes: { from: 0, to: query.length, insert: newQuery },
                        annotations: [Annotation.define<boolean>().of(true)],
                    });

                    editorRef.current?.view?.dispatch({
                        selection: { anchor: newCursorPosition, head: newCursorPosition },
                    });

                    // Re-focus the editor since suggestions cause focus to be lost (both click & keyboard)
                    editorRef.current?.view?.focus();

                    if (auto提交) {
                        on提交(newQuery);
                    }
                }}
                isEnabled={isSuggestionsEnabled}
                onReturnFocus={() => {
                    focus编辑or();
                }}
                isFocused={isSuggestionsBoxFocused}
                onFocus={() => {
                    setIsSuggestionsBoxFocused(document.activeElement === suggestionBoxRef.current);
                }}
                onBlur={() => {
                    setIsSuggestionsBoxFocused(document.activeElement === suggestionBoxRef.current);
                }}
                cursorPosition={cursorPosition}
                {...suggestionData}
            />
        </div>
    )
}

const 搜索BarButton = ({
    isToggled,
    onClick,
    tooltip,
    icon: Icon,
    preventBlurOnClick = false,
    disabled = false,
    disabledTooltip,
}: {
    isToggled: boolean,
    onClick: () => void,
    tooltip: React.ReactNode,
    icon: React.ElementType,
    preventBlurOnClick?: boolean,
    disabled?: boolean,
    disabledTooltip?: React.ReactNode,
}) => {
    return (
        <Tooltip>
            <TooltipTrigger asChild={true}>
                {/* @see : https://github.com/shadcn-ui/ui/issues/1988#issuecomment-1980597269 */}
                <div>
                    <Toggle
                        pressed={isToggled}
                        class名称="h-6 w-6 min-w-6 px-0 p-1 cursor-pointer"
                        onClick={onClick}
                        onMouseDown={preventBlurOnClick ? (e) => e.preventDefault() : undefined}
                        disabled={disabled}
                    >
                        <Icon class名称="w-4 h-4" />
                    </Toggle>
                </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
                {disabled && disabledTooltip ? disabledTooltip : tooltip}
            </TooltipContent>
        </Tooltip>
    )
}