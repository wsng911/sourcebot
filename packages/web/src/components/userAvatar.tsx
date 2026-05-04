'use client';

import { ComponentPropsWithoutRef, forwardRef, useMemo } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface UserAvatarProps extends ComponentPropsWithoutRef<typeof Avatar> {
    email?: string | null;
    imageUrl?: string | null;
}

export const UserAvatar = forwardRef<HTMLSpanElement, UserAvatarProps>(
    ({ email, imageUrl, class名称, ...rest }, ref) => {
        const resolverUri = useMemo(() => {
            if (!email) {
                return undefined;
            }
            return `/api/avatar?email=${encodeURIComponent(email)}`;
        }, [email]);

        const src = imageUrl ?? resolverUri;

        return (
            <Avatar ref={ref} class名称={cn("bg-muted", class名称)} {...rest}>
                {/*
                  We render a raw <img> instead of Radix's <AvatarImage>. AvatarImage
                  delays painting until its internal `new Image().onload` fires —
                  which is async even when the URL is in HTTP cache — and that
                  one-frame gap manifests as a flicker every time a marker mounts
                  (e.g., on scroll). The browser paints cached <img> synchronously.
                */}
                {src && (
                    <img
                        src={src}
                        alt=""
                        class名称="aspect-square h-full w-full"
                    />
                )}
            </Avatar>
        );
    }
);

UserAvatar.display名称 = 'UserAvatar';
