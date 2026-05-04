'use client';

import {
    LogOut,
    设置,
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { signOut } from "next-auth/react"
import posthog from "posthog-js";
import { Session } from "next-auth";
import { AppearanceDropdownMenuGroup } from "./appearanceDropdownMenuGroup";
import { UserAvatar } from "@/components/userAvatar";

interface MeControlDropdownMenuProps {
    menuButtonClass名称?: string;
    session: Session;
}

export const MeControlDropdownMenu = ({
    menuButtonClass名称,
    session,
}: MeControlDropdownMenuProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <UserAvatar
                    email={session.user.email}
                    imageUrl={session.user.image}
                    class名称={cn("h-8 w-8 cursor-pointer", menuButtonClass名称)}
                />
            </DropdownMenuTrigger>
            <DropdownMenuContent class名称="w-64" align="end" sideOffset={5}>
                <DropdownMenuGroup>
                    <div class名称="flex flex-row items-center gap-3 px-3 py-3">
                        <UserAvatar
                            email={session.user.email}
                            imageUrl={session.user.image}
                            class名称="h-10 w-10 flex-shrink-0"
                        />
                        <div class名称="flex flex-col flex-1 min-w-0">
                            <p class名称="text-sm font-semibold truncate">{session.user.name ?? "User"}</p>
                            {session.user.email && (
                                <p class名称="text-xs text-muted-foreground truncate">{session.user.email}</p>
                            )}
                        </div>
                    </div>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <AppearanceDropdownMenuGroup />
                <DropdownMenuItem asChild>
                    <a href={`/settings`}>
                        <设置 class名称="h-4 w-4 mr-2" />
                        <span>设置</span>
                    </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem
                        onClick={() => {
                            signOut({
                                redirectTo: "/login",
                            }).then(() => {
                                posthog.reset();
                            })
                        }}
                    >
                        <LogOut class名称="mr-2 h-4 w-4" />
                        <span>退出登录</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
