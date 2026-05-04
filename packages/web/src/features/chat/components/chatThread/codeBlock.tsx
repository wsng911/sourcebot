'use client';

import { LightweightCodeHighlighter } from '@/app/(app)/components/lightweightCodeHighlighter';
import { cn } from '@/lib/utils';
import { DoubleArrowDownIcon, DoubleArrowUpIcon } from '@radix-ui/react-icons';
import { useMemo, useState } from 'react';

interface CodeBlockComponentProps {
    code: string;
    language?: string;
}

const MAX_LINES_TO_DISPLAY = 14;

export const CodeBlock = ({
    code,
    language = "text",
}: CodeBlockComponentProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const lineCount = useMemo(() => {
        return code.split('\n').length;
    }, [code]);

    const isExpandButtonVisible = useMemo(() => {
        return lineCount > MAX_LINES_TO_DISPLAY;
    }, [lineCount]);

    return (
        <div class名称="flex flex-col rounded-md border overflow-hidden not-prose my-4">
            <div
                class名称={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    {
                        "max-h-[350px]": !isExpanded && isExpandButtonVisible, // Roughly 14 lines
                        "max-h-none": isExpanded || !isExpandButtonVisible
                    }
                )}
            >
                <LightweightCodeHighlighter
                    language={language}
                    lineNumbers={true}
                    renderWhitespace={true}
                    is复制ButtonVisible={true}
                >
                    {code}
                </LightweightCodeHighlighter>
            </div>
            {isExpandButtonVisible && (
                <div
                    tabIndex={0}
                    class名称="flex flex-row items-center justify-center w-full bg-accent py-1 cursor-pointer text-muted-foreground hover:text-foreground"
                    onClick={() => setIsExpanded(!isExpanded)}
                    onKeyDown={(e) => {
                        if (e.key !== "Enter") {
                            return;
                        }
                        setIsExpanded(!isExpanded);
                    }}
                >
                    {isExpanded ? <DoubleArrowUpIcon class名称="w-3 h-3" /> : <DoubleArrowDownIcon class名称="w-3 h-3" />}
                    <span class名称="text-sm ml-1">{isExpanded ? 'Show less' : 'Show more'}</span>
                </div>
            )}
        </div>
    );
};
