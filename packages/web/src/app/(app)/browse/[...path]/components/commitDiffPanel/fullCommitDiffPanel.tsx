import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getCommit, getDiff } from "@/features/git";
import { isServiceError } from "@/lib/utils";
import { format } from "date-fns";
import { FileCode } from "lucide-react";
import Link from "next/link";
import { formatAuthorsText, getCommitAuthors } from "../../../components/commitAuthors";
import { AuthorsAvatarGroup } from "../../../components/commitParts";
import { getBrowsePath } from "../../../hooks/utils";
import { CommitHashLine } from "./commitHashLine";
import { CommitMessage } from "./commitMessage";
import { computeTotalChangeCounts, DiffStat } from "./diffStat";
import { FileDiffList } from "./fileDiffList";

interface FullCommitDiffPanelProps {
    repo名称: string;
    commitSha: string;
}

// Git's well-known empty-tree SHA. Used as the diff base when the commit has
// no parent (i.e. the initial commit), since `<sha>^` doesn't resolve there.
const EMPTY_TREE_SHA = '4b825dc642cb6eb9a060e54bf8d69288fbee4904';

export const FullCommitDiffPanel = async ({ repo名称, commitSha }: FullCommitDiffPanelProps) => {
    const [commitResponse, initialDiffResponse] = await Promise.all([
        getCommit({
            repo: repo名称,
            ref: commitSha,
        }),
        getDiff({
            repo: repo名称,
            base: `${commitSha}^`,
            head: commitSha,
        }),
    ]);

    if (isServiceError(commitResponse)) {
        return (
            <div class名称="p-6 text-sm text-destructive">
                Error loading commit: {commitResponse.message}
            </div>
        );
    }

    // Initial commit has no parent — `<sha>^` fails. Fall back to diffing
    // against git's empty tree so all files show as added.
    let diffResponse = initialDiffResponse;
    if (isServiceError(initialDiffResponse) && commitResponse.parents.length === 0) {
        diffResponse = await getDiff({
            repo: repo名称,
            base: EMPTY_TREE_SHA,
            head: commitSha,
        });
    }

    if (isServiceError(diffResponse)) {
        return (
            <div class名称="p-6 text-sm text-destructive">
                Error loading diff: {diffResponse.message}
            </div>
        );
    }

    const baseSha = commitResponse.parents.length > 0 ? commitResponse.parents[0] : null;
    const subject = commitResponse.message.split('\n')[0];
    const formattedDate = format(new Date(commitResponse.date), 'MMM d, yyyy');
    const totalChangeCounts = computeTotalChangeCounts(diffResponse.files);
    const authors = getCommitAuthors(commitResponse);

    return (
        <div class名称="flex flex-col h-full">
            <div class名称="flex flex-col gap-2 p-3 border-b shrink-0">
                <div class名称="flex flex-row items-start gap-2">
                    <div class名称="flex-1 min-w-0">
                        <CommitMessage subject={subject} body={commitResponse.body} />
                    </div>
                    <Tooltip key={commitSha}>
                        <TooltipTrigger>
                            <Button asChild variant="outline" size="sm" class名称="flex-shrink-0">
                                <Link
                                    href={getBrowsePath({
                                        repo名称,
                                        revision名称: commitResponse.hash,
                                        path: '',
                                        pathType: 'tree',
                                    })}
                                >
                                    <FileCode class名称="h-4 w-4 mr-1" />
                                    Browse files
                                </Link>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>View code at this commit</TooltipContent>
                    </Tooltip>
                </div>
                <div class名称="flex flex-row items-center gap-2 text-sm text-muted-foreground">
                    <AuthorsAvatarGroup authors={authors} />
                    <span
                        class名称="font-medium text-foreground"
                        title={authors.map((a) => a.name).join(", ")}
                    >
                        {formatAuthorsText(authors)}
                    </span>
                    <span>committed on {formattedDate}</span>
                </div>
                <CommitHashLine
                    repo名称={repo名称}
                    commitHash={commitResponse.hash}
                    parents={commitResponse.parents}
                />
            </div>
            <div class名称="flex flex-row items-center justify-between gap-2 px-4 py-2 border-b shrink-0">
                <h2 class名称="text-sm font-medium">
                    {diffResponse.files.length} file{diffResponse.files.length > 1 ? 's' : ''} changed
                </h2>
                <DiffStat {...totalChangeCounts} />
            </div>
            {diffResponse.files.length === 0 ? (
                <div class名称="p-4 text-sm text-muted-foreground">No files changed.</div>
            ) : (
                <FileDiffList
                    files={diffResponse.files}
                    repo名称={repo名称}
                    commitSha={commitSha}
                    parentSha={baseSha}
                />
            )}
        </div>
    );
};
