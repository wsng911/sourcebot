import { sew } from "@/middleware/sew";
import { 返回Button } from "@/app/(app)/components/backButton";
import { DisplayDate } from "@/app/(app)/components/DisplayDate";
import { Card, CardContent, Card描述, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { notFound as notFoundServiceError, ServiceErrorException } from "@/lib/serviceError";
import { notFound } from "next/navigation";
import { isServiceError } from "@/lib/utils";
import { withAuth } from "@/middleware/withAuth";
import { AzureDevOpsConnectionConfig, BitbucketConnectionConfig, GenericGitHostConnectionConfig, GerritConnectionConfig, GiteaConnectionConfig, GithubConnectionConfig, GitlabConnectionConfig } from "@sourcebot/schemas/v3/index.type";
import { env, getConfig设置 } from "@sourcebot/shared";
import { Info } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { ConnectionJobsTable } from "../components/connectionJobsTable";

interface ConnectionDetailPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function ConnectionDetailPage(props: ConnectionDetailPageProps) {
    const params = await props.params;
    const { id } = params;

    const connectionId = Number.parseInt(id);
    if (isNaN(connectionId)) {
        return notFound();
    }

    const connection = await getConnectionWithJobs(connectionId);
    if (isServiceError(connection)) {
        throw new ServiceErrorException(connection);
    }

    const config设置 = await getConfig设置(env.CONFIG_PATH);

    const next同步Attempt = (() => {
        const latestJob = connection.syncJobs.length > 0 ? connection.syncJobs[0] : null;
        if (!latestJob) {
            return undefined;
        }

        if (latestJob.completedAt) {
            return new Date(latestJob.completedAt.getTime() + config设置.resyncConnectionIntervalMs);
        }

        return undefined;
    })();

    // Extracts the code host URL from the connection config.
    const codeHostUrl: string = (() => {
        const connectionType = connection.connectionType;
        switch (connectionType) {
            case 'github': {
                const config = connection.config as unknown as GithubConnectionConfig;
                return config.url ?? 'https://github.com';
            }
            case 'gitlab': {
                const config = connection.config as unknown as GitlabConnectionConfig;
                return config.url ?? 'https://gitlab.com';
            }
            case 'gitea': {
                const config = connection.config as unknown as GiteaConnectionConfig;
                return config.url ?? 'https://gitea.com';
            }
            case 'gerrit': {
                const config = connection.config as unknown as GerritConnectionConfig;
                return config.url;
            }
            case 'bitbucket': {
                const config = connection.config as unknown as BitbucketConnectionConfig;
                if (config.deploymentType === 'cloud') {
                    return config.url ?? 'https://bitbucket.org';
                } else {
                    return config.url!;
                }
            }
            case 'azuredevops': {
                const config = connection.config as unknown as AzureDevOpsConnectionConfig;
                return config.url ?? 'https://dev.azure.com';
            }
            case 'git': {
                const config = connection.config as unknown as GenericGitHostConnectionConfig;
                return config.url;
            }
        }
    })();

    return (
        <div>
            <返回Button
                href={`/settings/connections`}
                name="返回 to connections"
                class名称="mb-2"
            />
            <div class名称="flex flex-col gap-2 mb-6">
                <h1 class名称="text-3xl font-semibold">{connection.name}</h1>

                <Link
                    href={codeHostUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    class名称="hover:underline text-muted-foreground"
                >
                    {codeHostUrl}
                </Link>
            </div>

            <div class名称="grid gap-4 md:grid-cols-3 mb-8">
                <Card>
                    <CardHeader class名称="pb-3">
                        <CardTitle class名称="text-sm font-medium flex items-center gap-1.5">
                            创建d
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Info class名称="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>When this connection was first added to Sourcebot</p>
                                </TooltipContent>
                            </Tooltip>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <span class名称="text-2xl font-semibold"><DisplayDate date={connection.createdAt} /></span>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader class名称="pb-3">
                        <CardTitle class名称="text-sm font-medium flex items-center gap-1.5">
                            Last synced
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Info class名称="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>The last time this connection was successfully synced</p>
                                </TooltipContent>
                            </Tooltip>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <span class名称="text-2xl font-semibold">{connection.syncedAt ? <DisplayDate date={connection.syncedAt} /> : "Never"}</span>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader class名称="pb-3">
                        <CardTitle class名称="text-sm font-medium flex items-center gap-1.5">
                            Scheduled
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Info class名称="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>When the connection will be resynced next. Modifying the config will also trigger a resync.</p>
                                </TooltipContent>
                            </Tooltip>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <span class名称="text-2xl font-semibold">{next同步Attempt ? <DisplayDate date={next同步Attempt} /> : "-"}</span>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>同步 History</CardTitle>
                    <Card描述>History of all sync jobs for this connection.</Card描述>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<Skeleton class名称="h-96 w-full" />}>
                        <ConnectionJobsTable
                            data={connection.syncJobs}
                            connectionId={connectionId}
                        />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    )
}

const getConnectionWithJobs = async (id: number) => sew(() =>
    withAuth(async ({ prisma, org }) => {
        const connection = await prisma.connection.findUnique({
            where: {
                id,
                orgId: org.id,
            },
            include: {
                syncJobs: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        });

        if (!connection) {
            return notFoundServiceError();
        }

        return connection;
    })
)