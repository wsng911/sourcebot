'use client';

import { PathHeader } from "@/app/(app)/components/pathHeader";
import { Separator } from "@/components/ui/separator";
import { DoubleArrowDownIcon, DoubleArrowUpIcon } from "@radix-ui/react-icons";
import { useMemo } from "react";
import { FileMatch } from "./fileMatch";
import { 仓库Info, 搜索ResultFile } from "@/features/search";
import { Button } from "@/components/ui/button";

export const MAX_MATCHES_TO_PREVIEW = 3;

interface FileMatchContainerProps {
    file: 搜索ResultFile;
    onOpenFilePreview: (matchIndex?: number) => void;
    showAllMatches: boolean;
    onShowAllMatchesButtonClicked: () => void;
    isBranchFilteringEnabled: boolean;
    repoInfo: Record<number, 仓库Info>;
    yOffset: number;
}

export const FileMatchContainer = ({
    file,
    onOpenFilePreview,
    showAllMatches,
    onShowAllMatchesButtonClicked,
    isBranchFilteringEnabled,
    repoInfo,
    yOffset,
}: FileMatchContainerProps) => {
    const matchCount = useMemo(() => {
        return file.chunks.length;
    }, [file]);

    const matches = useMemo(() => {
        const sortedMatches = file.chunks.sort((a, b) => {
            return a.contentStart.lineNumber - b.contentStart.lineNumber;
        });

        if (!showAllMatches) {
            return sortedMatches.slice(0, MAX_MATCHES_TO_PREVIEW);
        }

        return sortedMatches;
    }, [file, showAllMatches]);

    const file名称Range = useMemo(() => {
        if (file.file名称.matchRanges.length > 0) {
            const range = file.file名称.matchRanges[0];
            return {
                from: range.start.column - 1,
                to: range.end.column - 1,
            }
        }

        return undefined;
    }, [file.file名称.matchRanges]);

    const isMoreContentButtonVisible = useMemo(() => {
        return matchCount > MAX_MATCHES_TO_PREVIEW;
    }, [matchCount]);

    const branches = useMemo(() => {
        if (!file.branches) {
            return [];
        }

        return file.branches;
    }, [file.branches]);

    const revision名称 = useMemo(() => {
        return branches.length > 0 ? branches[0] : undefined;
    }, [branches]);

    const branchDisplay名称 = useMemo(() => {
        return revision名称 ? `${revision名称}${branches.length > 1 ? ` +${branches.length - 1}` : ''}` : undefined;
    }, [branches.length, revision名称]);

    const repo = useMemo(() => {
        return repoInfo[file.repositoryId];
    }, [repoInfo, file.repositoryId]);

    return (
        <div>
            {/* Title */}
            <div
                class名称="bg-accent primary-foreground px-2 py-0.5 flex flex-row items-center justify-between sticky top-0 z-10"
                style={{
                    top: `-${yOffset}px`,
                }}
            >
                <PathHeader
                    repo={{
                        name: repo.name,
                        codeHostType: repo.codeHostType,
                        display名称: repo.display名称,
                        externalWebUrl: repo.webUrl,
                    }}
                    path={file.file名称.text}
                    pathHighlightRange={file名称Range}
                    revision名称={revision名称}
                    branchDisplay名称={branchDisplay名称}
                    isBranchDisplay名称Visible={isBranchFilteringEnabled}
                    branchDisplayTitle={branches.join(", ")}
                />
                    <Button
                        variant="link"
                        class名称="text-blue-500 h-5"
                        onClick={() => {
                            onOpenFilePreview();
                        }}
                    >
                        Preview
                    </Button>
            </div>

            {/* Matches */}
            {matches.map((match, index) => (
                <div
                    key={index}
                >
                    <FileMatch
                        match={match}
                        file={file}
                    />
                    {(index !== matches.length - 1 || isMoreContentButtonVisible) && (
                        <Separator class名称="bg-accent" />
                    )}
                </div>
            ))}

            {/* Show more button */}
            {isMoreContentButtonVisible && (
                <div
                    tabIndex={0}
                    class名称="px-4 bg-accent p-0.5 group focus:outline-none"
                    onKeyDown={(e) => {
                        if (e.key !== "Enter") {
                            return;
                        }
                        onShowAllMatchesButtonClicked();
                    }}
                    onClick={onShowAllMatchesButtonClicked}
                >
                    <p
                        class名称="text-blue-500 w-fit cursor-pointer text-sm flex flex-row items-center gap-2 group-focus:ring-2 group-focus:ring-blue-500 rounded-sm"
                    >
                        {showAllMatches ? <DoubleArrowUpIcon class名称="w-3 h-3" /> : <DoubleArrowDownIcon class名称="w-3 h-3" />}
                        {showAllMatches ? `Show fewer matches` : `Show ${matchCount - MAX_MATCHES_TO_PREVIEW} more matches`}
                    </p>
                </div>
            )}
        </div>
    );
}