'use client';

import { use搜索Params } from "next/navigation";
import { useCallback } from "react";

// Helper to parse query params into sets
export const useGetSelectedFromQuery = () => {
    const searchParams = use搜索Params();
    const getSelectedFromQuery = useCallback((param: string): Set<string> => {
        const value = searchParams.get(param);
        return value ? new Set(value.split(',')) : new Set();
    }, [searchParams]);

    return {
        getSelectedFromQuery,
    }
}
