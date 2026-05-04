'use client';

import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ChatVisibility } from "@sourcebot/db";
import { 分享设置 } from "./share设置";
import { useCallback, useState } from "react";
import { shareChatWithUsers, unshareChatWithUser, updateChatVisibility } from "@/features/chat/actions";
import { useToast } from "@/components/hooks/use-toast";
import { isServiceError } from "@/lib/utils";
import { Link2Icon, LockIcon } from "lucide-react";
import { SessionUser } from "@/auth";
import { InvitePanel } from "./ee/invitePanel";
import { captureEvent } from "@/hooks/useCaptureEvent";

interface 分享ChatPopoverProps {
    chatId: string;
    visibility: ChatVisibility;
    currentUser?: SessionUser;
    sharedWithUsers: SessionUser[];
    isChatSharingEnabledInCurrentPlan: boolean;
    isChatSharingEnabled: boolean;
}

type View = 'main' | 'invite';

export const 分享ChatPopover = ({
    chatId,
    visibility: _visibility,
    currentUser,
    sharedWithUsers: _sharedWithUsers,
    isChatSharingEnabledInCurrentPlan,
    isChatSharingEnabled,
}: 分享ChatPopoverProps) => {
    const [visibility, setVisibility] = useState(_visibility);
    const [sharedWithUsers, set分享dWithUsers] = useState(_sharedWithUsers);

    const [isOpen, _setIsOpen] = useState(false);
    const { toast } = useToast();
    const [view, setView] = useState<View>('main');

    const onChatVisibilityChange = useCallback(async (newVisibility: ChatVisibility) => {
        const previousVisibility = visibility;
        const response = await updateChatVisibility({ chatId, visibility: newVisibility });
        if (isServiceError(response)) {
            toast({
                description: `Failed to update visibility: ${response.message}`,
                variant: "destructive",
            });
            return false;
        } else {
            setVisibility(newVisibility);
            captureEvent('wa_chat_visibility_changed', {
                chatId,
                fromVisibility: previousVisibility,
                toVisibility: newVisibility,
            });
            toast({
                description: "✅ Chat visibility updated"
            });
            return true;
        }
    }, [chatId, toast, visibility]);

    const onUnshareChatWithUser = useCallback(async (userId: string) => {
        const response = await unshareChatWithUser({ chatId, userId });
        if (isServiceError(response)) {
            toast({
                description: `Failed to remove invited user: ${response.message}`,
                variant: "destructive",
            });
            return false;
        } else {
            set分享dWithUsers(prev => prev.filter(u => u.id !== userId));
            captureEvent('wa_chat_user_removed', { chatId });
            toast({
                description: "✅ Access removed"
            });
            return true;
        }
    }, [chatId, toast]);


    const on分享ChatWithUsers = useCallback(async (users: SessionUser[]) => {
        if (users.length === 0) {
            return false;
        }
        const response = await shareChatWithUsers({ chatId, userIds: users.map(user => user.id) });

        if (isServiceError(response)) {
            toast({
                description: `Failed to share with ${users.length} user${users.length > 1 ? 's' : ''}`,
                variant: "destructive",
            });
            return false;
        } else {
            set分享dWithUsers(prev => [...prev, ...users]);
            captureEvent('wa_chat_users_invited', {
                chatId,
                numUsersInvited: users.length,
            });
            toast({
                description: `✅ Invited ${users.length} user${users.length > 1 ? 's' : ''}`
            });
            setView('main');
            return true;
        }
    }, [chatId, toast]);

    const onOpenChange = useCallback((open: boolean) => {
        _setIsOpen(open);
        if (open) {
            captureEvent('wa_chat_share_dialog_opened', {
                chatId,
                currentVisibility: visibility,
            });
        }
        // Small delay to ensure the popover close animation completes
        setTimeout(() => {
            if (!open) {
                setView('main');
            }
        }, 100);
    }, [chatId, visibility]);


    return (
        <Popover open={isOpen} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    class名称="gap-1.5 h-8"
                >
                    {visibility === ChatVisibility.PUBLIC ? (
                        <Link2Icon class名称="h-4 w-4" />
                    ) : (
                        <LockIcon class名称="h-4 w-4" />
                    )}
                    分享
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" class名称="w-[420px] p-0">
                {view === 'main' ? (
                    <分享设置
                        chatId={chatId}
                        visibility={visibility}
                        onVisibilityChange={onChatVisibilityChange}
                        on移除分享dWithUser={onUnshareChatWithUser}
                        currentUser={currentUser}
                        sharedWithUsers={sharedWithUsers}
                        onOpenInviteView={() => setView('invite')}
                        isChatSharingEnabledInCurrentPlan={isChatSharingEnabledInCurrentPlan}
                        isChatSharingEnabled={isChatSharingEnabled}
                    />
                ) : (isChatSharingEnabledInCurrentPlan && isChatSharingEnabled)? (
                    <InvitePanel
                        chatId={chatId}
                        on返回={() => setView('main')}
                        on分享ChatWithUsers={on分享ChatWithUsers}
                    />
                ) : null}
            </PopoverContent>
        </Popover>
    );
};
