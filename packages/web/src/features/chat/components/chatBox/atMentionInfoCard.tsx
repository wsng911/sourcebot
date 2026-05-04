import { AtSignIcon } from "lucide-react";

export const AtMentionInfoCard = () => {
    return (
        <div class名称="bg-popover border border-border rounded-lg shadow-lg p-4 w-80 max-w-[90vw]">
            <div class名称="flex items-center gap-2 mb-3 pb-2 border-b border-border/50">
                <AtSignIcon class名称="h-4 w-4 text-primary" />
                <h4 class名称="text-sm font-semibold text-popover-foreground">Mention</h4>
            </div>
            <div class名称="text-sm text-popover-foreground leading-relaxed">
                When asking Sourcebot a question, you can @ mention files to include them in the context of the search.
            </div>
        </div>
    );
}; 