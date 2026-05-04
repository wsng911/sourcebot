'use client';

import { searchChat分享ableMembers } from "@/app/api/(client)/client";
import { 搜索Chat分享ableMembersResponse } from "@/app/api/(server)/ee/chat/[chatId]/searchMembers/route";
import { SessionUser } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { Separator } from "@/components/ui/separator";
import { unwrapServiceError } from "@/lib/utils";
import { UserAvatar } from "@/components/userAvatar";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { ChevronLeft, Circle, CircleCheck, Loader2, X } from "lucide-react";
import { useRef, useState } from "react";

interface InvitePanelProps {
    chatId: string;
    on返回: () => void;
    on分享ChatWithUsers: (users: SessionUser[]) => Promise<boolean>;
}


export const InvitePanel = ({
    chatId,
    on返回,
    on分享ChatWithUsers,
}: InvitePanelProps) => {
    const [searchQuery, set搜索Query] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<SessionUser[]>([]);
    const [isInviting, setIsInviting] = useState(false);
    const resultsRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const debounced搜索Query = useDebounce(searchQuery, 100);

    const { data: searchResults, isPending, isError } = useQuery<搜索Chat分享ableMembersResponse>({
        queryKey: ['search-chat-shareable-members', chatId, debounced搜索Query],
        queryFn: () => unwrapServiceError(searchChat分享ableMembers({ chatId, query: debounced搜索Query}))
    })

    const isUserSelected = (userId: string) => {
        return selectedUsers.some(u => u.id === userId);
    };

    return (
        /* Invite View */
        <div class名称="flex flex-col">
            {/* Header */}
            <div class名称="flex items-center gap-2 py-3 px-4">
                <Button
                    variant="ghost"
                    size="icon"
                    class名称="h-6 w-6"
                    onClick={on返回}
                >
                    <ChevronLeft class名称="h-4 w-4" />
                </Button>
                <p class名称="text-sm font-medium">Invite Users</p>
            </div>
            <Separator />

            {/* 搜索 */}
            <div class名称="p-4 space-y-4">
                <div class名称="flex flex-wrap items-center gap-1 min-h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus-within:ring-1 focus-within:ring-ring">
                    {selectedUsers.map(user => (
                        <Badge key={user.id} variant="secondary" class名称="gap-1 shrink-0">
                            {user.email}
                            <X
                                class名称="h-3 w-3 cursor-pointer"
                                onClick={() => setSelectedUsers(prev => prev.filter(u => u.id !== user.id))}
                            />
                        </Badge>
                    ))}
                    <input
                        ref={inputRef}
                        class名称="flex-1 min-w-[120px] bg-transparent outline-none placeholder:text-muted-foreground"
                        placeholder={selectedUsers.length === 0 ? "搜索 for a user" : ""}
                        value={searchQuery}
                        onChange={(e) => set搜索Query(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'ArrowDown') {
                                e.preventDefault();
                                const firstButton = resultsRef.current?.querySelector('button');
                                firstButton?.focus();
                            }
                        }}
                        autoFocus={true}
                    />
                </div>

                {/* 搜索 Results / Selected Users */}
                <div class名称="min-h-[100px] max-h-[240px] overflow-y-auto p-1 -m-1">
                    {isPending ? (
                        <div class名称="py-6 text-center">
                            <Loader2 class名称="h-4 w-4 animate-spin mx-auto text-muted-foreground" />
                        </div>
                    ) : isError ? (
                        <p class名称="text-sm text-muted-foreground py-2">Error loading search results</p>
                    ) : searchQuery && searchResults.length === 0 ? (
                        <p class名称="text-sm text-muted-foreground py-2">No results</p>
                    ) : searchResults.length === 0 ? (
                        <p class名称="text-sm text-muted-foreground py-2">搜索 for users to invite</p>
                    ) : (
                        <div ref={resultsRef} class名称="space-y-1">
                            {searchResults.map((user, index) => {
                                const selected = isUserSelected(user.id);
                                return (
                                    <Button
                                        key={user.id}
                                        variant="ghost"
                                        onClick={() => {
                                            setSelectedUsers(prev => {
                                                const isSelected = prev.some(u => u.id === user.id);
                                                if (isSelected) {
                                                    return prev.filter(u => u.id !== user.id);
                                                } else {
                                                    set搜索Query('');
                                                    return [...prev, user];
                                                }
                                            });
                                        }}
                                        onKeyDown={(e) => {
                                            const buttons = resultsRef.current?.querySelectorAll('button');
                                            if (!buttons) return;

                                            if (e.key === 'ArrowDown') {
                                                e.preventDefault();
                                                const nextButton = buttons[index + 1];
                                                nextButton?.focus();
                                            } else if (e.key === 'ArrowUp') {
                                                e.preventDefault();
                                                if (index === 0) {
                                                    inputRef.current?.focus();
                                                } else {
                                                    const prevButton = buttons[index - 1];
                                                    prevButton?.focus();
                                                }
                                            }
                                        }}
                                        class名称="w-full justify-start h-auto py-2 px-2"
                                    >
                                        {selected ? (
                                            <CircleCheck class名称="h-5 w-5 text-primary shrink-0" />
                                        ) : (
                                            <Circle class名称="h-5 w-5 text-muted-foreground shrink-0" />
                                        )}
                                        <UserAvatar
                                            email={user.email}
                                            imageUrl={user.image}
                                            class名称="h-8 w-8 ml-2"
                                        />
                                        <div class名称="flex flex-col items-start ml-1">
                                            <span class名称="text-sm font-medium">{user.name || user.email}</span>
                                            {user.name && (
                                                <span class名称="text-xs text-muted-foreground font-normal">{user.email}</span>
                                            )}
                                        </div>
                                    </Button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <Separator />

            {/* Invite Button */}
            <div class名称="p-4">
                <LoadingButton
                    onClick={async () => {
                        setIsInviting(true);
                        try {
                            await on分享ChatWithUsers(selectedUsers);
                        } finally {
                            setIsInviting(false);
                        }
                    }}
                    disabled={selectedUsers.length === 0 || isInviting}
                    loading={isInviting}
                    class名称="w-full"
                    variant={selectedUsers.length > 0 ? "default" : "secondary"}
                >
                    {selectedUsers.length > 0 ? (
                        `Invite ${selectedUsers.length} user${selectedUsers.length > 1 ? 's' : ''}`
                    ) : (
                        "Invite"
                    )}
                </LoadingButton>
            </div>
        </div>
    );
};
