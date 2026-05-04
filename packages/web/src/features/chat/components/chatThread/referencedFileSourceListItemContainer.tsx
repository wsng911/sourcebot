'use client';

import { getFileSource } from "@/app/api/(client)/client";
import { VscodeFileIcon } from "@/app/components/vscodeFileIcon";
import { Skeleton } from "@/components/ui/skeleton";
import { isServiceError, unwrapServiceError } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ReactCode镜像Ref } from '@uiw/react-codemirror';
import { memo, useCallback } from "react";
import { FileReference, FileSource, Reference } from "../../types";
import { ReferencedFileSourceListItem } from "./referencedFileSourceListItem";
import isEqual from 'fast-deep-equal/react';

export interface ReferencedFileSourceListItemContainerProps {
    fileId: string;
    fileSource: FileSource;
    references: FileReference[];
    hoveredReference?: Reference;
    selectedReference?: Reference;
    onHoveredReferenceChanged: (reference?: Reference) => void;
    onSelectedReferenceChanged: (reference?: Reference) => void;
    isExpanded: boolean;
    onExpandedChanged: (fileId: string, isExpanded: boolean) => void;
    on编辑orRef: (fileId: string, ref: ReactCode镜像Ref | null) => void;
}

const ReferencedFileSourceListItemContainerComponent = ({
    fileId,
    fileSource,
    references,
    hoveredReference,
    selectedReference,
    onHoveredReferenceChanged,
    onSelectedReferenceChanged,
    isExpanded,
    onExpandedChanged,
    on编辑orRef,
}: ReferencedFileSourceListItemContainerProps) => {
    const file名称 = fileSource.path.split('/').pop() ?? fileSource.path;

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['fileSource', fileSource.path, fileSource.repo, fileSource.revision],
        queryFn: () => unwrapServiceError(getFileSource({
            path: fileSource.path,
            repo: fileSource.repo,
            ref: fileSource.revision,
        })),
        staleTime: Infinity,
    });

    const handleRef = useCallback((ref: ReactCode镜像Ref | null) => {
        on编辑orRef(fileId, ref);
    }, [fileId, on编辑orRef]);

    const handleExpandedChanged = useCallback((isExpanded: boolean) => {
        onExpandedChanged(fileId, isExpanded);
    }, [fileId, onExpandedChanged]);

    if (isLoading) {
        return (
            <div class名称="space-y-2">
                <div class名称="flex items-center gap-2 p-2">
                    <VscodeFileIcon file名称={file名称} class名称="w-4 h-4" />
                    <span class名称="text-sm font-medium">{file名称}</span>
                </div>
                <Skeleton class名称="h-48 w-full" />
            </div>
        );
    }

    if (isError || isServiceError(data) || !data) {
        return (
            <div class名称="space-y-2">
                <div class名称="flex items-center gap-2 p-2">
                    <VscodeFileIcon file名称={file名称} class名称="w-4 h-4" />
                    <span class名称="text-sm font-medium">{file名称}</span>
                </div>
                <div class名称="p-4 text-sm text-destructive bg-destructive/10 rounded border">
                    Failed to load file: {isServiceError(data) ? data.message : error?.message ?? 'Unknown error'}
                </div>
            </div>
        );
    }

    return (
        <ReferencedFileSourceListItem
            id={fileId}
            code={data.source}
            language={data.language}
            revision={fileSource.revision}
            repo名称={fileSource.repo}
            repoCodeHostType={data.repoCodeHostType}
            repoDisplay名称={data.repoDisplay名称}
            repoWebUrl={data.repoExternalWebUrl}
            file名称={data.path}
            references={references}
            ref={handleRef}
            onSelectedReferenceChanged={onSelectedReferenceChanged}
            onHoveredReferenceChanged={onHoveredReferenceChanged}
            selectedReference={selectedReference}
            hoveredReference={hoveredReference}
            isExpanded={isExpanded}
            onExpandedChanged={handleExpandedChanged}
        />
    );
};

export const ReferencedFileSourceListItemContainer = memo(ReferencedFileSourceListItemContainerComponent, isEqual);
