'use client';

import { KeyboardShortcutHint } from "@/app/components/keyboardShortcutHint";
import { useToast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ResizablePanel } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { deleteChat, duplicateChat, updateChat名称 } from "@/features/chat/actions";
import { captureEvent } from "@/hooks/useCaptureEvent";
import { cn, isServiceError } from "@/lib/utils";
import { CirclePlusIcon, EllipsisIcon } from "lucide-react";
import { Chat操作Dropdown } from "./chat操作Dropdown";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import {
    GoSidebarCollapse as ExpandIcon,
} from "react-icons/go";
import { ImperativePanelHandle } from "react-resizable-panels";
import { useChatId } from "../useChatId";
import { RenameChatDialog } from "./renameChatDialog";
import { 删除ChatDialog } from "./deleteChatDialog";
import { DuplicateChatDialog } from "./duplicateChatDialog";
import Link from "next/link";

interface ChatSidePanelProps {
    order: number;
    chatHistory: {
        id: string;
        name: string | null;
        createdAt: Date;
    }[];
    isAuthenticated: boolean;
    isCollapsedInitially: boolean;
}

export const ChatSidePanel = ({
    order,
    chatHistory,
    isAuthenticated,
    isCollapsedInitially,
}: ChatSidePanelProps) => {
    const [isCollapsed, setIsCollapsed] = useState(isCollapsedInitially);
    const sidePanelRef = useRef<ImperativePanelHandle>(null);
    const router = useRouter();
    const { toast } = useToast();
    const chatId = useChatId();
    const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
    const [chatIdToRename, setChatIdToRename] = useState<string | null>(null);
    const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);
    const [chatIdToDuplicate, setChatIdToDuplicate] = useState<string | null>(null);
    const [is删除DialogOpen, setIs删除DialogOpen] = useState(false);
    const [chatIdTo删除, setChatIdTo删除] = useState<string | null>(null);

    useHotkeys("mod+b", () => {
        if (isCollapsed) {
            sidePanelRef.current?.expand();
        } else {
            sidePanelRef.current?.collapse();
        }
    }, {
        enableOnFormTags: true,
        enableOnContent编辑able: true,
        description: "Toggle side panel",
    });

    const onRenameChat = useCallback(async (name: string, chatId: string): Promise<boolean> => {
        if (!chatId) {
            return false;
        }

        const response = await updateChat名称({
            chatId,
            name: name,
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
            captureEvent('wa_chat_renamed', { chatId });
            router.refresh();
            return true;
        }
    }, [router, toast]);

    const on删除Chat = useCallback(async (chatIdTo删除: string): Promise<boolean> => {
        if (!chatIdTo删除) {
            return false;
        }

        const response = await deleteChat({ chatId: chatIdTo删除 });

        if (isServiceError(response)) {
            toast({
                description: `❌ Failed to delete chat. Reason: ${response.message}`
            });
            return false;
        } else {
            toast({
                description: `✅ Chat deleted successfully`
            });
            captureEvent('wa_chat_deleted', { chatId: chatIdTo删除 });

            // If we just deleted the current chat, navigate to new chat
            if (chatIdTo删除 === chatId) {
                router.push(`/chat`);
            }

            return true;
        }
    }, [chatId, router, toast]);

    const onDuplicateChat = useCallback(async (new名称: string, chatIdToDuplicate: string): Promise<string | null> => {
        if (!chatIdToDuplicate) {
            return null;
        }

        const response = await duplicateChat({ chatId: chatIdToDuplicate, new名称 });

        if (isServiceError(response)) {
            toast({
                description: `❌ Failed to duplicate chat. Reason: ${response.message}`
            });
            return null;
        } else {
            toast({
                description: `✅ Chat duplicated successfully`
            });
            captureEvent('wa_chat_duplicated', { chatId: chatIdToDuplicate });
            router.push(`/chat/${response.id}`);
            return response.id;
        }
    }, [router, toast]);

    return (
        <>
            <ResizablePanel
                ref={sidePanelRef}
                order={order}
                minSize={10}
                maxSize={15}
                defaultSize={isCollapsed ? 0 : 15}
                collapsible={true}
                id="chat-side-panel"
                onCollapse={() => setIsCollapsed(true)}
                onExpand={() => setIsCollapsed(false)}
            >
                <div class名称="flex flex-col h-full py-4">
                    <div class名称="px-2.5 mb-4">
                        <Button
                            variant="outline"
                            size="sm"
                            class名称="w-full"
                            onClick={() => {
                                router.push(`/chat`);
                            }}
                        >
                            <CirclePlusIcon class名称="w-4 h-4 mr-1" />
                            New Chat
                        </Button>
                    </div>
                    <ScrollArea class名称="flex flex-col h-full px-2.5">
                        <p class名称="text-sm font-medium mb-4">Recent Chats</p>
                        <div class名称="flex flex-col gap-1">
                            {!isAuthenticated ? (
                                <div class名称="flex flex-col">
                                    <p class名称="text-sm text-muted-foreground mb-4">
                                        <Link
                                            href={`/login?callbackUrl=${encodeURIComponent(`/chat`)}`}
                                            class名称="text-sm text-link hover:underline cursor-pointer"
                                        >
                                            登录
                                        </Link> to access your chat history.
                                    </p>
                                </div>
                            ) : chatHistory.length === 0 ? (
                                <div class名称="mx-auto w-full h-52 border border-dashed border-muted-foreground rounded-md flex items-center justify-center p-6">
                                    <p class名称="text-sm text-muted-foreground text-center">Recent chats will appear here.</p>
                                </div>
                            ) : chatHistory.map((chat) => (
                                <div
                                    key={chat.id}
                                    class名称={cn("group flex flex-row items-center justify-between hover:bg-muted rounded-md px-2 py-1.5 cursor-pointer",
                                        chat.id === chatId && "bg-muted"
                                    )}
                                    onClick={() => {
                                        router.push(`/chat/${chat.id}`);
                                    }}
                                >
                                    <span class名称="text-sm truncate">{chat.name ?? 'Untitled chat'}</span>
                                    <Chat操作Dropdown
                                        onRenameClick={() => {
                                            setChatIdToRename(chat.id);
                                            setIsRenameDialogOpen(true);
                                        }}
                                        onDuplicateClick={() => {
                                            setChatIdToDuplicate(chat.id);
                                            setIsDuplicateDialogOpen(true);
                                        }}
                                        on删除Click={() => {
                                            setChatIdTo删除(chat.id);
                                            setIs删除DialogOpen(true);
                                        }}
                                    >
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            class名称="h-5 w-5 z-10 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted-accent"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                            }}
                                        >
                                            <EllipsisIcon class名称="w-4 h-4" />
                                        </Button>
                                    </Chat操作Dropdown>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

            </ResizablePanel >
            {isCollapsed && (
                <div class名称="flex flex-col items-center h-full p-2">
                    <Tooltip
                        delayDuration={100}
                    >
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                class名称="h-8 w-8"
                                onClick={() => {
                                    sidePanelRef.current?.expand();
                                }}
                            >
                                <ExpandIcon class名称="w-4 h-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" class名称="flex flex-row items-center gap-2">
                            <KeyboardShortcutHint shortcut="mod+b" />
                            <Separator orientation="vertical" class名称="h-4" />
                            <span>Open side panel</span>
                        </TooltipContent>
                    </Tooltip>
                </div>
            )}
            <RenameChatDialog
                isOpen={isRenameDialogOpen}
                onOpenChange={setIsRenameDialogOpen}
                onRename={async (name) => {
                    if (chatIdToRename) {
                        return await onRenameChat(name, chatIdToRename);
                    }
                    return false;
                }}
                current名称={chatHistory?.find((chat) => chat.id === chatIdToRename)?.name ?? "Untitled chat"}
            />
            <删除ChatDialog
                isOpen={is删除DialogOpen}
                onOpenChange={setIs删除DialogOpen}
                on删除={async () => {
                    if (chatIdTo删除) {
                        return await on删除Chat(chatIdTo删除);
                    }
                    return false;
                }}
            />
            <DuplicateChatDialog
                isOpen={isDuplicateDialogOpen}
                onOpenChange={setIsDuplicateDialogOpen}
                onDuplicate={async (new名称) => {
                    if (chatIdToDuplicate) {
                        return await onDuplicateChat(new名称, chatIdToDuplicate);
                    }
                    return null;
                }}
                current名称={chatHistory?.find((chat) => chat.id === chatIdToDuplicate)?.name ?? "Untitled chat"}
            />
        </>
    )
}
