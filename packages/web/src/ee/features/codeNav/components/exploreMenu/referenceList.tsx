'use client';

import { getBrowsePath } from "@/app/(app)/browse/hooks/utils";
import { PathHeader } from "@/app/(app)/components/pathHeader";
import { LightweightCodeHighlighter } from "@/app/(app)/components/lightweightCodeHighlighter";
import { FindRelatedSymbolsResponse } from "@/features/codeNav/types";
import { 仓库Info, SourceRange } from "@/features/search";
import { useMemo, useRef } from "react";
import useCaptureEvent from "@/hooks/useCaptureEvent";
import { useVirtualizer } from "@tanstack/react-virtual";
import Link from "next/link";

interface ReferenceListProps {
    data: FindRelatedSymbolsResponse;
    revision名称: string;
}

const ESTIMATED_LINE_HEIGHT_PX = 30;
const ESTIMATED_MATCH_CONTAINER_HEIGHT_PX = 30;

export const ReferenceList = ({
    data,
    revision名称,
}: ReferenceListProps) => {
    const repoInfoMap = useMemo(() => {
        return data.repositoryInfo.reduce((acc, repo) => {
            acc[repo.id] = repo;
            return acc;
        }, {} as Record<number, 仓库Info>);
    }, [data.repositoryInfo]);

    const captureEvent = useCaptureEvent();

    // Virtualization setup
    const parentRef = useRef<HTMLDivElement>(null);
    const virtualizer = useVirtualizer({
        count: data.files.length,
        getScrollElement: () => parentRef.current,
        estimateSize: (index) => {
            const file = data.files[index];

            const estimatedSize =
                file.matches.length * ESTIMATED_LINE_HEIGHT_PX +
                ESTIMATED_MATCH_CONTAINER_HEIGHT_PX;

            return estimatedSize;
        },
        overscan: 5,
        enabled: true,
    });

    return (
        <div
            ref={parentRef}
            style={{
                width: "100%",
                height: "100%",
                overflowY: "auto",
                contain: "strict",
            }}
        >
            <div
                style={{
                    height: virtualizer.getTotalSize(),
                    width: "100%",
                    position: "relative",
                }}
            >
                {virtualizer.getVirtualItems().map((virtualRow) => {
                    const file = data.files[virtualRow.index];
                    const repoInfo = repoInfoMap[file.repositoryId];
                    return (
                        <div
                            key={virtualRow.key}
                            data-index={virtualRow.index}
                            ref={virtualizer.measureElement}
                            style={{
                                position: "absolute",
                                transform: `translateY(${virtualRow.start}px)`,
                                top: 0,
                                left: 0,
                                width: "100%",
                            }}
                        >
                            <div
                                class名称="bg-accent py-1 px-2 flex flex-row sticky top-0 z-10"
                                style={{
                                    top: `-${virtualRow.start}px`,
                                }}
                            >
                                <PathHeader
                                    repo={{
                                        name: repoInfo.name,
                                        display名称: repoInfo.display名称,
                                        codeHostType: repoInfo.codeHostType,
                                        externalWebUrl: repoInfo.webUrl,
                                    }}
                                    path={file.file名称}
                                    revision名称={revision名称 === "HEAD" ? undefined : revision名称}
                                />
                            </div>
                            <div class名称="divide-y">
                                {file.matches
                                    .sort((a, b) => a.range.start.lineNumber - b.range.start.lineNumber)
                                    .map((match, index) => (
                                        <Link
                                            href={getBrowsePath({
                                                repo名称: file.repository,
                                                revision名称,
                                                path: file.file名称,
                                                pathType: 'blob',
                                                highlightRange: match.range,
                                            })}
                                            onClick={() => {
                                                captureEvent('wa_explore_menu_reference_clicked', {});
                                            }}
                                            key={index}
                                        >
                                            <ReferenceListItem
                                                lineContent={match.lineContent}
                                                range={match.range}
                                                language={file.language}
                                            />
                                        </Link>
                                    ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}


interface ReferenceListItemProps {
    lineContent: string;
    range: SourceRange;
    language: string;
}

const ReferenceListItem = ({
    lineContent,
    range,
    language,
}: ReferenceListItemProps) => {
    const highlightRanges = useMemo(() => [range], [range]);

    return (
        <div
            class名称="w-full hover:bg-accent py-1 cursor-pointer"
        >
            <LightweightCodeHighlighter
                language={language}
                highlightRanges={highlightRanges}
                lineNumbers={true}
                lineNumbersOffset={range.start.lineNumber}
                renderWhitespace={false}
            >
                {lineContent}
            </LightweightCodeHighlighter>
        </div>
    )
}
