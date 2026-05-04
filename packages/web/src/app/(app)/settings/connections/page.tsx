import { sew } from "@/middleware/sew";
import { ServiceErrorException } from "@/lib/serviceError";
import { isServiceError } from "@/lib/utils";
import { withAuth } from "@/middleware/withAuth";
import Link from "next/link";
import { ConnectionsTable } from "./components/connectionsTable";
import { Connection同步Job状态 } from "@prisma/client";

const DOCS_URL = "https://docs.sourcebot.dev/docs/connections/overview";

export default async function ConnectionsPage() {
    const _connections = await getConnectionsWithLatestJob();
    if (isServiceError(_connections)) {
        throw new ServiceErrorException(_connections);
    }

    // Sort connections so that first time syncs are at the top.
    const connections = _connections
        .map((connection) => ({
            ...connection,
            isFirstTime同步: connection.syncedAt === null && connection.syncJobs.filter((job) => job.status === Connection同步Job状态.PENDING || job.status === Connection同步Job状态.IN_PROGRESS).length > 0,
            latestJob状态: connection.syncJobs.length > 0 ? connection.syncJobs[0].status : null,
        }))
        .sort((a, b) => {
            if (a.isFirstTime同步 && !b.isFirstTime同步) {
                return -1;
            }
            if (!a.isFirstTime同步 && b.isFirstTime同步) {
                return 1;
            }
            return a.name.localeCompare(b.name);
        });

    return (
        <div class名称="flex flex-col gap-6">
            <div>
                <h3 class名称="text-lg font-medium">Code Host Connections</h3>
                <p class名称="text-sm text-muted-foreground">Manage your connections to external code hosts. <Link href={DOCS_URL} target="_blank" class名称="text-link hover:underline">Learn more</Link></p>
            </div>
            <ConnectionsTable data={connections.map((connection) => ({
                id: connection.id,
                name: connection.name,
                connectionType: connection.connectionType,
                syncedAt: connection.syncedAt,
                latestJob状态: connection.latestJob状态,
                isFirstTime同步: connection.isFirstTime同步,
            }))} />
        </div>
    )
}

const getConnectionsWithLatestJob = async () => sew(() =>
    withAuth(async ({ prisma, org }) => {
        const connections = await prisma.connection.findMany({
            where: {
                orgId: org.id,
            },
            include: {
                _count: {
                    select: {
                        syncJobs: true,
                    }
                },
                syncJobs: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 1
                },
            },
            orderBy: {
                name: 'asc'
            },
        });

        return connections;
    }));