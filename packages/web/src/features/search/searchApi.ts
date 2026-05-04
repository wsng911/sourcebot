import { sew } from "@/middleware/sew";
import { getAuditService } from "@/ee/features/audit/factory";
import { getRepoPermissionFilterForUser } from "@/prisma";
import { withOptionalAuth } from "@/middleware/withAuth";
import { PrismaClient, UserWithAccounts } from "@sourcebot/db";
import { env, hasEntitlement } from "@sourcebot/shared";
import { headers } from "next/headers";
import { QueryIR } from './ir';
import { parseQuerySyntaxIntoIR } from './parser';
import { 搜索Options } from "./types";
import { createZoekt搜索Request, zoekt搜索, zoektStream搜索 } from './zoekt搜索er';


type QueryString搜索Request = {
    queryType: 'string';
    query: string;
    options: 搜索Options;
    source?: string;
}

type QueryIR搜索Request = {
    queryType: 'ir';
    query: QueryIR;
    // Omit options that are specific to query syntax parsing.
    options: Omit<搜索Options, 'isRegexEnabled' | 'isCaseSensitivityEnabled'>;
    source?: string;
}

type 搜索Request = QueryString搜索Request | QueryIR搜索Request;

export const search = (request: 搜索Request) => sew(() =>
    withOptionalAuth(async ({ prisma, user, org }) => {
        if (user) {
            const source = request.source ?? (await headers()).get('X-Sourcebot-Client-Source') ?? undefined;
            getAuditService().createAudit({
                action: 'user.performed_code_search',
                actor: { id: user.id, type: 'user' },
                target: { id: org.id.toString(), type: 'org' },
                orgId: org.id,
                metadata: { source },
            });
        }

        const repo搜索Scope = await getAccessibleRepo名称sForUser({ user, prisma });

        // If needed, parse the query syntax into the query intermediate representation.
        const query = request.queryType === 'string' ? await parseQuerySyntaxIntoIR({
            query: request.query,
            options: request.options,
            prisma,
        }) : request.query;

        const zoekt搜索Request = await createZoekt搜索Request({
            query,
            options: request.options,
            repo搜索Scope,
        });

        return zoekt搜索(zoekt搜索Request, prisma);
    }));

export const stream搜索 = (request: 搜索Request) => sew(() =>
    withOptionalAuth(async ({ prisma, user, org }) => {
        if (user) {
            const source = request.source ?? (await headers()).get('X-Sourcebot-Client-Source') ?? undefined;
            getAuditService().createAudit({
                action: 'user.performed_code_search',
                actor: { id: user.id, type: 'user' },
                target: { id: org.id.toString(), type: 'org' },
                orgId: org.id,
                metadata: { source },
            });
        }

        const repo搜索Scope = await getAccessibleRepo名称sForUser({ user, prisma });

        // If needed, parse the query syntax into the query intermediate representation.
        const query = request.queryType === 'string' ? await parseQuerySyntaxIntoIR({
            query: request.query,
            options: request.options,
            prisma,
        }) : request.query;

        const zoekt搜索Request = await createZoekt搜索Request({
            query,
            options: request.options,
            repo搜索Scope,
        });

        return zoektStream搜索(zoekt搜索Request, prisma);
    }));

/**
 * Returns a list of repository names that the user has access to.
 * If permission syncing is disabled, returns undefined.
 */
const getAccessibleRepo名称sForUser = async ({ user, prisma }: { user?: UserWithAccounts, prisma: PrismaClient }) => {
    if (
        env.PERMISSION_SYNC_ENABLED !== 'true' ||
        !hasEntitlement('permission-syncing')
    ) {
        return undefined;
    }

    const accessibleRepos = await prisma.repo.findMany({
        where: getRepoPermissionFilterForUser(user),
        select: {
            name: true,
        }
    });
    return accessibleRepos.map(repo => repo.name);
}
