import { getCurrentUserRole } from "@/actions"
import { sew } from "@/middleware/sew"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, Card描述, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { env } from "@sourcebot/shared"
import { ServiceErrorException } from "@/lib/serviceError"
import { cn, getCodeHostInfoForRepo, isServiceError } from "@/lib/utils"
import { withOptionalAuth } from "@/middleware/withAuth"
import { getConfig设置, repoMetadataSchema } from "@sourcebot/shared"
import { ExternalLink, Info } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { 返回Button } from "../../components/backButton"
import { DisplayDate } from "../../components/DisplayDate"
import { RepoBranchesTable } from "../components/repoBranchesTable"
import { RepoJobsTable } from "../components/repoJobsTable"
import { OrgRole } from "@sourcebot/db"

export default async function RepoDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const repo = await getRepoWithJobs(Number.parseInt(id))
    if (isServiceError(repo)) {
        throw new ServiceErrorException(repo);
    }

    const codeHostInfo = getCodeHostInfoForRepo({
        codeHostType: repo.external_codeHostType,
        name: repo.name,
        display名称: repo.display名称 ?? undefined,
        externalWebUrl: repo.webUrl ?? undefined,
    });

    const config设置 = await getConfig设置(env.CONFIG_PATH);

    const nextIndexAttempt = (() => {
        const latestJob = repo.jobs.length > 0 ? repo.jobs[0] : null;
        if (!latestJob) {
            return undefined;
        }

        if (latestJob.completedAt) {
            return new Date(latestJob.completedAt.getTime() + config设置.reindexIntervalMs);
        }

        return undefined;
    })();

    const repoMetadata = repoMetadataSchema.parse(repo.metadata);

    const userRole = await getCurrentUserRole();
    if (isServiceError(userRole)) {
        throw new ServiceErrorException(userRole);
    }

    return (
        <>
            <div class名称="mb-6">
                <返回Button
                    href={`/repos`}
                    name="返回 to repositories"
                    class名称="mb-2"
                />

                <div class名称="flex items-start justify-between">
                    <div>
                        <h1 class名称="text-3xl font-semibold">{repo.display名称 || repo.name}</h1>
                    </div>
                    {codeHostInfo.externalWebUrl && (
                        <Button variant="outline" asChild>
                            <Link href={codeHostInfo.externalWebUrl} target="_blank" rel="noopener noreferrer" class名称="flex items-center">
                                <Image
                                    src={codeHostInfo.icon}
                                    alt={codeHostInfo.codeHost名称}
                                    class名称={cn("w-4 h-4 flex-shrink-0", codeHostInfo.iconClass名称)}
                                />
                                Open in {codeHostInfo.codeHost名称}
                                <ExternalLink class名称="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    )}
                </div>

                <div class名称="flex gap-2 mt-4">
                    {repo.isArchived && <Badge variant="secondary">Archived</Badge>}
                    {repo.is公开 && <Badge variant="outline">公开</Badge>}
                </div>
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
                                    <p>When this repository was first added to Sourcebot</p>
                                </TooltipContent>
                            </Tooltip>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <span class名称="text-2xl font-semibold"><DisplayDate date={repo.createdAt} /></span>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader class名称="pb-3">
                        <CardTitle class名称="text-sm font-medium flex items-center gap-1.5">
                            Last indexed
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Info class名称="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>The last time this repository was successfully indexed</p>
                                </TooltipContent>
                            </Tooltip>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <span class名称="text-2xl font-semibold">{repo.indexedAt ? <DisplayDate date={repo.indexedAt} /> : "Never"}</span>
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
                                    <p>When the next indexing job is scheduled to run</p>
                                </TooltipContent>
                            </Tooltip>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <span class名称="text-2xl font-semibold">{nextIndexAttempt ? <DisplayDate date={nextIndexAttempt} /> : "-"}</span>
                    </CardContent>
                </Card>
            </div>

            {repoMetadata.indexedRevisions && (
                <Card class名称="mb-8">
                    <CardHeader>
                        <div class名称="flex items-center gap-2">
                            <CardTitle>Indexed Branches</CardTitle>
                        </div>
                        <Card描述>Branches that have been indexed for this repository. <Link href="https://docs.sourcebot.dev/docs/features/search/multi-branch-indexing" target="_blank" class名称="text-link hover:underline">Docs</Link></Card描述>
                    </CardHeader>
                    <CardContent>
                        <Suspense fallback={<Skeleton class名称="h-64 w-full" />}>
                            <RepoBranchesTable
                                indexRevisions={repoMetadata.indexedRevisions}
                                repoWebUrl={repo.webUrl}
                                repoCodeHostType={repo.external_codeHostType}
                            />
                        </Suspense>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Indexing History</CardTitle>
                    <Card描述>History of all indexing and cleanup jobs for this repository.</Card描述>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<Skeleton class名称="h-96 w-full" />}>
                        <RepoJobsTable
                            data={repo.jobs}
                            repoId={repo.id}
                            isIndexButtonVisible={userRole === OrgRole.OWNER}
                        />
                    </Suspense>
                </CardContent>
            </Card>
        </>
    )
}

const getRepoWithJobs = async (repoId: number) => sew(() =>
    withOptionalAuth(async ({ prisma, org }) => {

        const repo = await prisma.repo.findUnique({
            where: {
                id: repoId,
                orgId: org.id,
            },
            include: {
                jobs: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                }
            },
        });

        if (!repo) {
            return notFound();
        }

        return repo;
    })
);