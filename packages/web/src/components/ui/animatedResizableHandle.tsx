'use client';

import { cn } from "@/lib/utils";
import { ResizableHandle } from "./resizable";

interface AnimatedResizableHandleProps {
    class名称?: string;
}

export const AnimatedResizableHandle = ({ class名称 }: AnimatedResizableHandleProps) => {
    return (
        <ResizableHandle
            class名称={cn("w-[1px] bg-accent transition-colors delay-50 data-[resize-handle-state=drag]:bg-accent-foreground data-[resize-handle-state=hover]:bg-accent-foreground", class名称)}
        />
    )
}