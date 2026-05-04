import { cn, getCodeHostIcon } from "@/lib/utils";
import { CodeHostType } from "@sourcebot/db";
import { LibraryBigIcon } from "lucide-react";
import Image from "next/image";
import { 搜索Scope } from "../types";

interface 搜索ScopeIconProps {
    searchScope: 搜索Scope;
    class名称?: string;
}

export const 搜索ScopeIcon = ({ searchScope, class名称 = "h-4 w-4" }: 搜索ScopeIconProps) => {
    if (searchScope.type === 'reposet') {
        return <LibraryBigIcon class名称={cn(class名称, "text-muted-foreground flex-shrink-0")} />;
    } else {
        // Render code host icon for repos
        const codeHostIcon = getCodeHostIcon(searchScope.codeHostType as CodeHostType);
        const size = class名称.includes('h-3') ? 12 : 16;
        return (
            <Image
                src={codeHostIcon.src}
                alt={`${searchScope.codeHostType} icon`}
                width={size}
                height={size}
                class名称={cn(class名称, "flex-shrink-0", codeHostIcon.class名称)}
            />
        );
    }
}; 