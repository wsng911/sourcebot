"use client"

import { buttonVariants } from "@/components/ui/button"
import { NotificationDot } from "@/app/(app)/components/notificationDot"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"

export type SidebarNavItem = {
    href: string
    hrefRegex?: string
    title: React.ReactNode
    isNotificationDotVisible?: boolean
}

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
    items: SidebarNavItem[]
}

export function SidebarNav({ class名称, items, ...props }: SidebarNavProps) {
    const pathname = usePathname()

    return (
        <nav
            class名称={cn(
                "flex flex-col space-x-2 lg:space-x-0 lg:space-y-1",
                class名称
            )}
            {...props}
        >
            {items.map((item) => {
                const isActive = item.hrefRegex ? new RegExp(item.hrefRegex).test(pathname) : pathname === item.href;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        class名称={cn(
                            buttonVariants({ variant: "ghost" }),
                            isActive
                                ? "bg-muted hover:bg-muted"
                                : "hover:bg-transparent hover:underline",
                            "justify-start"
                        )}
                    >
                        {item.title}
                        {item.isNotificationDotVisible && <NotificationDot class名称="ml-1.5" />}
                    </Link>
                )
            })}
        </nav>
    )
}