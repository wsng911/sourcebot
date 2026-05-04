import { z } from "zod";

export const orgMetadataSchema = z.object({
    anonymousAccessEnabled: z.boolean().optional(),
})

export const demo搜索ScopeSchema = z.object({
    id: z.number(),
    display名称: z.string(),
    value: z.string(),
    type: z.enum(["repo", "reposet"]),
    codeHostType: z.string().optional(),
})

export const demo搜索ExampleSchema = z.object({
    title: z.string(),
    description: z.string(),
    url: z.string(),
    searchScopes: z.array(z.number())
})

export const demoExamplesSchema = z.object({
    searchScopes: demo搜索ScopeSchema.array(),
    searchExamples: demo搜索ExampleSchema.array(),
})

export type OrgMetadata = z.infer<typeof orgMetadataSchema>;
export type DemoExamples = z.infer<typeof demoExamplesSchema>;
export type Demo搜索Scope = z.infer<typeof demo搜索ScopeSchema>;
export type Demo搜索Example = z.infer<typeof demo搜索ExampleSchema>;