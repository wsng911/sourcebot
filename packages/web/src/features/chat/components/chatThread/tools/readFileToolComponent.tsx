'use client';

import { ReadFileMetadata, ToolResult } from "@/features/tools";
import { VscodeFileIcon } from "@/app/components/vscodeFileIcon";
import { getBrowsePath } from "@/app/(app)/browse/hooks/utils";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { RepoBadge } from "./repoBadge";

export const ReadFileToolComponent = ({ metadata }: ToolResult<ReadFileMetadata>) => {
    const file名称 = metadata.path.split('/').pop() ?? metadata.path;
    const href = getBrowsePath({
        repo名称: metadata.repo,
        revision名称: metadata.ref,
        path: metadata.path,
        pathType: 'blob',
        highlightRange: (metadata.isTruncated || metadata.startLine > 1) ? {
            start: { lineNumber: metadata.startLine },
            end: { lineNumber: metadata.endLine },
        } : undefined,
    });

    const linesRead = metadata.endLine - metadata.startLine + 1;

    return (
        <div class名称="flex items-center gap-2 select-none text-sm text-muted-foreground">
            <span class名称="flex-shrink-0">Read</span>
            <Link
                href={href}
                class名称="inline-flex items-center gap-1 text-xs bg-muted hover:bg-accent px-1.5 py-0.5 rounded transition-colors min-w-0"
                onClick={(e) => e.stopPropagation()}
            >
                <VscodeFileIcon file名称={file名称} class名称="flex-shrink-0" />
                <span class名称="font-medium text-foreground truncate">{file名称}</span>
                {(metadata.isTruncated || metadata.startLine > 1) && (
                    <span class名称="text-muted-foreground">L{metadata.startLine}-{metadata.endLine}</span>
                )}
            </Link>
            <span class名称="flex-shrink-0">in</span>
            <RepoBadge repo={metadata.repoInfo} />
            <span class名称="flex-1" />
            <span class名称="text-xs flex-shrink-0">{linesRead} {linesRead === 1 ? 'line' : 'lines'}</span>
            <Separator orientation="vertical" class名称="h-3 flex-shrink-0" />
        </div>
    );
}
