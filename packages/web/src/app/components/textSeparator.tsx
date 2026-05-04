import { cn } from "@/lib/utils"


interface TextSeparatorProps {
    class名称?: string;
    text?: string;
}

export const TextSeparator = ({ class名称, text = "or" }: TextSeparatorProps) => {
    return (
        <div class名称={cn("flex items-center w-full gap-4", class名称)}>
            <div class名称="h-[1px] flex-1 bg-border" />
            <span class名称="text-muted-foreground text-sm">{text}</span>
            <div class名称="h-[1px] flex-1 bg-border" />
        </div>
    )
}