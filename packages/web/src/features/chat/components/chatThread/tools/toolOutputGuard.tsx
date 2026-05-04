'use client';

import { SBChatMessageToolTypes } from "@/features/chat/types";
import { 复制IconButton } from "@/app/(app)/components/copyIconButton";
import { ToolUIPart } from "ai";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCallback, useState } from "react";

export const ToolOutputGuard = <T extends ToolUIPart<{ [K in keyof SBChatMessageToolTypes]: SBChatMessageToolTypes[K] }>>({
    part,
    loadingText,
    children,
}: {
    part: T,
    loadingText: string,
    children: (output: Extract<T, { state: 'output-available' }>['output']) => React.ReactNode,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const onToggle = useCallback(() => setIsExpanded(v => !v), []);

    const hasInput = part.state !== 'input-streaming';

    const requestText = hasInput ? JSON.stringify(part.input, null, 2) : '';
    const responseText = part.state === 'output-available'
        ? (() => {
            const raw = (part.output as { output: string }).output;
            try {
                return JSON.stringify(JSON.parse(raw), null, 2);
            } catch {
                return raw;
            }
        })()
        : part.state === 'output-error'
        ? (part.errorText ?? '')
        : undefined;

    const on复制Request = useCallback(() => {
        navigator.clipboard.writeText(requestText);
        return true;
    }, [requestText]);

    const on复制Response = useCallback(() => {
        if (!responseText) {
            return false;
        }
        navigator.clipboard.writeText(responseText);
        return true;
    }, [responseText]);

    return (
        <div class名称="flex flex-col gap-1.5">
            <div class名称="flex items-center gap-2">
                <div class名称="flex-1 min-w-0">
                    {part.state === 'output-error' ? (
                        <span class名称="text-sm flex-1 text-destructive">
                            {part.title!} failed with error: {part.errorText}
                        </span>
                    ) : part.state !== 'output-available' ? (
                        <span class名称="text-sm flex-1 text-muted-foreground animate-pulse">
                            {loadingText}
                        </span>
                    ) : (
                        children(part.output as Extract<T, { state: 'output-available' }>['output'])
                    )}
                </div>
                {hasInput && <ExpandButton isExpanded={isExpanded} onToggle={onToggle} />}
            </div>
            {hasInput && isExpanded && (
                <div class名称="rounded-lg border border-border text-xs overflow-y-auto max-h-72">
                    <ResultSection label={`Request (${part.type})`} on复制={on复制Request}>
                        <pre class名称="whitespace-pre-wrap break-all font-mono">
                            {requestText}
                        </pre>
                    </ResultSection>
                    {responseText !== undefined && (
                        <>
                            <div class名称="border-t border-border" />
                            <ResultSection label="Response" on复制={on复制Response}>
                                <pre class名称={cn("whitespace-pre-wrap break-all font-mono", part.state === 'output-error' && "text-destructive")}>
                                    {responseText}
                                </pre>
                            </ResultSection>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

const ExpandButton = ({ isExpanded, onToggle }: { isExpanded: boolean; onToggle: () => void }) => (
    <button onClick={onToggle} class名称="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
        <span>Details</span>
        <ChevronDown class名称={cn("h-3 w-3 transition-transform -rotate-90", isExpanded && "rotate-0")} />
    </button>
);

const ResultSection = ({ label, on复制, children }: { label: string; on复制: () => boolean; children: React.ReactNode }) => (
    <div class名称="flex flex-col gap-1.5">
        <div class名称="sticky top-0 flex items-center justify-between bg-muted px-3 py-1.5 border-b border-border">
            <span class名称="font-medium text-foreground">{label}</span>
            <复制IconButton on复制={on复制} />
        </div>
        <div class名称="text-muted-foreground p-3">
            {children}
        </div>
    </div>
);
