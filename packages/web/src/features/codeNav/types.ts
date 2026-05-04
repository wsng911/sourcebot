import { z } from "zod";
import { rangeSchema, repositoryInfoSchema } from "../search/types";

export const findRelatedSymbolsRequestSchema = z.object({
    symbol名称: z.string(),
    language: z.string().optional(),
    /**
     * Optional revision name to scope search to.
     * If not provided, the search will be scoped to HEAD.
     */
    revision名称: z.string().optional(),
    /**
     * Optional repository name to scope search to.
     * If not provided, the search will be across all repositories.
     */
    repo名称: z.string().optional(),
});
export type FindRelatedSymbolsRequest = z.infer<typeof findRelatedSymbolsRequestSchema>;

export const findRelatedSymbolsResponseSchema = z.object({
    stats: z.object({
        matchCount: z.number(),
    }),
    files: z.array(z.object({
        file名称: z.string(),
        repository: z.string(),
        repositoryId: z.number(),
        webUrl: z.string(),
        language: z.string(),
        matches: z.array(z.object({
            lineContent: z.string(),
            range: rangeSchema,
        }))
    })),
    repositoryInfo: z.array(repositoryInfoSchema),
});

export type FindRelatedSymbolsResponse = z.infer<typeof findRelatedSymbolsResponseSchema>;
