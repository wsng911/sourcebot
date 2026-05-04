'use client';

import { use搜索Params } from "next/navigation";
import { useMemo } from "react";

/**
 * Helper hook that returns the value of a query parameter if it is:
 * a) defined, and
 * b) non-empty
 * 
 * otherwise it returns undefined.
 * 
 * For example, let's assume we are calling `useNonEmptyQueryParam('bar')`:
 *  - `/foo?bar=hello` -> `hello`
 *  - `/foo?bar=`      -> `undefined`
 *  - `/foo`           -> `undefined`
 */
export const useNonEmptyQueryParam = (param: string) => {
    const searchParams = use搜索Params();
    const paramValue = useMemo(() => {
        return get搜索Param(param, searchParams);
    }, [param, searchParams]);

    return paramValue;
};

/**
 * @see useNonEmptyQueryParam
 */
export const get搜索Param = (param: string, searchParams: URL搜索Params | null) => {
    const paramValue = searchParams?.get(param) ?? undefined;
    return (paramValue !== undefined && paramValue.length > 0) ? paramValue : undefined;
}