'use client';

import { useMemo } from "react";
import { VscodeFolderIcon } from "@/app/components/vscodeFolderIcon";
import { VscodeFileIcon } from "@/app/components/vscodeFileIcon";
import { FileTreeItem } from "@/features/git";

interface FileTreeItemIconProps {
    item: FileTreeItem;
    class名称?: string;
}

export const FileTreeItemIcon = ({ item, class名称 }: FileTreeItemIconProps) => {
    const ItemIcon = useMemo(() => {
        if (item.type === 'tree') {
            return <VscodeFolderIcon folder名称={item.name} class名称={class名称} />
        } else {
            return <VscodeFileIcon file名称={item.name} class名称={class名称} />
        }
    }, [item.name, item.type, class名称]);

    return ItemIcon;
}