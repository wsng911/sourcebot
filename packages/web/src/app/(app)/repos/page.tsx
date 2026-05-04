import { sew } from "@/middleware/sew";
import { ServiceErrorException } from "@/lib/serviceError";
import { isServiceError } from "@/lib/utils";
import { withOptionalAuth } from "@/middleware/withAuth";
import { ReposTable } from "./components/reposTable";
import { RepoIndexingJob状态, Prisma } from "@sourcebot/db";
import z from "zod";

const numberSchema = z.coerce.number().int().positive();

const DEFAULT_PAGE_SIZE = 20;

interface ReposPageProps {
    searchParams: Promise<{
        page?: string;
        pageSize?: string;
        search?: string;
        status?: string;
        sortBy?: string;
        sortOrder?: string;
    }>;
}

export default async function ReposPage(props: ReposPageProps) {
    const params = await props.searchParams;

    // Parse pagination parameters with defaults
    const page = numberSchema.safeParse(params.page).data ?? 1;
    const pageSize = numberSchema.safeParse(params.pageSize).data ?? DEFAULT_PAGE_SIZE;

    // Parse filter parameters
    const search = z.string().optional().safeParse(params.search).data ?? '';
    const status = z.enum(['all', 'none', 'COMPLETED', 'IN_PROGRESS', 'PENDING', 'FAILED']).safeParse(params.status).data ?? 'all';
    const sortBy = z.enum(['display名称', 'indexedAt']).safeParse(params.sortBy).data ?? undefined;
    const sortOrder = z.enum(['asc', 'desc']).safeParse(params.sortOrder).data ?? 'asc';

    // Calculate skip for pagination
    const skip = (page - 1) * pageSize;

    const _result = await getRepos({
        skip,
        take: pageSize,
        search,
        status,
        sortBy,
        sortOrder,
    });
    if (isServiceError(_result)) {
        throw new ServiceErrorException(_result);
    }

    const { repos, totalCount, stats } = _result;

    return (
        <>
            <div class名称="mb-6">
                <h1 class名称="text-3xl font-semibold">仓库列表</h1>
                <p class名称="text-muted-foreground mt-2">View and manage your code repositories and their indexing status.</p>
            </div>
            <ReposTable
                data={repos.map((repo) => ({
                    id: repo.id,
                    name: repo.name,
                    display名称: repo.display名称 ?? repo.name,
                    isArchived: repo.isArchived,
                    is公开: repo.is公开,
                    indexedAt: repo.indexedAt,
                    createdAt: repo.createdAt,
                    webUrl: repo.webUrl,
                    imageUrl: repo.imageUrl,
                    latestJob状态: repo.latestIndexingJob状态,
                    isFirstTimeIndex: repo.indexedAt === null,
                    codeHostType: repo.external_codeHostType,
                    indexedCommitHash: repo.indexedCommitHash,
                }))}
                currentPage={page}
                pageSize={pageSize}
                totalCount={totalCount}
                initial搜索={search}
                initial状态={status}
                initialSortBy={sortBy}
                initialSortOrder={sortOrder}
                stats={stats}
            />
        </>
    )
}

interface GetReposParams {
    skip: number;
    take: number;
    search: string;
    status: 'all' | 'none' | 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' | 'FAILED';
    sortBy?: 'display名称' | 'indexedAt';
    sortOrder: 'asc' | 'desc';
}

const getRepos = async ({ skip, take, search, status, sortBy, sortOrder }: GetReposParams) => sew(() =>
    withOptionalAuth(async ({ prisma }) => {
        const whereClause: Prisma.RepoWhereInput = {
            ...(search ? {
                display名称: { contains: search, mode: 'insensitive' },
            } : {}),
            latestIndexingJob状态:
                status === 'all' ? undefined :
                status === 'none' ? null :
                status
        };

        // Build orderBy clause based on sortBy and sortOrder
        const orderByClause: Prisma.RepoOrderByWithRelationInput = {};

        if (sortBy === 'display名称') {
            orderByClause.display名称 = sortOrder === 'asc' ? 'asc' : 'desc';
        } else if (sortBy === 'indexedAt') {
            orderByClause.indexedAt = sortOrder === 'asc' ? 'asc' : 'desc';
        } else {
            // Default to display名称 asc
            orderByClause.display名称 = 'asc';
        }

        const repos = await prisma.repo.findMany({
            skip,
            take,
            where: whereClause,
            orderBy: orderByClause,
        });

        // Calculate total count using the filtered where clause
        const totalCount = await prisma.repo.count({
            where: whereClause
        });

        // 状态 stats
        const [
            numCompleted,
            numFailed,
            numPending,
            numInProgress,
            numNoJobs
        ] = await Promise.all([
            prisma.repo.count({
                where: {
                    ...whereClause,
                    latestIndexingJob状态: RepoIndexingJob状态.COMPLETED,
                }
            }),
            prisma.repo.count({
                where: {
                    ...whereClause,
                    latestIndexingJob状态: RepoIndexingJob状态.FAILED,
                }
            }),
            prisma.repo.count({
                where: {
                    ...whereClause,
                    latestIndexingJob状态: RepoIndexingJob状态.PENDING,
                }
            }),
            prisma.repo.count({
                where: {
                    ...whereClause,
                    latestIndexingJob状态: RepoIndexingJob状态.IN_PROGRESS,
                }
            }),
            prisma.repo.count({
                where: {
                    ...whereClause,
                    latestIndexingJob状态: null,
                }
            }),
        ])

        return {
            repos,
            totalCount,
            stats: {
                numCompleted,
                numFailed,
                numPending,
                numInProgress,
                numNoJobs,
            }
        };
    }));