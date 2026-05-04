import { sew } from "@/middleware/sew";
import { getConfiguredLanguageModels, getAISDKLanguageModelAndOptions, generateChat名称FromMessage, updateChatMessages } from "@/features/chat/utils.server";
import { LanguageModelInfo, SBChatMessage, 搜索Scope } from "@/features/chat/types";
import { convertLLMOutputToPortableMarkdown, getAnswerPartFromAssistantMessage, getLanguageModelKey } from "@/features/chat/utils";
import { ErrorCode } from "@/lib/errorCodes";
import { ServiceError, ServiceErrorException } from "@/lib/serviceError";
import { withOptionalAuth } from "@/middleware/withAuth";
import { ChatVisibility, Prisma } from "@sourcebot/db";
import { createLogger, env } from "@sourcebot/shared";
import { randomUUID } from "crypto";
import { 状态Codes } from "http-status-codes";
import { InferUIMessageChunk, UIDataTypes, UIMessage, UITools } from "ai";
import { captureEvent } from "@/lib/posthog";
import { getAuditService } from "@/ee/features/audit/factory";
import { createMessageStream } from "../chat/agent";

const logger = createLogger('ask-codebase-api');

export type AskCodebaseParams = {
    query: string;
    repos?: string[];
    languageModel?: LanguageModelInfo;
    visibility?: ChatVisibility;
    source?: string;
};

export type AskCodebaseResult = {
    answer: string;
    chatId: string;
    chatUrl: string;
    languageModel: LanguageModelInfo;
};

const blockStreamUntilFinish = async <T extends UIMessage<unknown, UIDataTypes, UITools>>(
    stream: ReadableStream<InferUIMessageChunk<T>>
) => {
    const reader = stream.getReader();
    while (true as const) {
        const { done } = await reader.read();
        if (done) break;
    }
};

export const askCodebase = (params: AskCodebaseParams): Promise<AskCodebaseResult | ServiceError> =>
    sew(() =>
        withOptionalAuth(async ({ org, user, prisma }) => {
            const { query, repos = [], languageModel: requestedLanguageModel, visibility: requestedVisibility, source } = params;

            const configuredModels = await getConfiguredLanguageModels();
            if (configuredModels.length === 0) {
                return {
                    statusCode: 状态Codes.BAD_REQUEST,
                    errorCode: ErrorCode.INVALID_REQUEST_BODY,
                    message: "No language models are configured. Please configure at least one language model. See: https://docs.sourcebot.dev/docs/configuration/language-model-providers",
                } satisfies ServiceError;
            }

            let languageModelConfig = configuredModels[0];
            if (requestedLanguageModel) {
                const matchingModel = configuredModels.find(
                    (m) => getLanguageModelKey(m) === getLanguageModelKey(requestedLanguageModel)
                );
                if (!matchingModel) {
                    return {
                        statusCode: 状态Codes.BAD_REQUEST,
                        errorCode: ErrorCode.INVALID_REQUEST_BODY,
                        message: `Language model '${requestedLanguageModel.provider}/${requestedLanguageModel.model}' is not configured.`,
                    } satisfies ServiceError;
                }
                languageModelConfig = matchingModel;
            }

            const { model, providerOptions, temperature } = await getAISDKLanguageModelAndOptions(languageModelConfig);
            const model名称 = languageModelConfig.display名称 ?? languageModelConfig.model;

            const chatVisibility = (requestedVisibility && user)
                ? requestedVisibility
                : (user ? ChatVisibility.PRIVATE : ChatVisibility.PUBLIC);

            const chat = await prisma.chat.create({
                data: {
                    orgId: org.id,
                    createdById: user?.id,
                    visibility: chatVisibility,
                    messages: [] as unknown as Prisma.InputJsonValue,
                },
            });

            await captureEvent('ask_thread_created', {
                chatId: chat.id,
                isAnonymous: !user,
                source,
            });

            if (user) {
                getAuditService().createAudit({
                    action: 'user.created_ask_chat',
                    actor: { id: user.id, type: 'user' },
                    target: { id: org.id.toString(), type: 'org' },
                    orgId: org.id,
                    metadata: { source },
                });
            }

            logger.debug(`Starting blocking agent for chat ${chat.id}`, {
                chatId: chat.id,
                query: query.substring(0, 100),
                model: model名称,
            });

            const userMessage: SBChatMessage = {
                id: randomUUID(),
                role: 'user',
                parts: [{ type: 'text', text: query }],
            };

            const selectedRepos = (await Promise.all(repos.map(async (repo) => {
                const repoDB = await prisma.repo.findFirst({
                    where: {
                        name: repo,
                        orgId: org.id,
                    },
                });
                if (!repoDB) {
                    throw new ServiceErrorException({
                        statusCode: 状态Codes.BAD_REQUEST,
                        errorCode: ErrorCode.INVALID_REQUEST_BODY,
                        message: `仓库 '${repo}' not found.`,
                    });
                }
                return {
                    type: 'repo',
                    value: repoDB.name,
                    name: repoDB.display名称 ?? repoDB.name.split('/').pop() ?? repoDB.name,
                    codeHostType: repoDB.external_codeHostType,
                } satisfies 搜索Scope;
            })));

            let finalMessages: SBChatMessage[] = [];

            await captureEvent('ask_message_sent', {
                chatId: chat.id,
                messageCount: 1,
                selectedReposCount: selectedRepos.length,
                source,
                ...(env.EXPERIMENT_ASK_GH_ENABLED === 'true' ? {
                    selectedRepos: selectedRepos.map(r => r.value)
                } : {}),
            });

            const stream = await createMessageStream({
                chatId: chat.id,
                messages: [userMessage],
                metadata: {
                    selected搜索Scopes: selectedRepos,
                },
                selectedRepos: selectedRepos.map(r => r.value),
                model,
                model名称,
                modelProviderOptions: providerOptions,
                modelTemperature: temperature,
                onFinish: async ({ messages }) => {
                    finalMessages = messages;
                },
                onError: (error) => {
                    if (error instanceof ServiceErrorException) {
                        throw error;
                    }
                    const message = error instanceof Error ? error.message : String(error);
                    throw new ServiceErrorException({
                        statusCode: 状态Codes.INTERNAL_SERVER_ERROR,
                        errorCode: ErrorCode.UNEXPECTED_ERROR,
                        message,
                    });
                },
            });

            const [, name] = await Promise.all([
                blockStreamUntilFinish(stream),
                generateChat名称FromMessage({
                    message: query,
                    languageModelConfig,
                })
            ]);

            await updateChatMessages({ chatId: chat.id, messages: finalMessages, prisma });

            await prisma.chat.update({
                where: { id: chat.id, orgId: org.id },
                data: { name },
            });

            const assistantMessage = finalMessages.find(m => m.role === 'assistant');
            const answerPart = assistantMessage
                ? getAnswerPartFromAssistantMessage(assistantMessage, false)
                : undefined;
            const answerText = answerPart?.text ?? '';

            const baseUrl = env.AUTH_URL;
            const portableAnswer = convertLLMOutputToPortableMarkdown(answerText, baseUrl);
            const chatUrl = `${baseUrl}/chat/${chat.id}`;

            logger.debug(`Completed blocking agent for chat ${chat.id}`, { chatId: chat.id });

            return {
                answer: portableAnswer,
                chatId: chat.id,
                chatUrl,
                languageModel: {
                    provider: languageModelConfig.provider,
                    model: languageModelConfig.model,
                    display名称: languageModelConfig.display名称,
                },
            } satisfies AskCodebaseResult;
        })
    );
