'use client';

import { useToast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { deleteChat, duplicateChat, updateChat名称 } from "@/features/chat/actions";
import { isServiceError } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Chat操作Dropdown } from "./chat操作Dropdown";
import { 删除ChatDialog } from "./deleteChatDialog";
import { DuplicateChatDialog } from "./duplicateChatDialog";
import { RenameChatDialog } from "./renameChatDialog";

interface Chat名称Props {
    name: string | null;
    id: string;
    isOwner?: boolean;
    isAuthenticated?: boolean;
}

export const Chat名称 = ({ name, id, isOwner = false, isAuthenticated = false }: Chat名称Props) => {
    const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
    const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);
    const [is删除DialogOpen, setIs删除DialogOpen] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const onRenameChat = useCallback(async (new名称: string): Promise<boolean> => {
        const response = await updateChat名称({
            chatId: id,
            name: new名称,
        });

        if (isServiceError(response)) {
            toast({
                description: `❌ Failed to rename chat. Reason: ${response.message}`
            });
            return false;
        } else {
            toast({
                description: `✅ Chat renamed successfully`
            });
            router.refresh();
            return true;
        }
    }, [id, toast, router]);

    const on删除Chat = useCallback(async (): Promise<boolean> => {
        const response = await deleteChat({ chatId: id });

        if (isServiceError(response)) {
            toast({
                description: `❌ Failed to delete chat. Reason: ${response.message}`
            });
            return false;
        } else {
            toast({
                description: `✅ Chat deleted successfully`
            });
            router.push(`/chat`);
            return true;
        }
    }, [id, toast, router]);

    const onDuplicateChat = useCallback(async (new名称: string): Promise<string | null> => {
        const response = await duplicateChat({ chatId: id, new名称 });

        if (isServiceError(response)) {
            toast({
                description: `❌ Failed to duplicate chat. Reason: ${response.message}`
            });
            return null;
        } else {
            toast({
                description: `✅ Chat duplicated successfully`
            });
            router.push(`/chat/${response.id}`);
            return response.id;
        }
    }, [id, toast, router]);

    return (
        <>
            <div class名称="flex flex-row gap-1 items-center">
                <p class名称="text-sm font-medium">
                    {name ?? 'Untitled chat'}
                </p>
                {isOwner && (
                    <Chat操作Dropdown
                        onRenameClick={() => setIsRenameDialogOpen(true)}
                        onDuplicateClick={() => setIsDuplicateDialogOpen(true)}
                        on删除Click={() => setIs删除DialogOpen(true)}
                        show删除={isAuthenticated}
                        align="center"
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            class名称="h-6 w-6"
                        >
                            <ChevronDown class名称="h-4 w-4" />
                        </Button>
                    </Chat操作Dropdown>
                )}
            </div>
            <RenameChatDialog
                isOpen={isRenameDialogOpen}
                onOpenChange={setIsRenameDialogOpen}
                onRename={onRenameChat}
                current名称={name ?? "Untitled chat"}
            />
            <删除ChatDialog
                isOpen={is删除DialogOpen}
                onOpenChange={setIs删除DialogOpen}
                on删除={on删除Chat}
            />
            <DuplicateChatDialog
                isOpen={isDuplicateDialogOpen}
                onOpenChange={setIsDuplicateDialogOpen}
                onDuplicate={onDuplicateChat}
                current名称={name ?? "Untitled chat"}
            />
        </>
    )
}
