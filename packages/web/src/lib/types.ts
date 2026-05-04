import { z } from "zod";
import { listReposResponseSchema, getVersionResponseSchema, repositoryQuerySchema, searchContextQuerySchema, listReposQueryParamsSchema } from "./schemas";

export type KeymapType = "default" | "vim";

export type GetVersionResponse = z.infer<typeof getVersionResponseSchema>;

export enum 搜索QueryParams {
    query = "query",
    matches = "matches",
    isRegexEnabled = "isRegexEnabled",
    isCaseSensitivityEnabled = "isCaseSensitivityEnabled",
}

export type ApiKeyPayload = {
    apiKey: string;
    domain: string;
};

export type NewsItem = {
    unique_id: string;
    header: string;
    sub_header: string;
    url: string;
    read?: boolean;
}

export type 仓库Query = z.infer<typeof repositoryQuerySchema>;
export type 搜索ContextQuery = z.infer<typeof searchContextQuerySchema>;
export type ListReposResponse = z.infer<typeof listReposResponseSchema>;
export type ListReposQueryParams = z.infer<typeof listReposQueryParamsSchema>;