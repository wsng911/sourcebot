'use client';

import { useMemo, useState } from "react";
import { compareEntries, Entry } from "./entry";
import { Input } from "@/components/ui/input";
import Fuse from "fuse.js";
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton";

interface FilterProps {
    title: string,
    searchPlaceholder: string,
    entries: Entry[],
    onEntryClicked: (key: string) => void,
    class名称?: string,
    isStreaming: boolean,
}

export const Filter = ({
    title,
    searchPlaceholder,
    entries,
    onEntryClicked,
    class名称,
    isStreaming,
}: FilterProps) => {
    const [searchFilter, set搜索Filter] = useState<string>("");

    const filteredEntries = useMemo(() => {
        if (searchFilter === "") {
            return entries;
        }

        const fuse = new Fuse(entries, {
            keys: ["display名称"],
            threshold: 0.3,
        });

        const result = fuse.search(searchFilter);
        return result.map((result) => result.item);
    }, [entries, searchFilter]);

    return (
        <div class名称={cn(
            "flex flex-col gap-2 p-1",
            class名称
        )}>
            <h2 class名称="text-sm font-semibold">{title}</h2>
            {(isStreaming && entries.length === 0) ? (
                <Skeleton class名称="h-12 w-full" />
            ) : (
                <>
                    <div class名称="pr-1">
                        <Input
                            placeholder={searchPlaceholder}
                            class名称="h-8"
                            onChange={(event) => set搜索Filter(event.target.value)}
                        />
                    </div>

                    <div
                        class名称="flex flex-col gap-0.5 text-sm overflow-scroll no-scrollbar"
                    >
                        {filteredEntries
                            .sort((entryA, entryB) => compareEntries(entryB, entryA))
                            .map((entry) => (
                                <Entry
                                    key={entry.key}
                                    entry={entry}
                                    onClicked={() => onEntryClicked(entry.key)}
                                />
                            ))}
                    </div>
                </>
            )}

        </div>
    )
}
