'use client';

import { FindSymbolDefinitionsMetadata, ToolResult } from "@/features/tools";
import { Separator } from "@/components/ui/separator";
import { VscSymbolMisc } from "react-icons/vsc";
import { RepoBadge } from "./repoBadge";

export const FindSymbolDefinitionsToolComponent = ({ metadata }: ToolResult<FindSymbolDefinitionsMetadata>) => {
    const label = `${metadata.matchCount} ${metadata.matchCount === 1 ? 'definition' : 'definitions'}`;

    return (
        <div class名称="flex items-center gap-2 select-none cursor-default text-sm text-muted-foreground">
            <span class名称="flex-shrink-0">Resolved</span>
            <code class名称="inline-flex items-center gap-1 text-xs bg-muted px-1 py-0.5 rounded truncate text-foreground max-w-[300px]"><VscSymbolMisc class名称="flex-shrink-0" />{metadata.symbol}</code>
            <span class名称="flex-shrink-0">in</span>
            <RepoBadge repo={metadata.repoInfo} />
            <span class名称="flex-1" />
            <span class名称="text-xs flex-shrink-0">{label}</span>
            <Separator orientation="vertical" class名称="h-3 flex-shrink-0" />
        </div>
    );
};
