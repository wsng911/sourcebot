'use client';

import { useBrowseNavigation } from "@/app/(app)/browse/hooks/useBrowseNavigation";
import { 编辑orContextMenu } from "@/app/(app)/components/editorContextMenu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SymbolHoverPopup } from "@/ee/features/codeNav/components/symbolHoverPopup";
import { symbolHoverTargetsExtension } from "@/ee/features/codeNav/components/symbolHoverPopup/symbolHoverTargetsExtension";
import { useHasEntitlement } from "@/features/entitlements/useHasEntitlement";
import { 搜索ResultChunk } from "@/features/search";
import { useCode镜像LanguageExtension } from "@/hooks/useCode镜像LanguageExtension";
import { useCode镜像Theme } from "@/hooks/useCode镜像Theme";
import { useKeymapExtension } from "@/hooks/useKeymapExtension";
import { gutterWidthExtension } from "@/lib/extensions/gutterWidthExtension";
import { highlightRanges, searchResultHighlightExtension } from "@/lib/extensions/searchResultHighlightExtension";
import { search } from "@codemirror/search";
import { 编辑orView } from "@codemirror/view";
import { Cross1Icon, FileIcon } from "@radix-ui/react-icons";
import { Scrollbar } from "@radix-ui/react-scroll-area";
import Code镜像, { ReactCode镜像Ref, SelectionRange } from '@uiw/react-codemirror';
import { ArrowDown, ArrowUp } from "lucide-react";
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";

export interface CodePreviewFile {
    content: string;
    filepath: string;
    link?: string;
    matches: 搜索ResultChunk[];
    language: string;
    revision: string;
}

interface CodePreviewProps {
    file: CodePreviewFile;
    repo名称: string;
    selectedMatchIndex: number;
    onSelectedMatchIndexChange: Dispatch<SetStateAction<number>>;
    on关闭: () => void;
}

export const CodePreview = ({
    file,
    repo名称,
    selectedMatchIndex,
    onSelectedMatchIndexChange,
    on关闭,
}: CodePreviewProps) => {
    const [editorRef, set编辑orRef] = useState<ReactCode镜像Ref | null>(null);
    const { navigateToPath } = useBrowseNavigation();
    const hasCodeNavEntitlement = useHasEntitlement("code-nav");

    const [gutterWidth, setGutterWidth] = useState(0);
    const theme = useCode镜像Theme();

    const keymapExtension = useKeymapExtension(editorRef?.view);
    const languageExtension = useCode镜像LanguageExtension(file?.language ?? '', editorRef?.view);
    const [currentSelection, setCurrentSelection] = useState<SelectionRange>();

    const extensions = useMemo(() => {
        return [
            keymapExtension,
            gutterWidthExtension,
            languageExtension,
            编辑orView.lineWrapping,
            searchResultHighlightExtension(),
            search({
                top: true,
            }),
            编辑orView.updateListener.of((update) => {
                const width = update.view.plugin(gutterWidthExtension)?.width;
                if (width) {
                    setGutterWidth(width);
                }
            }),
            编辑orView.updateListener.of((update) => {
                // @note: it's important we reset the selection when
                // the document changes... otherwise we will get a floating
                // context menu where it shouldn't be.
                if (update.selectionSet || update.docChanged) {
                    setCurrentSelection(update.state.selection.main);
                }
            }),
            hasCodeNavEntitlement ? symbolHoverTargetsExtension : [],
        ];
    }, [hasCodeNavEntitlement, keymapExtension, languageExtension]);

    const ranges = useMemo(() => {
        if (!file.matches.length) {
            return [];
        }

        return file.matches.flatMap((match) => {
            return match.matchRanges;
        })
    }, [file]);

    useEffect(() => {
        if (!editorRef?.view) {
            return;
        }

        highlightRanges(selectedMatchIndex, ranges, editorRef.view);
    }, [ranges, selectedMatchIndex, file, editorRef]);

    const onUpClicked = useCallback(() => {
        onSelectedMatchIndexChange((prev) => prev - 1);
    }, [onSelectedMatchIndexChange]);

    const onDownClicked = useCallback(() => {
        onSelectedMatchIndexChange((prev) => prev + 1);
    }, [onSelectedMatchIndexChange]);

    return (
        <div class名称="flex flex-col h-full">
            <div class名称="flex flex-row bg-accent items-center justify-between pr-3 py-0.5 mt-7">

                {/* Gutter icon */}
                <div class名称="flex flex-row">
                    <div
                        style={{ width: `${gutterWidth}px` }}
                        class名称="flex justify-center items-center"
                    >
                        <FileIcon class名称="h-4 w-4" />
                    </div>
                </div>

                {/* File path */}
                <div class名称="flex-1 overflow-hidden">
                    <span
                        class名称="block truncate-start text-sm font-mono cursor-pointer hover:underline"
                        onClick={() => {
                            navigateToPath({
                                repo名称,
                                path: file.filepath,
                                pathType: 'blob',
                                revision名称: file.revision,
                            });
                        }}
                        title={file.filepath}
                    >
                        <span>{file.filepath}</span>
                    </span>
                </div>

                <div class名称="flex flex-row gap-1 items-center pl-2">
                    {/* Match selector */}
                    {file.matches.length > 0 && (
                        <>
                            <p class名称="text-sm">{`${selectedMatchIndex + 1} of ${ranges.length}`}</p>
                            <Button
                                variant="ghost"
                                size="icon"
                                class名称="h-6 w-6"
                                disabled={selectedMatchIndex === 0}
                                onClick={onUpClicked}
                            >
                                <ArrowUp class名称="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                class名称="h-6 w-6"
                                onClick={onDownClicked}
                                disabled={selectedMatchIndex === ranges.length - 1}
                            >
                                <ArrowDown class名称="h-4 w-4" />
                            </Button>
                        </>
                    )}

                    {/* 关闭 button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        class名称="h-6 w-6"
                        onClick={on关闭}
                    >
                        <Cross1Icon class名称="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <ScrollArea class名称="h-full overflow-auto flex-1">
                <Code镜像
                    ref={set编辑orRef}
                    class名称="relative"
                    readOnly={true}
                    value={file?.content}
                    extensions={extensions}
                    theme={theme}
                >
                    {
                        editorRef?.view &&
                        file?.filepath &&
                        repo名称 &&
                        currentSelection &&
                        (
                            <编辑orContextMenu
                                view={editorRef.view}
                                path={file?.filepath}
                                repo名称={repo名称}
                                selection={currentSelection}
                                revision名称={file.revision}
                            />
                        )
                    }

                    {editorRef && hasCodeNavEntitlement && (
                        <SymbolHoverPopup
                            source="preview"
                            editorRef={editorRef}
                            language={file.language}
                            revision名称={file.revision}
                            file名称={file.filepath}
                            repo名称={repo名称}
                        />
                    )}
                </Code镜像>
                <Scrollbar orientation="vertical" />
                <Scrollbar orientation="horizontal" />
            </ScrollArea>
        </div>
    )
}