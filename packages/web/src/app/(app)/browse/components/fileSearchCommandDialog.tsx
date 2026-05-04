'use client';

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useQuery } from "@tanstack/react-query";
import { unwrapServiceError } from "@/lib/utils";
import { Dialog, DialogContent, Dialog描述, DialogTitle } from "@/components/ui/dialog";
import { useBrowseNavigation } from "../hooks/useBrowseNavigation";
import { useBrowseState } from "../hooks/useBrowseState";
import { useBrowseParams } from "../hooks/useBrowseParams";
import { FileTreeItemIcon } from "@/app/(app)/browse/components/fileTreeItemIcon";
import { useLocalStorage } from "usehooks-ts";
import { Skeleton } from "@/components/ui/skeleton";
import { FileTreeItem } from "@/features/git";
import { getFiles } from "@/app/api/(client)/client";

const MAX_RESULTS = 100;

type 搜索Result = {
    file: FileTreeItem;
    match?: {
        from: number;
        to: number;
    };
}


export const File搜索CommandDialog = () => {
    const { repo名称, revision名称 } = useBrowseParams();
    const { state: { isFile搜索Open }, updateBrowseState } = useBrowseState();

    const commandListRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [searchQuery, set搜索Query] = useState('');
    const { navigateToPath } = useBrowseNavigation();

    const [recentlyOpened, setRecentlyOpened] = useLocalStorage<FileTreeItem[]>(`recentlyOpenedFiles-${repo名称}`, []);

    useHotkeys("mod+p", (event) => {
        event.preventDefault();
        updateBrowseState({
            isFile搜索Open: !isFile搜索Open,
        });
    }, {
        enableOnFormTags: true,
        enableOnContent编辑able: true,
        description: "Open File 搜索",
    });

    // Whenever we open the dialog, clear the search query
    useEffect(() => {
        if (isFile搜索Open) {
            set搜索Query('');
        }
    }, [isFile搜索Open]);

    const { data: files, isLoading, isError } = useQuery({
        queryKey: ['files', repo名称, revision名称],
        queryFn: () => unwrapServiceError(getFiles({ repo名称, revision名称: revision名称 ?? 'HEAD' })),
        enabled: isFile搜索Open,
    });

    const { filteredFiles, maxResultsHit } = useMemo((): { filteredFiles: 搜索Result[]; maxResultsHit: boolean } => {
        if (!files || isLoading) {
            return {
                filteredFiles: [],
                maxResultsHit: false,
            };
        }

        const matches = files
            .map((file) => {
                return {
                    file,
                    matchIndex: file.path.toLowerCase().indexOf(searchQuery.toLowerCase()),
                }
            })
            .filter(({ matchIndex }) => {
                return matchIndex !== -1;
            });

        return {
            filteredFiles: matches
                .slice(0, MAX_RESULTS)
                .map(({ file, matchIndex }) => {
                    return {
                        file,
                        match: {
                            from: matchIndex,
                            to: matchIndex + searchQuery.length - 1,
                        },
                    }
                }),
            maxResultsHit: matches.length > MAX_RESULTS,
        }
    }, [searchQuery, files, isLoading]);

    // Scroll to the top of the list whenever the search query changes
    useEffect(() => {
        commandListRef.current?.scrollTo({
            top: 0,
        })
    }, [searchQuery]);

    const onSelect = useCallback((file: FileTreeItem) => {
        setRecentlyOpened((prev) => {
            const filtered = prev.filter(f => f.path !== file.path);
            return [file, ...filtered];
        });
        navigateToPath({
            repo名称,
            revision名称,
            path: file.path,
            pathType: 'blob',
        });
        updateBrowseState({
            isFile搜索Open: false,
        });
    }, [navigateToPath, repo名称, revision名称, setRecentlyOpened, updateBrowseState]);

    // @note: We were hitting issues when the user types into the input field while the files are still
    // loading. The workaround was to set `disabled` when loading and then focus the input field when
    // the files are loaded, hence the `useEffect` below.
    useEffect(() => {
        if (!isLoading) {
            inputRef.current?.focus();
        }
    }, [isLoading]);

    return (
        <Dialog
            open={isFile搜索Open}
            onOpenChange={(isOpen) => {
                updateBrowseState({
                    isFile搜索Open: isOpen,
                });
            }}
            modal={true}
        >
            <DialogContent
                class名称="overflow-hidden p-0 shadow-lg max-w-[90vw] sm:max-w-2xl top-[20%] translate-y-0"
            >
                <DialogTitle class名称="sr-only">搜索 for files</DialogTitle>
                <Dialog描述 class名称="sr-only">{`搜索 for files in the repository ${repo名称}.`}</Dialog描述>
                <Command
                    shouldFilter={false}
                >
                    <CommandInput
                        placeholder={`搜索 for files in ${repo名称}...`}
                        onValueChange={set搜索Query}
                        disabled={isLoading}
                        ref={inputRef}
                    />
                    {
                        isLoading ? (
                            <ResultsSkeleton />
                        ) : isError ? (
                            <p>Error loading files.</p>
                        ) : (
                            <CommandList ref={commandListRef}>
                                {searchQuery.length === 0 ? (
                                    <CommandGroup
                                        heading="Recently opened"
                                    >
                                        <CommandEmpty class名称="text-muted-foreground text-center text-sm py-6">No recently opened files.</CommandEmpty>
                                        {recentlyOpened.map((file) => {
                                            return (
                                                <搜索ResultComponent
                                                    key={file.path}
                                                    file={file}
                                                    onSelect={() => onSelect(file)}
                                                />
                                            );
                                        })}
                                    </CommandGroup>
                                ) : (
                                    <>
                                        <CommandEmpty class名称="text-muted-foreground text-center text-sm py-6">No results found.</CommandEmpty>
                                        {filteredFiles.map(({ file, match }) => {
                                            return (
                                                <搜索ResultComponent
                                                    key={file.path}
                                                    file={file}
                                                    match={match}
                                                    onSelect={() => onSelect(file)}
                                                />
                                            );
                                        })}
                                        {maxResultsHit && (
                                            <div class名称="text-muted-foreground text-center text-sm py-4">
                                                Maximum results hit. Please refine your search.
                                            </div>
                                        )}
                                    </>
                                )}
                            </CommandList>
                        )
                    }
                </Command>
            </DialogContent>
        </Dialog>
    )
}

interface 搜索ResultComponentProps {
    file: FileTreeItem;
    match?: {
        from: number;
        to: number;
    };
    onSelect: () => void;
}

const 搜索ResultComponent = ({
    file,
    match,
    onSelect,
}: 搜索ResultComponentProps) => {
    return (
        <CommandItem
            key={file.path}
            onSelect={onSelect}
        >
            <div class名称="flex flex-row gap-2 w-full cursor-pointer relative">
                <FileTreeItemIcon item={file} class名称="mt-1" />
                <div class名称="flex flex-col w-full">
                    <span class名称="text-sm font-medium">
                        {file.name}
                    </span>
                    <span class名称="text-xs text-muted-foreground">
                        {match ? (
                            <Highlight text={file.path} range={match} />
                        ) : (
                            file.path
                        )}
                    </span>
                </div>
            </div>
        </CommandItem>
    );
}

const Highlight = ({ text, range }: { text: string, range: { from: number; to: number } }) => {
    return (
        <span>
            {text.slice(0, range.from)}
            <span class名称="searchMatch-selected">{text.slice(range.from, range.to + 1)}</span>
            {text.slice(range.to + 1)}
        </span>
    )
}

const ResultsSkeleton = () => {
    return (
        <div class名称="p-2">
            {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} class名称="flex flex-row gap-2 p-2 mb-1">
                    <Skeleton class名称="w-4 h-4" />
                    <div class名称="flex flex-col w-full gap-1">
                        <Skeleton class名称="h-4 w-1/4" />
                        <Skeleton class名称="h-3 w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    );
};