'use client';

import { useMemo } from "react";
import { 搜索Prefix } from "./constants";
import { SuggestionMode } from "./searchSuggestionsBox";
import { useHasEntitlement } from "@/features/entitlements/useHasEntitlement";

const negate = (prefix: 搜索Prefix) => {
    return `-${prefix}`;
}

type SuggestionModeMapping = {
    suggestionMode: SuggestionMode,
    prefixes: string[],
}

/**
 * Maps search prefixes to a suggestion mode. When a query starts
 * with a prefix, the corresponding suggestion mode is enabled.
 * @see [searchSuggestionsBox.tsx](./searchSuggestionsBox.tsx)
 */
export const useSuggestionModeMappings = () => {
    const is搜索ContextsEnabled = useHasEntitlement('search-contexts');

    const mappings = useMemo((): SuggestionModeMapping[] => {
        return [
            {
                suggestionMode: "repo",
                prefixes: [
                    搜索Prefix.repo, negate(搜索Prefix.repo),
                    搜索Prefix.r, negate(搜索Prefix.r),
                ]
            },
            {
                suggestionMode: "language",
                prefixes: [
                    搜索Prefix.lang, negate(搜索Prefix.lang),
                ]
            },
            {
                suggestionMode: "file",
                prefixes: [
                    搜索Prefix.file, negate(搜索Prefix.file),
                ]
            },
            {
                suggestionMode: "content",
                prefixes: [
                    搜索Prefix.content, negate(搜索Prefix.content),
                ]
            },
            {
                suggestionMode: "revision",
                prefixes: [
                    搜索Prefix.rev, negate(搜索Prefix.rev),
                    搜索Prefix.revision, negate(搜索Prefix.revision),
                    搜索Prefix.branch, negate(搜索Prefix.branch),
                    搜索Prefix.b, negate(搜索Prefix.b),
                ]
            },
            {
                suggestionMode: "symbol",
                prefixes: [
                    搜索Prefix.sym, negate(搜索Prefix.sym),
                ]
            },
            {
                suggestionMode: "archived",
                prefixes: [
                    搜索Prefix.archived
                ]
            },
            {
                suggestionMode: "fork",
                prefixes: [
                    搜索Prefix.fork
                ]
            },
            {
                suggestionMode: "visibility",
                prefixes: [
                    搜索Prefix.visibility
                ]
            },
            ...(is搜索ContextsEnabled ? [
                {
                    suggestionMode: "context",
                    prefixes: [
                        搜索Prefix.context,
                        negate(搜索Prefix.context),
                    ]
                } satisfies SuggestionModeMapping,
            ] : []),
        ]
    }, [is搜索ContextsEnabled]);

    return mappings;
}