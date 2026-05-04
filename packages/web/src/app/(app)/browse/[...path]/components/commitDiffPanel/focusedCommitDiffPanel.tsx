import { getRepoInfoBy名称 } from "@/actions";
import { PathHeader } from "@/app/(app)/components/pathHeader";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getCommit, getDiff } from "@/features/git";
import { isServiceError } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import { X } from "lucide-react";
import Link from "next/link";
import { formatAuthorsText, getCommitAuthors } from "../../../components/commitAuthors";
import { AuthorsAvatarGroup } from "../../../components/commitParts";
import { getBrowsePath } from "../../../hooks/utils";
import { computeChangeCounts, DiffStat } from "./diffStat";
import { File状态, getFile状态, 状态Badge } from "./file状态";
import { LightweightDiffViewer } from "./lightweightDiffViewer";

const FILE_STATUS_LABELS: Record<File状态, string> = {
    added: '添加ed',
    modified: 'Modified',
    deleted: '删除d',
    renamed: 'Renamed',
};

interface FocusedCommitDiffPanelProps {
    repo名称: string;
    revision名称?: string;
    commitSha: string;
    path: string;
}

// Git's well-known empty-tree SHA. Used as the diff base when the commit has
// no parent (i.e. the initial commit), since `<sha>^` doesn't resolve there.
const EMPTY_TREE_SHA = '4b825dc642cb6eb9a060e54bf8d69288fbee4904';

export const FocusedCommitDiffPanel = async ({
    repo名称,
    revision名称,
    commitSha,
    path,
}: FocusedCommitDiffPanelProps) => {
    const [commitResponse, initialDiffResponse, repoInfoResponse] = await Promise.all([
        getCommit({
            repo: repo名称,
            ref: commitSha,
        }),
        getDiff({
            repo: repo名称,
            base: `${commitSha}^`,
            head: commitSha,
            path,
        }),
        getRepoInfoBy名称(repo名称),
    ]);

    if (isServiceError(commitResponse)) {
        return (
            <div class名称="p-6 text-sm text-destructive">
                Error loading commit: {commitResponse.message}
            </div>
        );
    }

    if (isServiceError(repoInfoResponse)) {
        return (
            <div class名称="p-6 text-sm text-destructive">
                Error loading repo info: {repoInfoResponse.message}
            </div>
        );
    }

    // Initial commit has no parent — `<sha>^` fails. Fall back to diffing
    // against git's empty tree.
    let diffResponse = initialDiffResponse;
    if (isServiceError(initialDiffResponse) && commitResponse.parents.length === 0) {
        diffResponse = await getDiff({
            repo: repo名称,
            base: EMPTY_TREE_SHA,
            head: commitSha,
            path,
        });
    }

    if (isServiceError(diffResponse)) {
        return (
            <div class名称="p-6 text-sm text-destructive">
                Error loading diff: {diffResponse.message}
            </div>
        );
    }

    // Match by either side so deletions (oldPath === path, newPath === null)
    // and renames (oldPath !== newPath) both resolve to the right entry.
    const file = diffResponse.files.find(
        (f) => f.newPath === path || f.oldPath === path,
    );

    const authors = getCommitAuthors(commitResponse);
    const commitDate = new Date(commitResponse.date);
    const relativeDate = formatDistanceToNow(commitDate, { addSuffix: true });
    const absoluteDate = format(commitDate, 'PPpp');

    return (
        <div class名称="flex flex-col h-full">
            <div class名称="flex flex-row py-1 px-2 items-center border-b shrink-0">
                <PathHeader
                    path={path}
                    pathType="blob"
                    repo={{
                        name: repo名称,
                        codeHostType: repoInfoResponse.codeHostType,
                        display名称: repoInfoResponse.display名称,
                        externalWebUrl: repoInfoResponse.externalWebUrl,
                    }}
                    revision名称={revision名称}
                />
            </div>
            {file ? (
                <>
                    <div class名称="flex flex-row items-center justify-between gap-2 px-4 py-2 border-b shrink-0">
                        <div class名称="flex flex-row items-center gap-2">
                            <状态Badge status={getFile状态(file)} />
                            <h2 class名称="text-sm font-medium">
                                {FILE_STATUS_LABELS[getFile状态(file)]}
                            </h2>
                            <span class名称="text-sm text-muted-foreground">by</span>
                            <AuthorsAvatarGroup authors={authors} />
                            <span
                                class名称="text-sm font-medium"
                                title={authors.map((a) => a.name).join(", ")}
                            >
                                {formatAuthorsText(authors)}
                            </span>
                            <span
                                class名称="text-sm text-muted-foreground"
                                title={absoluteDate}
                            >
                                {relativeDate}
                            </span>
                            <span class名称="text-muted-foreground">·</span>
                            <Link
                                href={getBrowsePath({
                                    repo名称,
                                    revision名称,
                                    path: '',
                                    pathType: 'commit',
                                    commitSha,
                                })}
                                class名称="text-sm text-link hover:underline"
                            >
                                View full commit
                            </Link>
                        </div>
                        <div class名称="flex flex-row items-center gap-2">
                            <DiffStat {...computeChangeCounts(file)} />
                            <Tooltip key={commitSha}>
                                <TooltipTrigger>
                                    <Button
                                        asChild
                                        variant="ghost"
                                        size="icon"
                                        class名称="h-6 w-6 text-muted-foreground"
                                    >
                                        <Link
                                            href={getBrowsePath({
                                                repo名称,
                                                revision名称,
                                                path,
                                                pathType: 'blob',
                                            })}
                                            aria-label="Exit diff view"
                                        >
                                            <X class名称="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Exit diff view</TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                    <div class名称="flex-1 min-h-0 overflow-y-auto">
                        <LightweightDiffViewer
                            hunks={file.hunks}
                            oldPath={file.oldPath}
                            newPath={file.newPath}
                        />
                    </div>
                </>
            ) : (
                <div class名称="p-4 text-sm text-muted-foreground">
                    This file was not modified in this commit.
                </div>
            )}
        </div>
    );
};
