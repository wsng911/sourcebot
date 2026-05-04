'use client';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 复制Icon, PencilIcon, TrashIcon } from "lucide-react";

interface Chat操作DropdownProps {
    children: React.ReactNode;
    onRenameClick: () => void;
    onDuplicateClick: () => void;
    on删除Click: () => void;
    show删除?: boolean;
    align?: "start" | "center" | "end";
}

export const Chat操作Dropdown = ({
    children,
    onRenameClick,
    onDuplicateClick,
    on删除Click,
    show删除 = true,
    align = "start",
}: Chat操作DropdownProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {children}
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align={align}
                class名称="z-20"
            >
                <DropdownMenuItem
                    class名称="cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRenameClick();
                    }}
                >
                    <PencilIcon class名称="w-4 h-4 mr-2" />
                    Rename
                </DropdownMenuItem>
                <DropdownMenuItem
                    class名称="cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDuplicateClick();
                    }}
                >
                    <复制Icon class名称="w-4 h-4 mr-2" />
                    Duplicate
                </DropdownMenuItem>
                {show删除 && (
                    <DropdownMenuItem
                        class名称="cursor-pointer text-destructive focus:text-destructive"
                        onClick={(e) => {
                            e.stopPropagation();
                            on删除Click();
                        }}
                    >
                        <TrashIcon class名称="w-4 h-4 mr-2" />
                        删除
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
