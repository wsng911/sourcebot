import { BookMarkedIcon, LibraryBigIcon, Scan搜索Icon } from "lucide-react";

export const 搜索ScopeInfoCard = () => {
    return (
        <div class名称="bg-popover border border-border rounded-lg shadow-lg p-4 w-80 max-w-[90vw]">
            <div class名称="flex items-center gap-2 mb-3 pb-2 border-b border-border/50">
                <Scan搜索Icon class名称="h-4 w-4 text-primary" />
                <h4 class名称="text-sm font-semibold text-popover-foreground">搜索 Scope</h4>
            </div>
            <div class名称="text-sm text-popover-foreground leading-relaxed">
                When asking Sourcebot a question, you can select one or more scopes to focus the search.
                There are two different types of search scopes:
                <div class名称="mt-3 space-y-2">
                    <div class名称="flex items-center gap-2">
                        <BookMarkedIcon class名称="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span><strong>仓库</strong>: A single repository, indicated by the code host icon.</span>
                    </div>
                    <div class名称="flex items-center gap-2">
                        <LibraryBigIcon class名称="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span><strong>Reposet</strong>: A set of repositories, indicated by the library icon.</span>
                    </div>
                </div>
            </div>
        </div>
    );
}; 