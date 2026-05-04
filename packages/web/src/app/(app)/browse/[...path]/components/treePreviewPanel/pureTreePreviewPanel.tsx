'use client';

import { useRef } from "react";
import { FileTreeItemComponent } from "@/app/(app)/browse/components/fileTreeItemComponent";
import { getBrowsePath } from "@/app/(app)/browse/hooks/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useBrowseParams } from "@/app/(app)/browse/hooks/useBrowseParams";
import { FileTreeItem } from "@/features/git";

interface PureTreePreviewPanelProps {
    items: FileTreeItem[];
}

export const PureTreePreviewPanel = ({ items }: PureTreePreviewPanelProps) => {
    const { repo名称, revision名称 } = useBrowseParams();
    const scrollAreaRef = useRef<HTMLDivElement>(null);
   
    return (
        <ScrollArea
            class名称="flex flex-col p-0.5"
            ref={scrollAreaRef}
        >
            {items.map((item) => (
                <FileTreeItemComponent
                    key={item.path}
                    node={item}
                    isActive={false}
                    depth={0}
                    isCollapseChevronVisible={false}
                    parentRef={scrollAreaRef}
                    href={getBrowsePath({
                        repo名称,
                        revision名称,
                        path: item.path,
                        pathType: item.type === 'tree' ? 'tree' : 'blob',
                    })}
                />
            ))}
        </ScrollArea>
    )
}