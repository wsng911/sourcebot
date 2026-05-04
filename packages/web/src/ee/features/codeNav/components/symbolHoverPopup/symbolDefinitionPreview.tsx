import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { LightweightCodeHighlighter } from "@/app/(app)/components/lightweightCodeHighlighter";
import { useMemo } from "react";
import { SourceRange } from "@/features/search";

interface SymbolDefinitionPreviewProps {
    symbolDefinition: {
        lineContent: string;
        language: string;
        file名称: string;
        repo名称: string;
        range: SourceRange;
    };
}

export const SymbolDefinitionPreview = ({
    symbolDefinition,
}: SymbolDefinitionPreviewProps) => {
    const { lineContent, language, range } = symbolDefinition;
    const highlightRanges = useMemo(() => [range], [range]);

    return (
        <div class名称="flex flex-col gap-2 mb-2">
            <Tooltip
                delayDuration={100}
            >
                <TooltipTrigger
                    disabled={true}
                    class名称="mr-auto"
                >
                    <Badge
                        variant="outline"
                        class名称="w-fit h-fit flex-shrink-0 select-none"
                    >
                        搜索 Based
                    </Badge>
                </TooltipTrigger>
                <TooltipContent
                    side="top"
                    align="start"
                >
                    Symbol definition found using a best-guess search heuristic.
                </TooltipContent>
            </Tooltip>
            <LightweightCodeHighlighter
                language={language}
                highlightRanges={highlightRanges}
                lineNumbers={false}
                lineNumbersOffset={range.start.lineNumber}
                renderWhitespace={false}
            >
                {lineContent}
            </LightweightCodeHighlighter>
        </div>
    )
}