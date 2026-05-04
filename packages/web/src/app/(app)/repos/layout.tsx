import { InfoIcon } from "lucide-react";
import { NavigationMenu } from "../components/navigationMenu";
import Link from "next/link";
import { getCurrentUserRole, getReposStats } from "@/actions";
import { isServiceError } from "@/lib/utils";
import { ServiceErrorException } from "@/lib/serviceError";
import { OrgRole } from "@sourcebot/db";

interface LayoutProps {
    children: React.ReactNode;
}

export default async function Layout(
    props: LayoutProps
) {
    const { children } = props;

    const repoStats = await getReposStats();
    if (isServiceError(repoStats)) {
        throw new ServiceErrorException(repoStats);
    }

    const userRoleInOrg = await getCurrentUserRole();

    return (
        <div class名称="min-h-screen flex flex-col">
            <NavigationMenu />
            {(repoStats.numberOfRepos === 0 && userRoleInOrg === OrgRole.OWNER) && (
                <div class名称="w-full flex flex-row justify-center items-center bg-accent py-0.5">
                    <InfoIcon class名称="w-4 h-4 mr-1" />
                    <span><span class名称="font-medium">No repositories configured.</span> 创建 a <Link href="/settings/connections" class名称="text-link hover:underline">connection</Link> to get started.</span>
                </div>
            )}
            <main class名称="flex-grow flex justify-center p-4 bg-backgroundSecondary relative">
                <div class名称="w-full max-w-6xl rounded-lg p-6">
                    <div class名称="container mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}