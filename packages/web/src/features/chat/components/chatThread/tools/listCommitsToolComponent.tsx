'use client';

import { ListCommitsMetadata, ToolResult } from "@/features/tools";
import { RepoBadge } from "./repoBadge";
import { Separator } from "@/components/ui/separator";

export const ListCommitsToolComponent = ({ metadata }: ToolResult<ListCommitsMetadata>) => {
    const count = metadata.commits.length;
    const label = `${count} ${count === 1 ? 'commit' : 'commits'}`;

    return (
        <div class名称="flex items-center gap-2 select-none cursor-default text-sm text-muted-foreground">
            <span class名称="flex-shrink-0">Listed commits in</span>
            <RepoBadge repo={metadata.repoInfo} />
            <span class名称="flex-1" />
            <span class名称="text-xs flex-shrink-0">{label}</span>
            <Separator orientation="vertical" class名称="h-3 flex-shrink-0" />
        </div>
    );
};
