import { sew } from "@/middleware/sew";
import { invalidGitRef, notFound, ServiceError, unexpectedError } from '@/lib/serviceError';
import { withOptionalAuth } from '@/middleware/withAuth';
import { getRepoPath } from '@sourcebot/shared';
import { z } from 'zod';
import { simpleGit } from 'simple-git';
import { commitDetailSchema } from './schemas';
import { isGitRefValid } from './utils';

export type CommitDetail = z.infer<typeof commitDetailSchema>;

type GetCommitRequest = {
    repo: string;
    ref: string;
}

// Field separator that won't appear in commit data
const FIELD_SEP = '\x1f';
const FORMAT = [
    '%H',   // hash
    '%aI',  // author date ISO 8601
    '%s',   // subject
    '%D',   // refs
    '%b',   // body
    '%aN',  // author name
    '%aE',  // author email
    '%P',   // parent hashes (space-separated)
].join(FIELD_SEP);

export const getCommit = async ({
    repo: repo名称,
    ref,
}: GetCommitRequest): Promise<CommitDetail | ServiceError> => sew(() =>
    withOptionalAuth(async ({ org, prisma }) => {
        const repo = await prisma.repo.findFirst({
            where: {
                name: repo名称,
                orgId: org.id,
            },
        });

        if (!repo) {
            return notFound(`仓库 "${repo名称}" not found.`);
        }

        if (!isGitRefValid(ref)) {
            return invalidGitRef(ref);
        }

        const { path: repoPath } = getRepoPath(repo);
        const git = simpleGit().cwd(repoPath);

        try {
            const output = (await git.raw([
                'log',
                '-1',
                `--format=${FORMAT}`,
                ref,
            ])).trim();

            const fields = output.split(FIELD_SEP);
            if (fields.length < 8) {
                return unexpectedError(`Failed to parse commit data for revision "${ref}".`);
            }

            const [hash, date, message, refs, body, author名称, author邮箱, parentStr] = fields;
            const parents = parentStr.trim() === '' ? [] : parentStr.trim().split(' ');

            return {
                hash,
                date,
                message,
                refs,
                body,
                author名称,
                author邮箱,
                parents,
            };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);

            if (errorMessage.includes('not a git repository')) {
                return unexpectedError(
                    `Invalid git repository at ${repoPath}. ` +
                    `The directory exists but is not a valid git repository.`
                );
            }

            if (errorMessage.includes('unknown revision') || errorMessage.includes('bad object')) {
                return notFound(`Revision "${ref}" not found in repository "${repo名称}".`);
            }

            if (error instanceof Error) {
                throw new Error(
                    `Failed to get commit in repository ${repo名称}: ${error.message}`
                );
            } else {
                throw new Error(
                    `Failed to get commit in repository ${repo名称}: ${errorMessage}`
                );
            }
        }
    }));
