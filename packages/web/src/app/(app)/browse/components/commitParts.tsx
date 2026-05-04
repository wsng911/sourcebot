import type { ReactNode } from "react";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { UserAvatar } from "@/components/userAvatar";
import { cn } from "@/lib/utils";
import type { Author } from "./commitAuthors";

interface AuthorsAvatarGroupProps {
    authors: Author[];
    class名称?: string;
}

export const AuthorsAvatarGroup = ({ authors, class名称 }: AuthorsAvatarGroupProps) => {
    const displayed = authors.slice(0, 2);
    const overflow = Math.max(0, authors.length - 2);

    return (
        <AvatarGroup class名称={cn("flex-shrink-0", class名称)}>
            {displayed.map((a) => (
                <UserAvatar
                    key={a.email}
                    email={a.email}
                    title={a.email}
                    class名称="h-5 w-5"
                />
            ))}
            {overflow > 0 && (
                <AvatarGroupCount class名称="size-5 text-xs">
                    +{overflow}
                </AvatarGroupCount>
            )}
        </AvatarGroup>
    );
};

interface CommitBodyToggleProps {
    pressed: boolean;
    onPressedChange: (pressed: boolean) => void;
}

export const CommitBodyToggle = ({ pressed, onPressedChange }: CommitBodyToggleProps) => (
    <Tooltip>
        <TooltipTrigger asChild>
            <Toggle
                pressed={pressed}
                onPressedChange={onPressedChange}
                aria-label="Open commit details"
            >
                <MoreHorizontal />
            </Toggle>
        </TooltipTrigger>
        <TooltipContent>Open commit details</TooltipContent>
    </Tooltip>
);

interface CommitBodyProps {
    body: string;
    class名称?: string;
}

export const CommitBody = ({ body, class名称 }: CommitBodyProps) => (
    <div class名称={cn("px-3 py-2 bg-muted/30", class名称)}>
        <pre class名称="text-sm font-mono text-foreground whitespace-pre-wrap break-words">
            {body.trim()}
        </pre>
    </div>
);

interface CommitActionLinkProps {
    href: string;
    label: string;
    icon: ReactNode;
}

export const CommitActionLink = ({ href, label, icon }: CommitActionLinkProps) => (
    <Tooltip>
        <TooltipTrigger asChild>
            <Button asChild variant="ghost" size="sm" class名称="h-6 w-6 text-muted-foreground">
                <Link href={href} aria-label={label}>
                    {icon}
                </Link>
            </Button>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
    </Tooltip>
);
