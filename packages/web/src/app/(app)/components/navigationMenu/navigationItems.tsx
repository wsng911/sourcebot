"use client";

import { NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Badge } from "@/components/ui/badge";
import { cn, getShortenedNumberDisplayString } from "@/lib/utils";
import { 搜索Icon, MessageCircleIcon, BookMarkedIcon, 设置Icon, BotIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { NotificationDot } from "../notificationDot";

interface NavigationItemsProps {
    numberOfRepos: number;
    isReposButtonNotificationDotVisible: boolean;
    is设置ButtonNotificationDotVisible: boolean;
    isAuthenticated: boolean;
    isAgentsVisible: boolean;
}

export const NavigationItems = ({
    numberOfRepos,
    isReposButtonNotificationDotVisible,
    is设置ButtonNotificationDotVisible,
    isAuthenticated,
    isAgentsVisible,
}: NavigationItemsProps) => {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === '/') {
            return pathname === '/';
        }
        return pathname.startsWith(href);
    };

    return (
        <NavigationMenuList class名称="gap-2">
            <NavigationMenuItem class名称="relative">
                <NavigationMenuLink
                    href="/search"
                    class名称={cn(navigationMenuTriggerStyle(), "gap-2")}
                >
                    <搜索Icon class名称="w-4 h-4 mr-1" />
                    搜索
                </NavigationMenuLink>
                {((isActive('/') || isActive('/search')) && <ActiveIndicator />)}
            </NavigationMenuItem>
            <NavigationMenuItem class名称="relative">
                <NavigationMenuLink
                    href="/chat"
                    class名称={navigationMenuTriggerStyle()}
                >
                    <MessageCircleIcon class名称="w-4 h-4 mr-1" />
                    Ask
                </NavigationMenuLink>
                {isActive('/chat') && <ActiveIndicator />}
            </NavigationMenuItem>
            <NavigationMenuItem class名称="relative">
                <NavigationMenuLink
                    href="/repos"
                    class名称={navigationMenuTriggerStyle()}
                >
                    <BookMarkedIcon class名称="w-4 h-4 mr-1" />
                    <span class名称="mr-2">仓库列表</span>
                    <Badge variant="secondary" class名称="px-1.5 relative">
                        {getShortenedNumberDisplayString(numberOfRepos)}
                        {isReposButtonNotificationDotVisible && <NotificationDot class名称="absolute -right-0.5 -top-0.5" />}
                    </Badge>
                </NavigationMenuLink>
                {isActive('/repos') && <ActiveIndicator />}
            </NavigationMenuItem>
            {isAgentsVisible && (
                <NavigationMenuItem class名称="relative">
                    <NavigationMenuLink
                        href="/agents"
                        class名称={navigationMenuTriggerStyle()}
                    >
                        <BotIcon class名称="w-4 h-4 mr-1" />
                        Agents
                    </NavigationMenuLink>
                    {isActive('/agents') && <ActiveIndicator />}
                </NavigationMenuItem>
            )}
            {isAuthenticated && (
                <NavigationMenuItem class名称="relative">
                    <NavigationMenuLink
                        href="/settings"
                        class名称={navigationMenuTriggerStyle()}
                    >
                        <设置Icon class名称="w-4 h-4 mr-1" />
                        设置
                        {is设置ButtonNotificationDotVisible && <NotificationDot class名称="absolute -right-0.5 -top-0.5" />}
                    </NavigationMenuLink>
                    {isActive('/settings') && <ActiveIndicator />}
                </NavigationMenuItem>
            )}
        </NavigationMenuList>
    );
};

const ActiveIndicator = () => {
    return (
        <div class名称="absolute -bottom-2 left-0 right-0 h-0.5 bg-foreground" />
    );
};
