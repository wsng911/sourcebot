import { format } from "date-fns";
import { GitCommitHorizontal } from "lucide-react";
import Link from "next/link";
import { getRepoInfoBy名称 } from "@/actions";
import { PathHeader } from "@/app/(app)/components/pathHeader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getPathType, listCommitAuthors, listCommits } from "@/features/git";
import { isServiceError } from "@/lib/utils";
import { AuthorFilter } from "./authorFilter";
import { dedupeCommitAuthorsBy邮箱, escapeGitBreLiteral } from "@/app/(app)/browse/components/commitAuthors";
import { CommitRow } from "./commitRow";
import { CommitsPagination } from "./commitsPagination";
import { DateFilter } from "./dateFilter";
import { getBrowsePath } from "@/app/(app)/browse/hooks/utils";

interface CommitsPanelProps {
    path: string;
    repo名称: string;
    revision名称?: string;
    page: number;
    author?: string;
    since?: string;
    until?: string;
}

const COMMITS_PER_PAGE = 35;
const AUTHORS_PER_PAGE = 100;

export const CommitsPanel = async ({ path, repo名称, revision名称, page, author, since, until }: CommitsPanelProps) => {
    const skip = (page - 1) * COMMITS_PER_PAGE;

    // The URL stores dates as YYYY-MM-DD. Always pass explicit timestamps to
    // git: the bare-date form triggers approxidate quirks (returning 0 commits
    // in some cases), and bare `--until=YYYY-MM-DD` would also exclude commits
    // made on that day since it resolves to midnight at the start.
    const sinceForGit = since ? `${since}T00:00:00` : undefined;
    const untilForGit = until ? `${until}T23:59:59` : undefined;

    const [commitsResponse, repoInfoResponse, authorsResponse, pathTypeResponse] = await Promise.all([
        listCommits({
            repo: repo名称,
            path: path || undefined,
            ref: revision名称,
            author: author ? escapeGitBreLiteral(author) : undefined,
            since: sinceForGit,
            until: untilForGit,
            maxCount: COMMITS_PER_PAGE,
            skip,
        }),
        getRepoInfoBy名称(repo名称),
        listCommitAuthors({
            repo: repo名称,
            path: path || undefined,
            ref: revision名称,
            maxCount: AUTHORS_PER_PAGE,
            skip: 0,
        }),
        getPathType({
            repo: repo名称,
            ref: revision名称,
            path,
        }),
    ]);

    if (isServiceError(commitsResponse)) {
        return <div class名称="p-4 text-sm">Error loading commits: {commitsResponse.message}</div>;
    }
    if (isServiceError(repoInfoResponse)) {
        return <div class名称="p-4 text-sm">Error loading repo info: {repoInfoResponse.message}</div>;
    }
    if (isServiceError(authorsResponse)) {
        return <div class名称="p-4 text-sm">Error loading commit authors: {authorsResponse.message}</div>;
    }
    // Fall back to 'blob' if the lookup fails so PathHeader still renders.
    const headerPathType = isServiceError(pathTypeResponse) ? 'blob' : pathTypeResponse;

    const authors = dedupeCommitAuthorsBy邮箱(authorsResponse.authors);
    const { commits, totalCount } = commitsResponse;
    const isLastPage = page * COMMITS_PER_PAGE >= totalCount;
    const hasFilters = Boolean(author || since || until);
    const isEmpty = commits.length === 0;
    const clearFiltersHref = getBrowsePath({
        repo名称,
        revision名称,
        path,
        pathType: 'commits',
    });

    const groups = new Map<string, { label: string; commits: typeof commits }>();
    for (const commit of commits) {
        const date = new Date(commit.date);
        const key = format(date, "yyyy-MM-dd");
        const label = `Commits on ${format(date, "MMM d, yyyy")}`;
        const existing = groups.get(key);
        if (existing) {
            existing.commits.push(commit);
        } else {
            groups.set(key, { label, commits: [commit] });
        }
    }

    return (
        <div class名称="flex flex-col h-full">
            <div class名称="flex flex-row py-1 px-2 items-center justify-between gap-2">
                <div class名称="flex flex-row items-center gap-2 min-w-0">
                    <span class名称="text-sm text-muted-foreground flex-shrink-0">History for</span>
                    <PathHeader
                        path={path}
                        pathType={headerPathType}
                        repo={{
                            name: repo名称,
                            codeHostType: repoInfoResponse.codeHostType,
                            display名称: repoInfoResponse.display名称,
                            externalWebUrl: repoInfoResponse.externalWebUrl,
                        }}
                        revision名称={revision名称}
                        isFileIconVisible={headerPathType === 'blob'}
                    />
                </div>
                <div class名称="flex flex-row items-center gap-2 flex-shrink-0">
                    <AuthorFilter authors={authors} selectedAuthor={author} />
                    <DateFilter since={since} until={until} />
                </div>
            </div>
            <Separator />
            <div class名称="flex-1 overflow-auto">
                {isEmpty ? (
                    hasFilters ? (
                        <div class名称="flex flex-col items-center justify-center gap-3 py-12">
                            <p class名称="text-sm text-muted-foreground">No commits match these filters</p>
                            <Button asChild variant="outline" size="sm">
                                <Link href={clearFiltersHref}>Clear filters</Link>
                            </Button>
                        </div>
                    ) : (
                        <div class名称="py-12 text-center text-sm text-muted-foreground">
                            No commits found
                        </div>
                    )
                ) : (
                    <>
                        {Array.from(groups.values()).map((group) => (
                            <div key={group.label}>
                                <div class名称="sticky top-0 z-10 flex flex-row items-center gap-2 px-3 py-2 bg-muted text-sm font-medium text-muted-foreground border-b">
                                    <GitCommitHorizontal class名称="h-4 w-4 flex-shrink-0" />
                                    {group.label}
                                </div>
                                {group.commits.map((commit) => (
                                    <CommitRow
                                        key={commit.hash}
                                        commit={commit}
                                        repo名称={repo名称}
                                        revision名称={revision名称}
                                    />
                                ))}
                            </div>
                        ))}
                        {isLastPage && (
                            <div class名称="py-8 text-center text-sm text-muted-foreground">
                                End of commit history
                            </div>
                        )}
                        <CommitsPagination
                            page={page}
                            perPage={COMMITS_PER_PAGE}
                            totalCount={totalCount}
                            extraParams={{ author, since, until }}
                        />
                    </>
                )}
            </div>
        </div>
    );
};
