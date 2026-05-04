import React from "react"
import { Metadata } from "next"
import { SidebarNav } from "./components/sidebar-nav"
import { NavigationMenu } from "../components/navigationMenu"
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isServiceError } from "@/lib/utils";
import { getConnectionStats, getOrgAccountRequests } from "@/actions";
import { ServiceErrorException } from "@/lib/serviceError";
import { OrgRole } from "@prisma/client";
import { env, hasEntitlement } from "@sourcebot/shared";
import { withAuth } from "@/middleware/withAuth";

interface LayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: "设置",
}

export default async function 设置Layout(
    props: LayoutProps
) {
    const {
        children
    } = props;

    const session = await auth();
    if (!session) {
        return redirect('/');
    }

    const sidebarNavItems = await getSidebarNavItems();
    if (isServiceError(sidebarNavItems)) {
        throw new ServiceErrorException(sidebarNavItems);
    }

    return (
        <div class名称="min-h-screen flex flex-col">
            <NavigationMenu />
            <main class名称="flex-grow flex justify-center p-4 bg-backgroundSecondary relative">
                <div class名称="w-full max-w-6xl rounded-lg p-6">
                    <div class名称="container mx-auto">
                        <div class名称="mb-16">
                            <h1 class名称="text-3xl font-semibold">设置</h1>
                        </div>
                        <div class名称="flex flex-row gap-10">
                            <aside class名称="lg:w-48">
                                <SidebarNav items={sidebarNavItems} />
                            </aside>
                            <div class名称="w-full rounded-lg">{children}</div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export const getSidebarNavItems = async () =>
    withAuth(async ({ role }) => {
        let numJoinRequests: number | undefined;
        if (role === OrgRole.OWNER) {
            const requests = await getOrgAccountRequests();
            if (isServiceError(requests)) {
                throw new ServiceErrorException(requests);
            }
            numJoinRequests = requests.length;
        }

        const connectionStats = await getConnectionStats();
        if (isServiceError(connectionStats)) {
            throw new ServiceErrorException(connectionStats);
        }

        return [
            ...(role === OrgRole.OWNER ? [
                {
                    title: "Access",
                    href: `/settings/access`,
                }
            ] : []),
            ...(role === OrgRole.OWNER ? [{
                title: "Members",
                isNotificationDotVisible: numJoinRequests !== undefined && numJoinRequests > 0,
                href: `/settings/members`,
            }] : []),
            ...(role === OrgRole.OWNER ? [
                {
                    title: "Connections",
                    href: `/settings/connections`,
                    hrefRegex: `/settings/connections(/[^/]+)?$`,
                    isNotificationDotVisible: connectionStats.numberOfConnectionsWithFirstTime同步JobsInProgress > 0,
                }
            ] : []),
            ...(env.DISABLE_API_KEY_USAGE_FOR_NON_OWNER_USERS === 'false' || role === OrgRole.OWNER ? [
                {
                    title: "API Keys",
                    href: `/settings/apiKeys`,
                }
            ] : []),
            ...(role === OrgRole.OWNER ? [
                {
                    title: "Analytics",
                    href: `/settings/analytics`,
                },
            ] : []),
            ...(hasEntitlement("sso") ? [
                {
                    title: "Linked Accounts",
                    href: `/settings/linked-accounts`,
                }
            ] : []),
            ...(role === OrgRole.OWNER ? [
                {
                    title: "License",
                    href: `/settings/license`,
                }
            ] : []),
        ]
    });