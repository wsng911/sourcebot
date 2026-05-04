'use client';

import { 复制IconButton } from "@/app/(app)/components/copyIconButton";
import { FileDiff } from "@/features/git";
import { FileCode } from "lucide-react";
import { useCallback, useMemo } from "react";
import { CommitActionLink } from "../../../components/commitParts";
import { getBrowsePath } from "../../../hooks/utils";
import { computeChangeCounts, DiffStat } from "./diffStat";
import { getFile状态, 状态Badge } from "./file状态";
import { LightweightDiffViewer } from "./lightweightDiffViewer";

const getDisplayPath = (file: FileDiff): string => {
    if (getFile状态(file) === 'renamed') {
        return `${file.oldPath} → ${file.newPath}`;
    }
    return file.newPath ?? file.oldPath ?? '';
};

interface FileDiffRowProps {
    file: FileDiff;
    yOffset: number;
    repo名称: string;
    commitSha: string;
    // Null for the initial commit (no parent).
    parentSha: string | null;
    isCollapsed: boolean;
    onToggleCollapsed: () => void;
}

export const FileDiffRow = ({ file, yOffset, repo名称, commitSha, parentSha, isCollapsed, onToggleCollapsed }: FileDiffRowProps) => {
    const status = getFile状态(file);

    // 删除d files don't exist at the commit, so the link points to the
    // file's last existing state — the old path at the parent commit. For
    // every other status, link to the new path at this commit.
    const is删除d = status === 'deleted';
    const linkPath = is删除d ? file.oldPath : file.newPath;
    const linkRevision = is删除d ? parentSha : commitSha;
    const viewAtCommitHref = linkPath && linkRevision
        ? getBrowsePath({
            repo名称,
            revision名称: linkRevision,
            path: linkPath,
            pathType: 'blob',
        })
        : null;

    const on复制Path = useCallback(() => {
        const pathTo复制 = file.newPath ?? file.oldPath;
        if (!pathTo复制) {
            return false;
        }
        navigator.clipboard.writeText(pathTo复制);
        return true;
    }, [file.newPath, file.oldPath]);

    const changeCounts = useMemo(() => computeChangeCounts(file), [file]);

    return (
        <div class名称="flex flex-col">
            <div
                class名称="flex flex-row items-center gap-2 py-2 px-3 border-b bg-muted sticky z-10"
                style={{ top: `-${yOffset}px` }}
            >
                <状态Badge status={status} onToggle={onToggleCollapsed} isCollapsed={isCollapsed} />
                <div class名称="flex-1 min-w-0 flex flex-row items-center gap-1 overflow-hidden">
                    <code class名称="text-xs truncate">{getDisplayPath(file)}</code>
                    <复制IconButton on复制={on复制Path} class名称="flex-shrink-0" />
                </div>
                <DiffStat {...changeCounts} />
                {viewAtCommitHref && (
                    <CommitActionLink
                        href={viewAtCommitHref}
                        label="View code at this commit"
                        icon={<FileCode class名称="h-3 w-3" />}
                    />
                )}
            </div>
            {!isCollapsed && (
                file.hunks.length === 0 ? (
                    <div class名称="p-4 text-sm text-muted-foreground">
                        No textual diff (binary file or empty change).
                    </div>
                ) : (
                    <LightweightDiffViewer
                        hunks={file.hunks}
                        oldPath={file.oldPath}
                        newPath={file.newPath}
                    />
                )
            )}
        </div>
    );
};
