'use client';

import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { getIconForFolder } from "vscode-icons-js";
import { Icon } from "@iconify/react";

interface VscodeFolderIconProps {
    folder名称: string;
    class名称?: string;
}

export const VscodeFolderIcon = ({ folder名称, class名称 }: VscodeFolderIconProps) => {
    const icon名称 = useMemo(() => {
        const icon = getIconForFolder(folder名称);
        if (icon && typeof icon === 'string') {
            const icon名称 = `vscode-icons:${icon.substring(0, icon.indexOf('.')).replaceAll('_', '-')}`;
                return icon名称;
        }

        return "vscode-icons:default-folder";
    }, [folder名称]);

    return <Icon icon={icon名称} class名称={cn("w-4 h-4 flex-shrink-0", class名称)} />;
}
