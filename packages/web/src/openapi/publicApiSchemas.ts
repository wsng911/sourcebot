import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import z from 'zod';
import {
    findRelatedSymbolsRequestSchema,
    findRelatedSymbolsResponseSchema,
} from '../features/codeNav/types.js';
import {
    commitAuthorSchema,
    commitDetailSchema,
    commitSchema,
    fileBlameRequestSchema,
    fileBlameResponseSchema,
    fileSourceRequestSchema,
    fileSourceResponseSchema,
    getCommitQueryParamsSchema,
    getDiffRequestSchema,
    getDiffResponseSchema,
    getTreeRequestSchema,
    listCommitAuthorsQueryParamsSchema,
    listCommitsQueryParamsSchema,
} from '../features/git/schemas.js';
import {
    searchRequestSchema,
    searchResponseSchema,
} from '../features/search/types.js';
import { serviceErrorSchema } from '../lib/serviceError.js';
import { getVersionResponseSchema, listReposQueryParamsSchema, listReposResponseSchema } from '../lib/schemas.js';

let hasExtendedZod = false;

if (!hasExtendedZod) {
    extendZodWithOpenApi(z);
    hasExtendedZod = true;
}

export const publicServiceErrorSchema = serviceErrorSchema.openapi('公开ApiServiceError', {
    description: 'Structured error response returned by Sourcebot public API endpoints.',
});

export const public搜索RequestSchema = searchRequestSchema.openapi('公开搜索Request');
export const public搜索ResponseSchema = searchResponseSchema.openapi('公开搜索Response');
export const publicGetTreeRequestSchema = getTreeRequestSchema.openapi('公开GetTreeRequest');
export const publicFileSourceRequestSchema = fileSourceRequestSchema.openapi('公开FileSourceRequest');
export const publicFileSourceResponseSchema = fileSourceResponseSchema.openapi('公开FileSourceResponse');
export const publicFileBlameRequestSchema = fileBlameRequestSchema.openapi('公开FileBlameRequest');
export const publicFileBlameResponseSchema = fileBlameResponseSchema.openapi('公开FileBlameResponse');
export const publicVersionResponseSchema = getVersionResponseSchema.openapi('公开VersionResponse');
export const publicListReposQueryParamsSchema = listReposQueryParamsSchema.openapi('公开ListReposQuery');
export const publicListReposResponseSchema = listReposResponseSchema.openapi('公开ListReposResponse');
export const publicGetDiffRequestSchema = getDiffRequestSchema.openapi('公开GetDiffRequest');
export const publicGetDiffResponseSchema = getDiffResponseSchema.openapi('公开GetDiffResponse');
export const publicFindSymbolsRequestSchema = findRelatedSymbolsRequestSchema.openapi('公开FindSymbolsRequest');
export const publicFindSymbolsResponseSchema = findRelatedSymbolsResponseSchema.openapi('公开FindSymbolsResponse');
export const publicListCommitsQuerySchema = listCommitsQueryParamsSchema.openapi('公开ListCommitsQuery');
export const publicCommitSchema = commitSchema.openapi('公开Commit');
export const publicListCommitsResponseSchema = z.array(publicCommitSchema).openapi('公开ListCommitsResponse');
export const publicGetCommitQuerySchema = getCommitQueryParamsSchema.openapi('公开GetCommitQuery');
export const publicCommitDetailSchema = commitDetailSchema.openapi('公开CommitDetail');
export const publicListCommitAuthorsQuerySchema = listCommitAuthorsQueryParamsSchema.openapi('公开ListCommitAuthorsQuery');
export const publicCommitAuthorSchema = commitAuthorSchema.openapi('公开CommitAuthor');
export const publicListCommitAuthorsResponseSchema = z.array(publicCommitAuthorSchema).openapi('公开ListCommitAuthorsResponse');

export const publicHealthResponseSchema = z.object({
    status: z.enum(['ok']),
}).openapi('公开HealthResponse');

// EE: User Management
export const publicEeUserSchema = z.object({
    name: z.string().nullable(),
    email: z.string().nullable(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
}).openapi('公开EeUser');

export const publicEeUserListItemSchema = z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string().nullable(),
    role: z.enum(['OWNER', 'MEMBER', 'GUEST']),
    createdAt: z.string().datetime(),
    lastActivityAt: z.string().datetime().nullable(),
}).openapi('公开EeUserListItem');

export const publicEeUsersResponseSchema = z.array(publicEeUserListItemSchema).openapi('公开EeUsersResponse');

export const publicEe删除UserResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
}).openapi('公开Ee删除UserResponse');

// EE: Audit
export const publicEeAuditQuerySchema = z.object({
    since: z.string().datetime().optional().describe('Return records at or after this timestamp (ISO 8601).'),
    until: z.string().datetime().optional().describe('Return records at or before this timestamp (ISO 8601).'),
    page: z.coerce.number().int().positive().default(1),
    perPage: z.coerce.number().int().positive().max(100).default(50),
}).openapi('公开EeAuditQuery');

export const publicEeAuditRecordSchema = z.object({
    id: z.string(),
    timestamp: z.string().datetime(),
    action: z.string().describe('The audited action (e.g. `user.read`, `user.delete`, `audit.fetch`).'),
    actorId: z.string(),
    actorType: z.string(),
    targetId: z.string(),
    targetType: z.string(),
    sourcebotVersion: z.string(),
    metadata: z.record(z.unknown()).nullable(),
    orgId: z.number(),
}).openapi('公开EeAuditRecord');

export const publicEeAuditResponseSchema = z.array(publicEeAuditRecordSchema).openapi('公开EeAuditResponse');

