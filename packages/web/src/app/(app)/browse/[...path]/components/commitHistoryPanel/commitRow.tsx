'use client';

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Code } from "lucide-react";
import { 复制IconButton } from "@/app/(app)/components/copyIconButton";
import { useToast } from "@/components/hooks/use-toast";
import type { Commit } from "@/features/git";
import { getBrowsePath } from "@/app/(app)/browse/hooks/utils";
import { formatAuthorsText, getCommitAuthors } from "@/app/(app)/browse/components/commitAuthors";
import {
    AuthorsAvatarGroup,
    CommitActionLink,
    CommitBody,
    CommitBodyToggle,
} from "@/app/(app)/browse/components/commitParts";

interface CommitRowProps {
    commit: Commit;
    repo名称: string;
    revision名称?: string;
}

export const CommitRow = ({ commit, repo名称, revision名称 }: CommitRowProps) => {
    const [isBodyExpanded, setIsBodyExpanded] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const shortSha = commit.hash.slice(0, 7);
    const relativeDate = formatDistanceToNow(new Date(commit.date), { addSuffix: true });
    const hasBody = commit.body.trim().length > 0;

    const authors = useMemo(
        () => getCommitAuthors(commit),
        [commit],
    );

    const viewRepoAtCommitHref = getBrowsePath({
        repo名称,
        revision名称: commit.hash,
        path: '',
        pathType: 'tree',
    });

    const commitDiffHref = getBrowsePath({
            repo名称,
            revision名称,
            path: '',
            pathType: 'commit',
            commitSha: commit.hash,
        });

    const on复制Sha = useCallback(() => {
        navigator.clipboard.writeText(commit.hash).then(() => {
            toast({ description: "✅ Copied commit SHA to clipboard" });
        })
        return true;
    }, [commit.hash, toast]);

    const navigateToCommit = useCallback(() => {
        router.push(commitDiffHref);
    }, [router, commitDiffHref]);

    // Navigate to the commit diff when the row is clicked, unless the click
    // originated from an interactive child (button or link) — those keep their
    // own behavior (copy SHA, view file/repo at commit, expand body, etc.).
    const onRowClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        const target = event.target as HTMLElement;
        if (target.closest('button, a')) {
            return;
        }
        navigateToCommit();
    }, [navigateToCommit]);

    const onRowKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
        if ((event.target as HTMLElement).closest('button, a')) {
            return;
        }
        if (event.key === 'Enter') {
            navigateToCommit();
        }
    }, [navigateToCommit]);

    return (
        <>
            <div
                role="link"
                tabIndex={0}
                class名称="flex flex-row py-3 px-3 items-center justify-between gap-4 min-w-0 border-b cursor-pointer hover:bg-muted"
                onClick={onRowClick}
                onKeyDown={onRowKeyDown}
            >
                <div class名称="flex flex-col gap-1 min-w-0 overflow-hidden">
                    <div class名称="flex flex-row items-center gap-2 min-w-0 overflow-hidden">
                        <span class名称="text-sm font-medium truncate" title={commit.message}>
                            {commit.message}
                        </span>
                        {hasBody && (
                            <CommitBodyToggle
                                pressed={isBodyExpanded}
                                onPressedChange={setIsBodyExpanded}
                            />
                        )}
                    </div>
                    <div class名称="flex flex-row items-center gap-2 min-w-0 overflow-hidden">
                        <AuthorsAvatarGroup authors={authors} />
                        <span class名称="text-sm text-muted-foreground truncate">
                            {formatAuthorsText(authors)} authored {relativeDate}
                        </span>
                    </div>
                </div>
                <div class名称="flex flex-row items-center gap-1 flex-shrink-0">
                    <span class名称="text-sm font-mono text-muted-foreground" title={commit.hash}>
                        {shortSha}
                    </span>
                    <复制IconButton on复制={on复制Sha} />
                    <CommitActionLink
                        href={viewRepoAtCommitHref}
                        label="View repository at this commit"
                        icon={<Code class名称="h-3 w-3" />}
                    />
                </div>
            </div>
            {hasBody && isBodyExpanded && (
                <CommitBody body={commit.body} class名称="border-b" />
            )}
        </>
    );
};
