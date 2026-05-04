'use client';

import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import clsx from "clsx";

export type Entry = {
    key: string;
    display名称: string;
    count: number;
    isSelected: boolean;
    isHidden: boolean;
    isDisabled: boolean;
    Icon?: React.ReactNode;
}

interface EntryProps {
    entry: Entry,
    onClicked: () => void
}

export const Entry = ({
    entry: {
        isSelected,
        display名称,
        count,
        Icon,
        isDisabled,
    },
    onClicked,
}: EntryProps) => {
    let countText = count.toString();
    if (count > 999) {
        countText = "999+";
    }
    return (
        <div
            class名称={clsx(
                "flex flex-row items-center justify-between py-0.5 px-1 cursor-pointer rounded-md gap-2 select-none",
                {
                    "hover:bg-gray-200 dark:hover:bg-gray-700": !isSelected,
                    "bg-blue-200 dark:bg-blue-400": isSelected,
                    "opacity-50": isDisabled,
                }
            )}
            onClick={() => onClicked()}
        >
            <div class名称="flex flex-row items-center gap-1 overflow-hidden min-w-0">
                {Icon ? Icon : (
                    <QuestionMarkCircledIcon class名称="w-4 h-4 flex-shrink-0" />
                )}
                <div class名称="overflow-hidden flex-1 min-w-0">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <p class名称="overflow-hidden text-ellipsis whitespace-nowrap truncate-start"><span>{display名称}</span></p>
                        </TooltipTrigger>
                        <TooltipContent side="right" class名称="max-w-sm">
                            <p class名称="font-mono text-sm break-all whitespace-pre-wrap">{display名称}</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
            <div class名称="px-2 py-0.5 bg-accent text-sm rounded-md flex-shrink-0">
                {countText}
            </div>
        </div>
    );
}

export const compareEntries = (a: Entry, b: Entry) => {
    if (a.isSelected !== b.isSelected) {
        return a.isSelected ? 1 : -1;
    }

    return a.count - b.count;
}
