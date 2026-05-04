'use client';

import { ListTreeMetadata, ToolResult } from "@/features/tools";
import { RepoBadge } from "./repoBadge";
import { Separator } from "@/components/ui/separator";
import { getBrowsePath } from "@/app/(app)/browse/hooks/utils";
import { FolderIcon } from "lucide-react";
import Link from "next/link";

export const ListTreeToolComponent = ({ metadata }: ToolResult<ListTreeMetadata>) => {
    return (
        <div class名称="flex items-center gap-2 select-none cursor-default text-sm text-muted-foreground">
            <span class名称="flex-shrink-0">Listed</span>
            <Link
                href={getBrowsePath({
                    repo名称: metadata.repo,
                    revision名称: metadata.ref,
                    path: metadata.path,
                    pathType: 'tree',
                })}
                onClick={(e) => e.stopPropagation()}
                class名称="inline-flex items-center gap-1 text-xs bg-muted hover:bg-accent px-1.5 py-0.5 rounded truncate text-foreground font-medium transition-colors min-w-0"
            >
                <FolderIcon class名称="h-3 w-3 flex-shrink-0" />
                {metadata.path || '/'}
            </Link>
            <span class名称="flex-shrink-0">in</span>
            <RepoBadge repo={metadata.repoInfo} />
            <span class名称="flex-shrink-0 ml-auto text-xs">
                {metadata.totalReturned} {metadata.totalReturned === 1 ? 'entry' : 'entries'}{metadata.truncated ? ' (truncated)' : ''}
            </span>
            <Separator orientation="vertical" class名称="h-3 flex-shrink-0" />
        </div>
    );
};
