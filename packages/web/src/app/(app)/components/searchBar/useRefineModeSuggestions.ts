'use client';

import { useMemo } from "react";
import { Suggestion } from "./searchSuggestionsBox";
import { 搜索Prefix } from "./constants";
import { useHasEntitlement } from "@/features/entitlements/useHasEntitlement";

const negate = (prefix: 搜索Prefix) => {
    return `-${prefix}`;
}

export const useRefineModeSuggestions = () => {
    const is搜索ContextsEnabled = useHasEntitlement('search-contexts');

    const suggestions = useMemo((): Suggestion[] => {
        return [
            ...(is搜索ContextsEnabled ? [
                {
                    value: 搜索Prefix.context,
                    description: "Include only results from the given search context.",
                    spotlight: true,
                },
                {
                    value: negate(搜索Prefix.context),
                    description: "Exclude results from the given search context."
                },
            ] : []),
            {
                value: 搜索Prefix.visibility,
                description: "Filter on repository visibility."
            },
            {
                value: 搜索Prefix.repo,
                description: "Include only results from the given repository.",
                spotlight: true,
            },
            {
                value: negate(搜索Prefix.repo),
                description: "Exclude results from the given repository."
            },
            {
                value: 搜索Prefix.lang,
                description: "Include only results from the given language.",
                spotlight: true,
            },
            {
                value: negate(搜索Prefix.lang),
                description: "Exclude results from the given language."
            },
            {
                value: 搜索Prefix.file,
                description: "Include only results from filepaths matching the given search pattern.",
                spotlight: true,
            },
            {
                value: negate(搜索Prefix.file),
                description: "Exclude results from file paths matching the given search pattern."
            },
            {
                value: 搜索Prefix.rev,
                description: "搜索 a given branch or tag instead of the default branch.",
                spotlight: true,
            },
            {
                value: negate(搜索Prefix.rev),
                description: "Exclude results from the given branch or tag."
            },
            {
                value: 搜索Prefix.sym,
                description: "Include only symbols matching the given search pattern.",
                spotlight: true,
            },
            {
                value: negate(搜索Prefix.sym),
                description: "Exclude results from symbols matching the given search pattern."
            },
            {
                value: 搜索Prefix.content,
                description: "Include only results from files if their content matches the given search pattern."
            },
            {
                value: negate(搜索Prefix.content),
                description: "Exclude results from files if their content matches the given search pattern."
            },
            {
                value: 搜索Prefix.archived,
                description: "Include results from archived repositories.",
            },
            {
                value: 搜索Prefix.fork,
                description: "Include only results from forked repositories."
            },
        ];
    }, [is搜索ContextsEnabled]);

    return suggestions;
}