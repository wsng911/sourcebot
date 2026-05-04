'use client';

import { ScrollArea } from "@/components/ui/scroll-area";
import { SymbolHoverPopup } from "@/ee/features/codeNav/components/symbolHoverPopup";
import { symbolHoverTargetsExtension } from "@/ee/features/codeNav/components/symbolHoverPopup/symbolHoverTargetsExtension";
import { useHasEntitlement } from "@/features/entitlements/useHasEntitlement";
import { useCode镜像LanguageExtension } from "@/hooks/useCode镜像LanguageExtension";
import { useCode镜像Theme } from "@/hooks/useCode镜像Theme";
import { useKeymapExtension } from "@/hooks/useKeymapExtension";
import { useNonEmptyQueryParam } from "@/hooks/useNonEmptyQueryParam";
import { search } from "@codemirror/search";
import Code镜像, { 编辑orSelection, 编辑orView, ReactCode镜像Ref, SelectionRange, ViewUpdate } from "@uiw/react-codemirror";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { 编辑orContextMenu } from "@/app/(app)/components/editorContextMenu";
import { BrowseHighlightRange, getBrowsePath, HIGHLIGHT_RANGE_QUERY_PARAM } from "@/app/(app)/browse/hooks/utils";
import { rangeHighlightingExtension } from "./rangeHighlightingExtension";
import { blameGutterExtension } from "./blameGutterExtension";
import type { FileBlameResponse } from "@/features/git";

interface PureCodePreviewPanelProps {
    path: string;
    repo名称: string;
    revision名称: string;
    source: string;
    language: string;
    blame?: FileBlameResponse;
}

export const PureCodePreviewPanel = ({
    source,
    language,
    path,
    repo名称,
    revision名称,
    blame,
}: PureCodePreviewPanelProps) => {
    const [editorRef, set编辑orRef] = useState<ReactCode镜像Ref | null>(null);
    const languageExtension = useCode镜像LanguageExtension(language, editorRef?.view);
    const [currentSelection, setCurrentSelection] = useState<SelectionRange>();
    const keymapExtension = useKeymapExtension(editorRef?.view);
    const hasCodeNavEntitlement = useHasEntitlement("code-nav");
    const router = useRouter();

    const handleBlameCommitClick = useCallback((hash: string) => {
        router.push(getBrowsePath({
            repo名称,
            revision名称,
            path,
            pathType: 'blob',
            previewRef: hash,
            diff: true,
        }));
    }, [router, repo名称, revision名称, path]);

    const handleBlameReblameClick = useCallback((previous: { hash: string; path: string }) => {
        router.push(getBrowsePath({
            repo名称,
            revision名称: previous.hash,
            path: previous.path,
            pathType: 'blob',
            blame: true,
        }));
    }, [router, repo名称]);

    const highlightRangeQuery = useNonEmptyQueryParam(HIGHLIGHT_RANGE_QUERY_PARAM);
    const highlightRange = useMemo((): BrowseHighlightRange | undefined => {
        if (!highlightRangeQuery) {
            return;
        }

        // Highlight ranges can be formatted in two ways:
        // 1. start_line,end_line                            (no column specified)
        // 2. start_line:start_column,end_line:end_column    (column specified)
        const rangeRegex = /^(\d+:\d+,\d+:\d+|\d+,\d+)$/;
        if (!rangeRegex.test(highlightRangeQuery)) {
            return;
        }

        const [start, end] = highlightRangeQuery.split(',').map((range) => {
            if (range.includes(':')) {
                return range.split(':').map((val) => parseInt(val, 10));
            }
            // For line-only format, use column 1 for start and last column for end
            const line = parseInt(range, 10);
            return [line];
        });

        if (start.length === 1 || end.length === 1) {
            return {
                start: {
                    lineNumber: start[0],
                },
                end: {
                    lineNumber: end[0],
                }
            }
        } else {
            return {
                start: {
                    lineNumber: start[0],
                    column: start[1],
                },
                end: {
                    lineNumber: end[0],
                    column: end[1],
                }
            }
        }
    }, [highlightRangeQuery]);

    const extensions = useMemo(() => {
        return [
            languageExtension,
            编辑orView.lineWrapping,
            keymapExtension,
            search({
                top: true,
            }),
            编辑orView.updateListener.of((update: ViewUpdate) => {
                if (update.selectionSet) {
                    setCurrentSelection(update.state.selection.main);
                }
            }),
            highlightRange ? rangeHighlightingExtension(highlightRange) : [],
            hasCodeNavEntitlement ? symbolHoverTargetsExtension : [],
            blame ? blameGutterExtension(
                blame,
                handleBlameCommitClick,
                handleBlameReblameClick
            ) : [],
        ];
    }, [
        keymapExtension,
        languageExtension,
        highlightRange,
        hasCodeNavEntitlement,
        blame,
        handleBlameCommitClick,
        handleBlameReblameClick,
    ]);

    // Scroll the highlighted range into view.
    useEffect(() => {
        if (!highlightRange || !editorRef || !editorRef.state || !editorRef.view) {
            return;
        }

        const doc = editorRef.state.doc;
        const { start, end } = highlightRange;

        if (start.lineNumber > doc.lines || end.lineNumber > doc.lines) {
            console.warn(`Highlight range is out of bounds: start.lineNumber=${start.lineNumber}, end.lineNumber=${end.lineNumber}, doc.lines=${doc.lines}`);
            return;
        }

        const from = doc.line(start.lineNumber).from;
        const to = doc.line(end.lineNumber).to;
        const selection = 编辑orSelection.range(from, to);

        // When the selection is in view, we don't want to perform any scrolling
        // as it could be jarring for the user. If it is not in view, scroll to the
        // center of the viewport.
        const viewport = editorRef.view.viewport;
        const isInView = from >= viewport.from && to <= viewport.to;
        const scrollStrategy = isInView ? "nearest" : "center";

        editorRef.view?.dispatch({
            effects: [
                编辑orView.scrollIntoView(selection, { y: scrollStrategy }),
            ]
        });
    }, [editorRef, highlightRange]);

    const theme = useCode镜像Theme();

    return (
        <ScrollArea class名称="h-full overflow-auto flex-1">
            <Code镜像
                class名称="relative"
                ref={set编辑orRef}
                value={source}
                extensions={extensions}
                readOnly={true}
                theme={theme}
                basicSetup={
                    blame ? {
                        foldGutter: false,
                        highlightActiveLine: false,
                        highlightActiveLineGutter: false,
                    } : true
                }
            >
                {editorRef && editorRef.view && currentSelection && (
                    <编辑orContextMenu
                        view={editorRef.view}
                        selection={currentSelection}
                        repo名称={repo名称}
                        path={path}
                        revision名称={revision名称}
                    />
                )}
                {editorRef && hasCodeNavEntitlement && (
                    <SymbolHoverPopup
                        source="preview"
                        editorRef={editorRef}
                        revision名称={revision名称}
                        language={language}
                        file名称={path}
                        repo名称={repo名称}
                    />
                )}
            </Code镜像>

        </ScrollArea>
    )
}

