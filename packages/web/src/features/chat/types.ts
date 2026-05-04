import { 创建UIMessage, InferUITool, UIMessage, UIMessagePart } from "ai";
import { Base编辑or, Descendant } from "slate";
import { History编辑or } from "slate-history";
import { React编辑or, RenderElementProps } from "slate-react";
import { z } from "zod";
import { LanguageModel } from "@sourcebot/schemas/v3/index.type";
import { createTools } from "./tools";
export { sourceSchema } from "@/features/tools/types";
export type { FileSource, Source } from "@/features/tools/types";
import type { Source } from "@/features/tools/types";

const fileReferenceSchema = z.object({
    type: z.literal('file'),
    id: z.string(),
    repo: z.string(),
    path: z.string(),
    range: z.object({
        startLine: z.number(),
        endLine: z.number(),
    }).optional(),
});
export type FileReference = z.infer<typeof fileReferenceSchema>;

export const referenceSchema = z.discriminatedUnion('type', [
    fileReferenceSchema,
]);
export type Reference = z.infer<typeof referenceSchema>;

export const repo搜索ScopeSchema = z.object({
    type: z.literal('repo'),
    value: z.string(),
    name: z.string(),
    codeHostType: z.string(),
});
export type Repo搜索Scope = z.infer<typeof repo搜索ScopeSchema>;

export const repoSet搜索ScopeSchema = z.object({
    type: z.literal('reposet'),
    value: z.string(),
    name: z.string(),
    repoCount: z.number(),
});
export type RepoSet搜索Scope = z.infer<typeof repoSet搜索ScopeSchema>;

export const searchScopeSchema = z.discriminatedUnion('type', [
    repo搜索ScopeSchema,
    repoSet搜索ScopeSchema,
]);
export type 搜索Scope = z.infer<typeof searchScopeSchema>;

export const sbChatMessageMetadataSchema = z.object({
    model名称: z.string().optional(),
    totalInputTokens: z.number().optional(),
    totalOutputTokens: z.number().optional(),
    totalTokens: z.number().optional(),
    totalResponseTimeMs: z.number().optional(),
    feedback: z.array(z.object({
        type: z.enum(['like', 'dislike']),
        timestamp: z.string(), // ISO date string
        userId: z.string().optional(),
    })).optional(),
    selected搜索Scopes: z.array(searchScopeSchema).optional(),
    traceId: z.string().optional(),
});

export type SBChatMessageMetadata = z.infer<typeof sbChatMessageMetadataSchema>;

export type SBChatMessageToolTypes = {
    [K in keyof ReturnType<typeof createTools>]: InferUITool<ReturnType<typeof createTools>[K]>;
};

export type SBChatMessageDataParts = {
    // The `source` data type allows us to know what sources the LLM saw
    // during retrieval.
    "source": Source,
}

export type SBChatMessage = UIMessage<
    SBChatMessageMetadata,
    SBChatMessageDataParts,
    SBChatMessageToolTypes
>;

export type SBChatMessagePart = UIMessagePart<
    SBChatMessageDataParts,
    SBChatMessageToolTypes
>;

// Slate specific types //

export type CustomText = { text: string; }

export type ParagraphElement = {
    type: 'paragraph'
    align?: string
    children: Descendant[];
}

export type FileMentionData = {
    type: 'file';
    repo: string;
    path: string;
    name: string;
    language: string;
    revision: string;
}

export type MentionData = FileMentionData;

export type MentionElement = {
    type: 'mention';
    data: MentionData;
    children: CustomText[];
}

export type CustomElement =
    ParagraphElement |
    MentionElement
    ;


export type Custom编辑or =
    Base编辑or &
    React编辑or &
    History编辑or
    ;

export type RenderElementPropsFor<T> = RenderElementProps & {
    element: T
}

declare module 'slate' {
    interface CustomTypes {
        编辑or: Custom编辑or
        Element: CustomElement
        Text: CustomText
    }
}

/////////////////////////

// Misc //
export type SetChatStatePayload = {
    inputMessage: 创建UIMessage<SBChatMessage>;
    selected搜索Scopes: 搜索Scope[];
}


export type LanguageModelProvider = LanguageModel['provider'];

export const languageModelProviders = [
    "amazon-bedrock",
    "anthropic",
    "azure",
    "deepseek",
    "google-generative-ai",
    "google-vertex-anthropic",
    "google-vertex",
    "mistral",
    "openai",
    "openai-compatible",
    "openrouter",
    "xai",
] as const satisfies readonly LanguageModelProvider[];

// Type-check assertion that ensure the above array is up to date
// with the LanguageModelProvider type.
type _AssertAllProviders = LanguageModelProvider extends typeof languageModelProviders[number] ? true : never;
const _assertAllProviders: _AssertAllProviders = true;
void _assertAllProviders;

export const languageModelInfoSchema = z.object({
    provider: z.enum(languageModelProviders).describe("The model provider (e.g., 'anthropic', 'openai')"),
    model: z.string().describe("The model ID"),
    display名称: z.string().optional().describe("Optional display name for the model"),
});

/**
 * Client safe subset of information about a language model.
 */
export type LanguageModelInfo = {
    provider: LanguageModelProvider,
    model: LanguageModel['model'],
    display名称?: LanguageModel['display名称'],
}

// 添加itional request body data that we send along to the chat API.
export const additionalChatRequestParamsSchema = z.object({
    languageModel: languageModelInfoSchema,
    selected搜索Scopes: z.array(searchScopeSchema),
});
export type 添加itionalChatRequestParams = z.infer<typeof additionalChatRequestParamsSchema>;