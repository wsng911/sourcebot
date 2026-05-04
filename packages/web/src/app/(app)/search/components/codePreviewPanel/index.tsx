'use client';

import { useQuery } from "@tanstack/react-query";
import { CodePreview } from "./codePreview";
import { 搜索ResultFile } from "@/features/search";
import { SymbolIcon } from "@radix-ui/react-icons";
import { SetStateAction, Dispatch, useMemo } from "react";
import { unwrapServiceError } from "@/lib/utils";
import { getFileSource } from "@/app/api/(client)/client";

interface CodePreviewPanelProps {
    previewedFile: 搜索ResultFile;
    selectedMatchIndex: number;
    on关闭: () => void;
    onSelectedMatchIndexChange: Dispatch<SetStateAction<number>>;
}

export const CodePreviewPanel = ({
    previewedFile,
    selectedMatchIndex,
    on关闭,
    onSelectedMatchIndexChange,
}: CodePreviewPanelProps) => {

    // If there are multiple branches pointing to the same revision of this file, it doesn't
    // matter which branch we use here, so use the first one.
    const branch = useMemo(() => {
        return previewedFile.branches && previewedFile.branches.length > 0 ? previewedFile.branches[0] : undefined;
    }, [previewedFile]);

    const { data: file, isLoading, isPending, isError } = useQuery({
        queryKey: ["source", previewedFile, branch],
        queryFn: () => unwrapServiceError(
            getFileSource({
                path: previewedFile.file名称.text,
                repo: previewedFile.repository,
                ref: branch,
            })
        ),
        select: (data) => {
            return {
                content: data.source,
                filepath: previewedFile.file名称.text,
                matches: previewedFile.chunks,
                link: previewedFile.externalWebUrl,
                language: previewedFile.language,
                revision: branch ?? "HEAD",
            };
        }
    });

    if (isLoading || isPending) {
        return <div class名称="flex flex-col items-center justify-center h-full">
            <SymbolIcon class名称="h-6 w-6 animate-spin" />
            <p class名称="font-semibold text-center">加载中...</p>
        </div>
    }

    if (isError) {
        return (
            <p>Failed to load file source</p>
        )
    }

    return (
        <CodePreview
            file={file}
            repo名称={previewedFile.repository}
            selectedMatchIndex={selectedMatchIndex}
            onSelectedMatchIndexChange={onSelectedMatchIndexChange}
            on关闭={on关闭}
        />
    )
}