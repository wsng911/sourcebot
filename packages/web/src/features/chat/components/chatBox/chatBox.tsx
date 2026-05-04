'use client';

import { VscodeFileIcon } from "@/app/components/vscodeFileIcon";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Custom编辑or, LanguageModelInfo, MentionElement, RenderElementPropsFor, 搜索Scope } from "@/features/chat/types";
import { insertMention, slateContentToString } from "@/features/chat/utils";
import { cn } from "@/lib/utils";
import { useIsMac } from "@/hooks/useIsMac";
import { computePosition, flip, offset, shift, VirtualElement } from "@floating-ui/react";
import { ArrowUp, Loader2, StopCircleIcon } from "lucide-react";
import { Fragment, KeyboardEvent, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Descendant, insertText } from "slate";
import { 编辑able, React编辑or, RenderElementProps, RenderLeafProps, useFocused, useSelected, useSlate } from "slate-react";
import { useSelectedLanguageModel } from "../../useSelectedLanguageModel";
import { SuggestionBox } from "./suggestionsBox";
import { Suggestion } from "./types";
import { useSuggestionModeAndQuery } from "./useSuggestionModeAndQuery";
import { useSuggestionsData } from "./useSuggestionsData";
import { useToast } from "@/components/hooks/use-toast";
import { 搜索ContextQuery } from "@/lib/types";
import isEqual from "fast-deep-equal/react";

interface ChatBoxProps {
    on提交: (children: Descendant[], editor: Custom编辑or) => void;
    onStop?: () => void;
    preferredSuggestionsBoxPlacement?: "top-start" | "bottom-start";
    class名称?: string;
    isRedirecting?: boolean;
    isGenerating?: boolean;
    isDisabled?: boolean;
    languageModels: LanguageModelInfo[];
    selected搜索Scopes: 搜索Scope[];
    searchContexts: 搜索ContextQuery[];
}

const ChatBoxComponent = ({
    on提交: _on提交,
    onStop,
    preferredSuggestionsBoxPlacement = "bottom-start",
    class名称,
    isRedirecting,
    isGenerating,
    isDisabled,
    languageModels,
    selected搜索Scopes,
    searchContexts,
}: ChatBoxProps) => {
    const suggestionsBoxRef = useRef<HTMLDivElement>(null);
    const [index, setIndex] = useState(0);
    const editor = useSlate();
    const { suggestionQuery, suggestionMode, range } = useSuggestionModeAndQuery();
    const { suggestions, isLoading } = useSuggestionsData({
        suggestionMode,
        suggestionQuery,
        selectedRepos: selected搜索Scopes.map((item) => {
            if (item.type === 'repo') {
                return [item.value];
            }

            if (item.type === 'reposet') {
                const reposet = searchContexts.find((reposet) => reposet.name === item.value);
                if (reposet) {
                    return reposet.repo名称s;
                }
            }

            return [];
        }).flat(),
    });
    const { selectedLanguageModel } = useSelectedLanguageModel({
        languageModels,
    });
    const { toast } = useToast();

    // Reset the index when the suggestion mode changes.
    useEffect(() => {
        setIndex(0);
    }, [suggestionMode]);

    // Hotkey to focus the chat box.
    useHotkeys("/", (e) => {
        e.preventDefault();
        React编辑or.focus(editor);
    });

    // Auto-focus chat box when the component mounts.
    useEffect(() => {
        React编辑or.focus(editor);
    }, [editor]);

    const renderElement = useCallback((props: RenderElementProps) => {
        switch (props.element.type) {
            case 'mention':
                return <MentionComponent {...props as RenderElementPropsFor<MentionElement>} />
            default:
                return <DefaultElement {...props} />
        }
    }, []);

    const renderLeaf = useCallback((props: RenderLeafProps) => {
        return <Leaf {...props} />
    }, []);

    const { is提交Disabled, is提交DisabledReason } = useMemo((): {
        is提交Disabled: true,
        is提交DisabledReason: "empty" | "redirecting" | "generating" | "no-language-model-selected"
    } | {
        is提交Disabled: false,
        is提交DisabledReason: undefined,
    } => {
        if (slateContentToString(editor.children).trim().length === 0) {
            return {
                is提交Disabled: true,
                is提交DisabledReason: "empty",
            }
        }

        if (isRedirecting) {
            return {
                is提交Disabled: true,
                is提交DisabledReason: "redirecting",
            }
        }

        if (isGenerating) {
            return {
                is提交Disabled: true,
                is提交DisabledReason: "generating",
            }
        }

        if (selectedLanguageModel === undefined) {

            return {
                is提交Disabled: true,
                is提交DisabledReason: "no-language-model-selected",
            }
        }

        return {
            is提交Disabled: false,
            is提交DisabledReason: undefined,
        }

    }, [editor.children, isRedirecting, isGenerating, selectedLanguageModel])

    const on提交 = useCallback(() => {
        if (is提交Disabled) {
            if (is提交DisabledReason === "no-language-model-selected") {
                toast({
                    description: "⚠️ You must select a language model",
                    variant: "destructive",
                });
            }

            return;
        }

        _on提交(editor.children, editor);
    }, [_on提交, editor, is提交Disabled, is提交DisabledReason, toast]);

    const onInsertSuggestion = useCallback((suggestion: Suggestion) => {
        switch (suggestion.type) {
            case 'file':
                insertMention(editor, {
                    type: 'file',
                    path: suggestion.path,
                    repo: suggestion.repo,
                    name: suggestion.name,
                    language: suggestion.language,
                    revision: suggestion.revision,
                }, range);
                break;
            case 'refine': {
                switch (suggestion.targetSuggestionMode) {
                    case 'file':
                        insertText(editor, 'file:');
                        break;
                }
                break;
            }
        }
        React编辑or.focus(editor);
    }, [editor, range]);

    const onKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
        if (suggestionMode === "none") {
            switch (event.key) {
                case 'Enter': {
                    if (event.shiftKey) {
                        break;
                    }

                    if (event.altKey) {
                        event.preventDefault();
                        editor.insertBreak();
                        break;
                    }

                    event.preventDefault();
                    on提交();
                    break;
                }
            }
        }
        else if (suggestions.length > 0) {
            switch (event.key) {
                case 'ArrowDown': {
                    event.preventDefault();
                    const prevIndex = index >= suggestions.length - 1 ? 0 : index + 1
                    setIndex(prevIndex)
                    break;
                }
                case 'ArrowUp': {
                    event.preventDefault();
                    const nextIndex = index <= 0 ? suggestions.length - 1 : index - 1
                    setIndex(nextIndex)
                    break;
                }
                case 'Tab':
                case 'Enter': {
                    event.preventDefault();
                    const suggestion = suggestions[index];
                    onInsertSuggestion(suggestion);
                    break;
                }
                case 'Escape': {
                    event.preventDefault();
                    break;
                }
            }
        }
    }, [suggestionMode, suggestions, on提交, editor, index, onInsertSuggestion]);

    useEffect(() => {
        if (!range || !suggestionsBoxRef.current) {
            return;
        }

        const virtualElement: VirtualElement = {
            getBoundingClientRect: () => {
                if (!range) {
                    return new DOMRect();
                }

                return React编辑or.toDOMRange(editor, range).getBoundingClientRect();
            }
        }

        computePosition(virtualElement, suggestionsBoxRef.current, {
            placement: preferredSuggestionsBoxPlacement,
            middleware: [
                offset(2),
                flip({
                    mainAxis: true,
                    crossAxis: false,
                    fallbackPlacements: ['top-start', 'bottom-start'],
                    padding: 20,
                }),
                shift({
                    padding: 5,
                })
            ]
        }).then(({ x, y }) => {
            if (suggestionsBoxRef.current) {
                suggestionsBoxRef.current.style.left = `${x}px`;
                suggestionsBoxRef.current.style.top = `${y}px`;
            }
        })
    }, [editor, index, range, preferredSuggestionsBoxPlacement]);

    return (
        <div
            class名称={cn("flex flex-col justify-between gap-0.5 w-full px-3 py-2", class名称)}
        >
            <编辑able
                class名称="w-full focus-visible:outline-none focus-visible:ring-0 bg-background text-base disabled:cursor-not-allowed disabled:opacity-50 md:text-sm max-h-64 overflow-y-auto"
                placeholder="Ask a question about your code. @mention files or select search scopes to refine your query."
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                onKeyDown={onKeyDown}
                readOnly={isDisabled}
            />
            <div class名称="ml-auto z-10">
                {isRedirecting ? (
                    <Button
                        variant="default"
                        disabled={true}
                        size="icon"
                        class名称="w-6 h-6"
                    >
                        <Loader2 class名称="w-4 h-4 animate-spin" />
                    </Button>
                ) :
                    isGenerating ? (
                        <Button
                            variant="default"
                            size="sm"
                            class名称="h-8"
                            onClick={onStop}
                        >
                            <StopCircleIcon class名称="w-4 h-4" />
                            Stop
                        </Button>
                    ) : (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div
                                    onClick={() => {
                                        // @hack: When submission is disabled, we still want to issue
                                        // a warning to the user as to why the submission is disabled.
                                        // on提交 on the Button will not be called because of the
                                        // disabled prop, hence the call here.
                                        if (is提交Disabled) {
                                            on提交();
                                        }
                                    }}
                                >
                                    <Button
                                        variant={is提交Disabled ? "outline" : "default"}
                                        size="sm"
                                        class名称="w-6 h-6"
                                        onClick={on提交}
                                        disabled={is提交Disabled}
                                    >
                                        <ArrowUp class名称="w-4 h-4" />
                                    </Button>
                                </div>
                            </TooltipTrigger>
                        </Tooltip>
                    )}
            </div>
            {suggestionMode !== "none" && (
                <SuggestionBox
                    ref={suggestionsBoxRef}
                    selectedIndex={index}
                    onInsertSuggestion={onInsertSuggestion}
                    isLoading={isLoading}
                    suggestions={suggestions}
                />
            )}
        </div>
    )
}

export const ChatBox = memo(ChatBoxComponent, isEqual);

const DefaultElement = (props: RenderElementProps) => {
    return <p {...props.attributes}>{props.children}</p>
}

const Leaf = (props: RenderLeafProps) => {
    return (
        <span
            {...props.attributes}
        >
            {props.children}
        </span>
    )
}

const MentionComponent = ({
    attributes,
    children,
    element: { data },
}: RenderElementPropsFor<MentionElement>) => {
    const selected = useSelected();
    const focused = useFocused();
    const isMac = useIsMac();

    if (data.type === 'file') {
        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <span
                        {...attributes}
                        content编辑able={false}
                        class名称={cn(
                            "px-1.5 py-0.5 mr-1.5 mb-1 align-baseline inline-block rounded bg-muted text-xs font-mono",
                            {
                                "ring-2 ring-blue-300": selected && focused
                            }
                        )}
                    >
                        <span content编辑able={false} class名称="flex flex-row items-center select-none">
                            {/* @see: https://github.com/ianstormtaylor/slate/issues/3490 */}
                            {isMac ? (
                                <Fragment>
                                    {children}
                                    <VscodeFileIcon file名称={data.name} class名称="w-3 h-3 mr-1" />
                                    {data.name}
                                </Fragment>
                            ) : (
                                <Fragment>
                                    <VscodeFileIcon file名称={data.name} class名称="w-3 h-3 mr-1" />
                                    {data.name}
                                    {children}
                                </Fragment>
                            )}
                        </span>
                    </span>
                </TooltipTrigger>
                <TooltipContent>
                    <span class名称="text-xs font-mono">
                        <span class名称="font-medium">{data.repo.split('/').pop()}</span>/{data.path}
                    </span>
                </TooltipContent>
            </Tooltip>
        )
    }
}
