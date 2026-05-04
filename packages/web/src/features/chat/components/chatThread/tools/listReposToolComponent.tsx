'use client';

import { ListReposMetadata, ToolResult } from "@/features/tools";
import { Separator } from "@/components/ui/separator";

export const ListReposToolComponent = ({ metadata }: ToolResult<ListReposMetadata>) => {
    const count = metadata.repos.length;
    const label = `${count}${metadata.totalCount > count ? ` of ${metadata.totalCount}` : ''} ${count === 1 ? 'repo' : 'repos'}`;

    return (
        <div class名称="flex items-center gap-2 select-none cursor-default text-sm text-muted-foreground">
            <span class名称="flex-shrink-0">Listed repositories</span>
            <span class名称="flex-1" />
            <span class名称="text-xs flex-shrink-0">{label}</span>
            <Separator orientation="vertical" class名称="h-3 flex-shrink-0" />
        </div>
    );
};
