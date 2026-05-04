'use client';

import { SessionUser } from "@/auth";
import { useToast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/userAvatar";
import { ChatVisibility } from "@sourcebot/db";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, Link2Icon, Loader2, Lock, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { captureEvent } from "@/hooks/useCaptureEvent";

interface 分享设置Props {
    chatId: string;
    visibility: ChatVisibility;
    onVisibilityChange: (visibility: ChatVisibility) => Promise<boolean>;
    on移除分享dWithUser: (userId: string) => Promise<boolean>;
    onOpenInviteView: () => void;
    currentUser?: SessionUser;
    sharedWithUsers: SessionUser[];
    isChatSharingEnabledInCurrentPlan: boolean;
    isChatSharingEnabled: boolean;
}

export const 分享设置 = ({
    chatId,
    visibility,
    onVisibilityChange,
    on移除分享dWithUser,
    onOpenInviteView,
    currentUser,
    sharedWithUsers,
    isChatSharingEnabledInCurrentPlan,
    isChatSharingEnabled,
}: 分享设置Props) => {
    const [isVisibilityUpdating, setIsVisibilityUpdating] = useState(false);
    const [removingUserIds, setRemovingUserIds] = useState<Set<string>>(new Set());
    const { toast } = useToast();
    const pathname = usePathname();
    const isAuthenticated = !!currentUser;

    const handle复制Link = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            captureEvent('wa_chat_link_copied', {
                chatId,
                visibility,
            });
            toast({
                description: "✅ Link copied to clipboard",
            });
        } catch (e) {
            toast({
                description: `Failed to copy link: ${e instanceof Error ? e.message : "Unknown error"}`,
                variant: "destructive",
            });
        }
    }, [chatId, visibility, toast]);

    return (
        <div class名称="flex flex-col py-3 px-4">
            <p class名称="text-sm font-medium">分享</p>
            <Separator class名称="-mx-4 w-auto mt-2 mb-4" />

            {/* Fake 搜索 Bar - Click to open invite view */}
            {(isAuthenticated && isChatSharingEnabled) && (
                <>
                    <span class名称={cn({ "cursor-not-allowed": !isChatSharingEnabledInCurrentPlan })}>
                        <Button
                            variant="outline"
                            class名称={cn("w-full justify-start text-muted-foreground font-normal", {
                                "opacity-50 pointer-events-none": !isChatSharingEnabledInCurrentPlan,
                            })}
                            onClick={onOpenInviteView}
                            disabled={!isChatSharingEnabledInCurrentPlan}
                        >
                            搜索 for a user
                        </Button>
                    </span>

                    {/* People with access */}
                    <div class名称={cn("mt-4", {
                        "opacity-50 cursor-not-allowed": !isChatSharingEnabledInCurrentPlan,
                        "[&_*]:pointer-events-none": !isChatSharingEnabledInCurrentPlan,
                    })}>
                        <label class名称="text-sm text-muted-foreground mb-2 block">
                            People with access
                        </label>
                        <div class名称="space-y-1 max-h-[200px] overflow-y-auto pr-3">
                            {/* Owner (current user) */}
                            {currentUser && (
                                <div class名称="flex items-center justify-between py-2">
                                    <div class名称="flex items-center gap-3">
                                        <UserAvatar
                                            email={currentUser.email}
                                            imageUrl={currentUser.image}
                                            class名称="h-8 w-8"
                                        />
                                        <div class名称="flex flex-col">
                                            <span class名称="text-sm font-medium">
                                                {currentUser.name || currentUser.email}
                                                <span class名称="text-muted-foreground font-normal"> (you)</span>
                                            </span>
                                            {currentUser.name && currentUser.email && (
                                                <span class名称="text-xs text-muted-foreground">{currentUser.email}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 分享d users */}
                            {sharedWithUsers.map((user) => (
                                <div key={user.id} class名称="flex items-center justify-between py-2">
                                    <div class名称="flex items-center gap-3">
                                        <UserAvatar
                                            email={user.email}
                                            imageUrl={user.image}
                                            class名称="h-8 w-8"
                                        />
                                        <div class名称="flex flex-col">
                                            <span class名称="text-sm font-medium">{user.name || user.email}</span>
                                            {user.name && (
                                                <span class名称="text-xs text-muted-foreground">{user.email}</span>
                                            )}
                                        </div>
                                    </div>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                class名称="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                disabled={removingUserIds.has(user.id)}
                                                onClick={async () => {
                                                    setRemovingUserIds(prev => new Set(prev).add(user.id));
                                                    try {

                                                        await on移除分享dWithUser(user.id);
                                                    } finally {
                                                        setRemovingUserIds(prev => {
                                                            const next = new Set(prev);
                                                            next.delete(user.id);
                                                            return next;
                                                        });
                                                    }
                                                }}
                                            >
                                                {removingUserIds.has(user.id) ? (
                                                    <Loader2 class名称="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <X class名称="h-4 w-4" />
                                                )}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="bottom">移除 user</TooltipContent>
                                    </Tooltip>
                                </div>
                            ))}
                        </div>
                    </div>

                    {!isChatSharingEnabledInCurrentPlan && (
                        <p class名称="text-xs text-muted-foreground mt-2.5">
                            <Info class名称="h-3 w-3 inline-block mr-1.5 align-middle" />
                            <span class名称="align-middle">Sharing with specific users is not available on your current <Link href={'https://sourcebot.dev/pricing'} target="_blank" rel="noopener noreferrer" class名称="underline">plan</Link>.</span>
                        </p>
                    )}

                    <Separator class名称="-mx-4 w-auto my-4" />
                </>
            )}

            <label class名称="text-sm text-muted-foreground mb-3">
                Visibility
            </label>
            <Select
                value={visibility}
                onValueChange={async (value) => {
                    setIsVisibilityUpdating(true);
                    try {
                        await onVisibilityChange(value as ChatVisibility);
                    } finally {
                        setIsVisibilityUpdating(false);
                    }
                }}
                disabled={isVisibilityUpdating || !isAuthenticated}
            >
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={ChatVisibility.PRIVATE}>
                        <div class名称="flex items-center gap-2">
                            <Lock class名称="h-4 w-4" />
                            Only people with access
                        </div>
                    </SelectItem>
                    <SelectItem value={ChatVisibility.PUBLIC}>
                        <div class名称="flex items-center gap-2">
                            <Link2Icon class名称="h-4 w-4" />
                            Anyone with the link
                        </div>
                    </SelectItem>
                </SelectContent>
            </Select>
            {!isAuthenticated && (
                <p class名称="text-xs text-muted-foreground mt-2">
                    <Link href={`/login?callbackUrl=${encodeURIComponent(pathname)}`} class名称="underline">登录</Link> to change chat visibility.
                </p>
            )}
            <Separator class名称="-mx-4 w-auto my-4" />
            <div class名称="flex justify-between items-center">
                <Link
                    href="https://docs.sourcebot.dev/docs/features/ask/chat-sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    class名称="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <Info class名称="h-4 w-4" />
                    How does sharing chats work?
                </Link>
                <Button
                    variant="outline"
                    onClick={handle复制Link}
                    class名称="gap-2"
                >
                    <Link2Icon class名称="h-4 w-4" />
                    复制 Link
                </Button>
            </div>
        </div>
    );
};
