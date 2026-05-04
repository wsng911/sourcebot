'use client';

import { PathHeader } from "@/app/(app)/components/pathHeader";
import { SymbolHoverPopup } from '@/ee/features/codeNav/components/symbolHoverPopup';
import { symbolHoverTargetsExtension } from "@/ee/features/codeNav/components/symbolHoverPopup/symbolHoverTargetsExtension";
import { useHasEntitlement } from "@/features/entitlements/useHasEntitlement";
import { useCode镜像LanguageExtension } from "@/hooks/useCode镜像LanguageExtension";
import { useCode镜像Theme } from "@/hooks/useCode镜像Theme";
import { useExtensionWithDependency } from "@/hooks/useExtensionWithDependency";
import { useKeymapExtension } from "@/hooks/useKeymapExtension";
import { cn } from "@/lib/utils";
import { 编辑orView } from '@codemirror/view';
import { CodeHostType } from "@sourcebot/db";
import Code镜像, { ReactCode镜像Ref } from '@uiw/react-codemirror';
import isEqual from "fast-deep-equal/react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { forwardRef, memo, Ref, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { FileReference } from "../../types";
import { createCodeFoldingExtension } from "./codeFoldingExtension";
import { createReferencesHighlightExtension, setHoveredIdEffect, setSelectedIdEffect } from "./referencesHighlightExtension";

const CODEMIRROR_BASIC_SETUP = {
    highlightActiveLine: false,
    highlightActiveLineGutter: false,
    foldGutter: false,
    foldKeymap: false,
} as const;

interface ReferencedFileSourceListItemProps {
    id: string;
    code: string;
    language: string;
    revision: string;
    repo名称: string;
    repoCodeHostType: CodeHostType;
    repoDisplay名称?: string;
    repoWebUrl?: string;
    file名称: string;
    references: FileReference[];
    selectedReference?: FileReference;
    hoveredReference?: FileReference;
    onSelectedReferenceChanged: (reference?: FileReference) => void;
    onHoveredReferenceChanged: (reference?: FileReference) => void;
    isExpanded: boolean;
    onExpandedChanged: (isExpanded: boolean) => void;
}

const ReferencedFileSourceListItemComponent = ({
    id,
    code,
    language,
    revision,
    repo名称,
    repoCodeHostType,
    repoDisplay名称,
    repoWebUrl,
    file名称,
    references,
    selectedReference,
    hoveredReference,
    onSelectedReferenceChanged,
    onHoveredReferenceChanged,
    isExpanded,
    onExpandedChanged,
}: ReferencedFileSourceListItemProps, forwardedRef: Ref<ReactCode镜像Ref>) => {
    const theme = useCode镜像Theme();
    const [editorRef, set编辑orRef] = useState<ReactCode镜像Ref | null>(null);

    useImperativeHandle(
        forwardedRef,
        () => editorRef as ReactCode镜像Ref
    );

    const keymapExtension = useKeymapExtension(editorRef?.view);
    const hasCodeNavEntitlement = useHasEntitlement("code-nav");
    const languageExtension = useCode镜像LanguageExtension(language, editorRef?.view);

    const codeFoldingExtension = useMemo(() => {
        return createCodeFoldingExtension(references, 3);
    }, [references]);

    const referencesHighlightExtension = useExtensionWithDependency(
        editorRef?.view ?? null,
        () => createReferencesHighlightExtension(references, onHoveredReferenceChanged, onSelectedReferenceChanged),
        [references],
    );

    useEffect(() => {
        if (editorRef?.view) {
            editorRef.view.dispatch({ effects: setHoveredIdEffect.of(hoveredReference?.id) });
        }
    }, [hoveredReference?.id, editorRef?.view]);

    useEffect(() => {
        if (editorRef?.view) {
            editorRef.view.dispatch({ effects: setSelectedIdEffect.of(selectedReference?.id) });
        }
    }, [selectedReference?.id, editorRef?.view]);

    const extensions = useMemo(() => {
        return [
            languageExtension,
            编辑orView.lineWrapping,
            keymapExtension,
            ...(hasCodeNavEntitlement ? [
                symbolHoverTargetsExtension,
            ] : []),
            codeFoldingExtension,
            referencesHighlightExtension,
        ];
    }, [
        languageExtension,
        keymapExtension,
        hasCodeNavEntitlement,
        codeFoldingExtension,
        referencesHighlightExtension,
    ]);

    const ExpandCollapseIcon = useMemo(() => {
        return isExpanded ? ChevronDown : ChevronRight;
    }, [isExpanded]);

    const isSelectedWithoutRange = useMemo(() => {
        return references.some(r => r.id === selectedReference?.id && !selectedReference?.range);
    }, [references, selectedReference?.id, selectedReference?.range]);

    return (
        <div class名称="relative" id={id}>
            {/* Sentinel element to scroll to when collapsing a file */}
            <div id={`${id}-start`} />
            {/* Sticky header outside the bordered container */}
            <div class名称={cn("sticky top-0 z-10 flex flex-row items-center bg-accent py-1 px-3 gap-1.5 border-l border-r border-t rounded-t-md", {
                'rounded-b-md border-b': !isExpanded,
                'border-chat-reference-selected-border border-b': isSelectedWithoutRange,
            })}>
                <ExpandCollapseIcon class名称={`h-3 w-3 cursor-pointer mt-0.5`} onClick={() => onExpandedChanged(!isExpanded)} />
                <PathHeader
                    path={file名称}
                    repo={{
                        name: repo名称,
                        codeHostType: repoCodeHostType,
                        display名称: repoDisplay名称,
                        externalWebUrl: repoWebUrl,
                    }}
                    revision名称={revision === 'HEAD' ? undefined : revision}
                    repo名称Class名称="font-normal text-muted-foreground text-sm"
                />
            </div>

            {/* Code container */}
            {/* @note: don't conditionally render here since we want to maintain state */}
            <div class名称="border-l border-r border-b rounded-b-md overflow-hidden" style={{
                height: isExpanded ? 'auto' : '0px',
                visibility: isExpanded ? 'visible' : 'hidden',
            }}>
                <Code镜像
                    ref={set编辑orRef}
                    value={code}
                    extensions={extensions}
                    readOnly={true}
                    theme={theme}
                    basicSetup={CODEMIRROR_BASIC_SETUP}
                >
                    {editorRef && hasCodeNavEntitlement && (
                        <SymbolHoverPopup
                            source="chat"
                            editorRef={editorRef}
                            revision名称={revision}
                            language={language}
                            repo名称={repo名称}
                            file名称={file名称}
                        />
                    )}
                </Code镜像>
            </div>
        </div>
    )
}

export const ReferencedFileSourceListItem = memo(forwardRef(ReferencedFileSourceListItemComponent), isEqual) as (
    props: ReferencedFileSourceListItemProps & { ref?: Ref<ReactCode镜像Ref> },
) => ReturnType<typeof ReferencedFileSourceListItemComponent>;
