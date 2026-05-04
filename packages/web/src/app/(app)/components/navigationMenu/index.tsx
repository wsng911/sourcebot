import { getConnectionStats, getCurrentUserRole, getOrgAccountRequests, getRepos, getReposStats } from "@/actions";
import { SourcebotLogo } from "@/app/components/sourcebotLogo";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { NavigationMenu as NavigationMenuBase } from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { ServiceErrorException } from "@/lib/serviceError";
import { isServiceError } from "@/lib/utils";
import { OrgRole, RepoIndexingJob状态, RepoIndexingJobType } from "@sourcebot/db";
import { env } from "@sourcebot/shared";
import Link from "next/link";
import { MeControlDropdownMenu } from "../meControlDropdownMenu";
import WhatsNewIndicator from "../whatsNewIndicator";
import { NavigationItems } from "./navigationItems";
import { ProgressIndicator } from "./progressIndicator";
import { redirect } from "next/navigation";
import { AppearanceDropdownMenu } from "../appearanceDropdownMenu";


export const NavigationMenu = async () => {
    const session = await auth();
    const isAuthenticated = session?.user !== undefined;

    const repoStats = await getReposStats();
    if (isServiceError(repoStats)) {
        throw new ServiceErrorException(repoStats);
    }

    const role = isAuthenticated ? await getCurrentUserRole() : null;
    if (isServiceError(role)) {
        throw new ServiceErrorException(role);
    }

    const stats = await (async () => {
        if (!isAuthenticated || role !== OrgRole.OWNER) {
            return null;
        }

        const joinRequests = await getOrgAccountRequests();
        if (isServiceError(joinRequests)) {
            throw new ServiceErrorException(joinRequests);
        }

        const connectionStats = await getConnectionStats();
        if (isServiceError(connectionStats)) {
            throw new ServiceErrorException(connectionStats);
        }

        return {
            numJoinRequests: joinRequests.length,
            connectionStats,
        };
    })();

    const sampleRepos = await getRepos({
        where: {
            jobs: {
                some: {
                    type: RepoIndexingJobType.INDEX,
                    status: {
                        in: [
                            RepoIndexingJob状态.PENDING,
                            RepoIndexingJob状态.IN_PROGRESS,
                        ]
                    }
                },
            },
            indexedAt: null,
        },
        take: 5,
    });

    if (isServiceError(sampleRepos)) {
        throw new ServiceErrorException(sampleRepos);
    }

    const {
        numberOfRepos,
        numberOfReposWithFirstTimeIndexingJobsInProgress,
    } = repoStats;

    return (
        <div class名称="flex flex-col w-full h-fit bg-background">
            <div class名称="flex flex-row justify-between items-center py-0.5 px-3">
                <div class名称="flex flex-row items-center">
                    <Link
                        href="/"
                        class名称="mr-3 cursor-pointer"
                    >
                        <SourcebotLogo
                            class名称="h-11"
                            size="small"
                        />
                    </Link>

                    <NavigationMenuBase>
                        <NavigationItems
                            numberOfRepos={numberOfRepos}
                            isReposButtonNotificationDotVisible={numberOfReposWithFirstTimeIndexingJobsInProgress > 0}
                            is设置ButtonNotificationDotVisible={
                                stats ? (
                                    stats.connectionStats.numberOfConnectionsWithFirstTime同步JobsInProgress > 0 ||
                                    stats.numJoinRequests > 0
                                ) : false
                            }
                            isAuthenticated={isAuthenticated}
                            isAgentsVisible={isAuthenticated && (
                                !!(env.GITHUB_REVIEW_AGENT_APP_ID && env.GITHUB_REVIEW_AGENT_APP_WEBHOOK_SECRET && env.GITHUB_REVIEW_AGENT_APP_PRIVATE_KEY_PATH) ||
                                !!(env.GITLAB_REVIEW_AGENT_WEBHOOK_SECRET && env.GITLAB_REVIEW_AGENT_TOKEN)
                            )}
                        />
                    </NavigationMenuBase>
                </div>

                <div class名称="flex flex-row items-center gap-2">
                    <ProgressIndicator
                        numberOfReposWithFirstTimeIndexingJobsInProgress={numberOfReposWithFirstTimeIndexingJobsInProgress}
                        sampleRepos={sampleRepos}
                    />
                    <WhatsNewIndicator />
                    {session ? (
                        <MeControlDropdownMenu
                            session={session}
                        />
                    ) : (
                        <>
                            <form
                                action={async () => {
                                    "use server";
                                    redirect("/login");
                                }}
                            >
                                <Button
                                    variant="outline"
                                    type="submit"
                                >
                                    登录
                                </Button>
                            </form>
                            <AppearanceDropdownMenu />
                        </>
                    )}
                </div>
            </div>
            <Separator />
        </div>
    )
}