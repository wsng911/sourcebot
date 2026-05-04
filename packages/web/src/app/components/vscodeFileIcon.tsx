'use client';

import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { getIconForFile } from "vscode-icons-js";
import { Icon } from "@iconify/react";

interface VscodeFileIconProps {
    file名称: string;
    class名称?: string;
}

export const VscodeFileIcon = ({ file名称, class名称 }: VscodeFileIconProps) => {
    const icon名称 = useMemo(() => {
        const icon = getIconForFile(file名称);
        if (icon && typeof icon === 'string') {
            const icon名称 = `vscode-icons:${icon.substring(0, icon.indexOf('.')).replaceAll('_', '-')}`;
            return icon名称;
        }

        return "vscode-icons:default-file";
    }, [file名称]);

    return <Icon icon={icon名称} class名称={cn("w-4 h-4 flex-shrink-0", class名称)} />;
}
