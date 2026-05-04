'use client';

import { useMemo } from "react";
import { useLocalStorage } from "usehooks-ts";

type 搜索 = {
    query: string;
    date: string;
}

export const use搜索History = () => {
    const [_searchHistory, set搜索History] = useLocalStorage<搜索[]>("searchHistory", []);

    const searchHistory = useMemo(() => {
        return _searchHistory.toSorted((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
    }, [_searchHistory]);

    return {
        searchHistory,
        set搜索History,
    }
}