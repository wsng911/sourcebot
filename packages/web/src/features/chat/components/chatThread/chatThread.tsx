'use client';

import { useToast } from '@/components/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CustomSlate编辑or } from '@/features/chat/customSlate编辑or';
import { 添加itionalChatRequestParams, Custom编辑or, LanguageModelInfo, SBChatMessage, 搜索Scope, Source } from '@/features/chat/types';
import { createUIMessage, getAllMentionElements, reset编辑or, slateContentToString } from '@/features/chat/utils';
import { useChat } from '@ai-sdk/react';
import { 创建UIMessage, DefaultChatTransport } from 'ai';
import { ArrowDownIcon, 复制Icon } from 'lucide-react';
import { useNavigationGuard } from 'next-navigation-guard';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useStickToBottom } from 'use-stick-to-bottom';
import { Descendant } from 'slate';
import { useMessagePairs } from '../../useMessagePairs';
import { useSelectedLanguageModel } from '../../useSelectedLanguageModel';
import { ChatBox } from '../chatBox';
import { ChatBoxToolbar } from '../chatBox/chatBoxToolbar';
import { ChatThreadListItem } from './chatThreadListItem';
import { ErrorBanner } from './errorBanner';
import { useRouter } from 'next/navigation';
import { usePrevious } from '@uidotdev/usehooks';
import { 仓库Query, 搜索ContextQuery } from '@/lib/types';
import { duplicateChat, generateAndUpdateChat名称FromMessage } from '../../actions';
import { isServiceError } from '@/lib/utils';
import { NotConfiguredErrorBanner } from '../notConfiguredErrorBanner';
import useCaptureEvent from '@/hooks/useCaptureEvent';
import { SignInPromptBanner } from './signInPromptBanner';
import { DuplicateChatDialog } from '@/app/(app)/chat/components/duplicateChatDialog';
import { 登录Modal } from '@/app/components/loginModal';
import type { IdentityProviderMetadata } from '@/lib/identityProviders';
import { getAskGh登录WallData } from '../../actions';

type ChatHistoryState = {
    scrollOffset?: number;
}

const PENDING_MESSAGE_STORAGE_KEY = "askgh_chat_pending_message";

interface ChatThreadProps {
    id?: string | undefined;
    initialMessages?: SBChatMessage[];
    inputMessage?: 创建UIMessage<SBChatMessage>;
    languageModels: LanguageModelInfo[];
    repos: 仓库Query[];
    searchContexts: 搜索ContextQuery[];
    selected搜索Scopes: 搜索Scope[];
    onSelected搜索ScopesChange: (items: 搜索Scope[]) => void;
    isOwner?: boolean;
    isAuthenticated?: boolean;
    chat名称?: string;
}

export const ChatThread = ({
    id: defaultChatId,
    initialMessages,
    inputMessage,
    languageModels,
    repos,
    searchContexts,
    selected搜索Scopes,
    onSelected搜索ScopesChange,
    isOwner = true,
    isAuthenticated = false,
    chat名称,
}: ChatThreadProps) => {
    const [isErrorBannerVisible, setIsErrorBannerVisible] = useState(false);
    const has提交tedInputMessage = useRef(false);
    const { scrollRef, contentRef, scrollToBottom, isAtBottom } = useStickToBottom({ initial: false });
    const { toast } = useToast();
    const router = useRouter();
    const [isContextSelectorOpen, setIsContextSelectorOpen] = useState(false);
    const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);
    const [is登录ModalOpen, setIs登录ModalOpen] = useState(false);
    const [loginWallProviders, set登录WallProviders] = useState<IdentityProviderMetadata[]>([]);
    const hasRestoredPendingMessage = useRef(false);
    const captureEvent = useCaptureEvent();

    // Initial state is from attachments that exist in in the chat history.
    const [sources, setSources] = useState<Source[]>(
        initialMessages?.flatMap((message) =>
            message.parts
                .filter((part) => part.type === 'data-source')
                .map((part) => part.data)
        ) ?? []
    );

    const { selectedLanguageModel } = useSelectedLanguageModel({
        languageModels,
    });

    const {
        messages,
        sendMessage: _sendMessage,
        error,
        status,
        stop,
        id: chatId,
    } = useChat<SBChatMessage>({
        id: defaultChatId,
        messages: initialMessages,
        transport: new DefaultChatTransport({
            api: '/api/chat',
            headers: {
                'X-Sourcebot-Client-Source': 'sourcebot-web-client',
            },
        }),
        onData: (dataPart) => {
            // Keeps sources added by the assistant in sync.
            if (dataPart.type === 'data-source') {
                setSources((prev) => [...prev, dataPart.data]);
            }
        }
    });

    const sendMessage = useCallback((message: 创建UIMessage<SBChatMessage>) => {
        if (!selectedLanguageModel) {
            toast({
                description: "Failed to send message. No language model selected.",
                variant: "destructive",
            });
            return;
        }

        // Keeps sources added by the user in sync.
        const sources = message.parts
            .filter((part) => part.type === 'data-source')
            .map((part) => part.data);
        setSources((prev) => [...prev, ...sources]);

        _sendMessage(message, {
            body: {
                selected搜索Scopes,
                languageModel: selectedLanguageModel,
            } satisfies 添加itionalChatRequestParams,
        });

        if (
            messages.length === 0 &&
            message.parts.length > 0 &&
            message.parts[0].type === 'text'
        ) {
            generateAndUpdateChat名称FromMessage(
                {
                    chatId,
                    languageModelId: selectedLanguageModel.model,
                    message: message.parts[0].text,
                },
            ).then((response) => {
                if (isServiceError(response)) {
                    toast({
                        description: `❌ Failed to generate chat name. Reason: ${response.message}`,
                        variant: "destructive",
                    });
                }
                // Refresh the page to update the chat name.
                router.refresh();
            });
        }
    }, [
        selectedLanguageModel,
        _sendMessage,
        selected搜索Scopes,
        messages.length,
        toast,
        chatId,
        router,
    ]);


    const messagePairs = useMessagePairs(messages);

    useNavigationGuard({
        enabled: ({ type }) => {
            // @note: a "refresh" in this context means we have triggered a client side
            // refresh via `router.refresh()`, and not the user pressing "CMD+R"
            // (that would be a "beforeunload" event). We can safely peform refreshes
            // without loosing any unsaved changes.
            if (type === "refresh") {
                return false;
            }

            return status === "streaming" || status === "submitted";
        },
        confirm: () => window.confirm("You have unsaved changes that will be lost."),
    });

    // When the chat is finished, refresh the page to update the chat history.
    const prev状态 = usePrevious(status);
    useEffect(() => {
        const wasPending = prev状态 === "submitted" || prev状态 === "streaming";
        const isFinished = status === "error" || status === "ready";

        if (wasPending && isFinished) {
            router.refresh();
        }
    }, [prev状态, status, router]);

    useEffect(() => {
        if (!inputMessage || has提交tedInputMessage.current) {
            return;
        }

        sendMessage(inputMessage);
        scrollToBottom();
        has提交tedInputMessage.current = true;
    }, [inputMessage, scrollToBottom, sendMessage]);

    // Restore pending message after OAuth redirect (askgh login wall)
    useEffect(() => {
        if (!isAuthenticated || !isOwner || hasRestoredPendingMessage.current) {
            return;
        }

        const stored = sessionStorage.getItem(PENDING_MESSAGE_STORAGE_KEY);
        if (!stored) {
            return;
        }

        hasRestoredPendingMessage.current = true;
        sessionStorage.removeItem(PENDING_MESSAGE_STORAGE_KEY);

        try {
            const { chatId: storedChatId, children } = JSON.parse(stored) as { chatId: string; children: Descendant[] };

            // Only restore if we're on the same chat that stored the pending message
            if (storedChatId !== chatId) {
                return;
            }

            const text = slateContentToString(children);
            const mentions = getAllMentionElements(children);
            const message = createUIMessage(text, mentions.map(({ data }) => data), selected搜索Scopes);
            sendMessage(message);
            scrollToBottom();
        } catch (error) {
            console.error('Failed to restore pending message:', error);
        }
    }, [isAuthenticated, isOwner, chatId, sendMessage, selected搜索Scopes, scrollToBottom]);

    // Track scroll position for history state restoration.
    useEffect(() => {
        const scrollElement = scrollRef.current;
        if (!scrollElement) {
            return;
        }

        let timeout: NodeJS.Timeout | null = null;

        const handleScroll = () => {
            const scrollOffset = scrollElement.scrollTop;

            if (timeout) {
                clearTimeout(timeout);
            }

            timeout = setTimeout(() => {
                history.replaceState(
                    {
                        scrollOffset,
                    } satisfies ChatHistoryState,
                    '',
                    window.location.href
                );
            }, 500);
        };

        scrollElement.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            scrollElement.removeEventListener('scroll', handleScroll);
            if (timeout) {
                clearTimeout(timeout);
            }
        };
    }, [scrollRef]);

    // Restore scroll position from history state on mount.
    useEffect(() => {
        const scrollElement = scrollRef.current;
        if (!scrollElement) {
            return;
        }

        // @hack: without this setTimeout, the scroll position would not be restored
        // at the correct position (it was slightly too high). The theory is that the
        // content hasn't fully rendered yet, so restoring the scroll position too
        // early results in weirdness. Waiting 10ms seems to fix the issue.
        setTimeout(() => {
            const { scrollOffset } = (history.state ?? {}) as ChatHistoryState;
            scrollElement.scrollTo({
                top: scrollOffset ?? 0,
                behavior: 'instant',
            });
        }, 10);
    }, [scrollRef]);


    // Keep the error state & banner visibility in sync.
    useEffect(() => {
        if (error) {
            setIsErrorBannerVisible(true);
        }
    }, [error]);

    const on提交 = useCallback(async (children: Descendant[], editor: Custom编辑or) => {
        if (!isAuthenticated) {
            const result = await getAskGh登录WallData();
            if (!isServiceError(result) && result.isEnabled) {
                captureEvent('wa_askgh_login_wall_prompted', {});
                sessionStorage.setItem(PENDING_MESSAGE_STORAGE_KEY, JSON.stringify({ chatId, children }));
                set登录WallProviders(result.providers);
                setIs登录ModalOpen(true);
                return;
            }
        }

        const text = slateContentToString(children);
        const mentions = getAllMentionElements(children);

        const message = createUIMessage(text, mentions.map(({ data }) => data), selected搜索Scopes);
        sendMessage(message);

        scrollToBottom();

        reset编辑or(editor);
    }, [sendMessage, selected搜索Scopes, isAuthenticated, captureEvent, chatId, scrollToBottom]);

    const onDuplicate = useCallback(async (new名称: string): Promise<string | null> => {
        if (!defaultChatId) {
            return null;
        }

        const result = await duplicateChat({ chatId: defaultChatId, new名称 });
        if (isServiceError(result)) {
            toast({
                description: `Failed to duplicate chat: ${result.message}`,
                variant: "destructive",
            });
            return null;
        }

        captureEvent('wa_chat_duplicated', { chatId: defaultChatId });
        router.push(`/chat/${result.id}`);
        return result.id;
    }, [defaultChatId, toast, router, captureEvent]);

    return (
        <>
            {error && (
                <ErrorBanner
                    error={error}
                    isVisible={isErrorBannerVisible}
                    on关闭={() => setIsErrorBannerVisible(false)}
                />
            )}

            <div class名称="relative h-full w-full p-4 overflow-hidden min-h-0">
                <div
                    ref={scrollRef}
                    class名称="h-full w-full overflow-y-auto overflow-x-hidden"
                >
                    <div ref={contentRef}>
                        {
                            messagePairs.length === 0 ? (
                                <div class名称="flex items-center justify-center text-center h-full min-h-full">
                                    <p class名称="text-muted-foreground">no messages</p>
                                </div>
                            ) : (
                                <>
                                    {messagePairs.map(([userMessage, assistantMessage], index) => {
                                        const isLastPair = index === messagePairs.length - 1;
                                        const isStreaming = isLastPair && (status === "streaming" || status === "submitted");
                                        // Use a stable key based on user message ID
                                        const key = userMessage.id;

                                        return (
                                            <Fragment key={key}>
                                                <ChatThreadListItem
                                                    index={index}
                                                    chatId={chatId}
                                                    userMessage={userMessage}
                                                    assistantMessage={assistantMessage}
                                                    isStreaming={isStreaming}
                                                    sources={sources}
                                                />
                                                {index !== messagePairs.length - 1 && (
                                                    <Separator class名称="my-12" />
                                                )}
                                            </Fragment>
                                        );
                                    })}
                                </>
                            )
                        }
                    </div>
                </div>
                {
                    (!isAtBottom && status === "streaming") && (
                        <div class名称="absolute bottom-5 left-0 right-0 h-10 flex flex-row items-center justify-center">
                            <Button
                                variant="outline"
                                size="icon"
                                class名称="rounded-full animate-bounce-slow h-8 w-8"
                                onClick={() => scrollToBottom('instant')}
                            >
                                <ArrowDownIcon class名称="w-4 h-4" />
                            </Button>
                        </div>
                    )
                }
            </div>
            <div class名称="w-full max-w-3xl mx-auto mb-8">
                <SignInPromptBanner
                    chatId={chatId}
                    isAuthenticated={isAuthenticated}
                    isOwner={isOwner}
                    hasMessages={messages.length > 0}
                    isStreaming={status === "streaming" || status === "submitted"}
                />
                {isOwner ? (
                    <>
                        {languageModels.length === 0 && (
                            <NotConfiguredErrorBanner class名称="mb-2" />
                        )}

                        <div class名称="border rounded-md w-full shadow-sm">
                            <CustomSlate编辑or>
                                <ChatBox
                                    on提交={on提交}
                                    class名称="min-h-[80px]"
                                    preferredSuggestionsBoxPlacement="top-start"
                                    isGenerating={status === "streaming" || status === "submitted"}
                                    onStop={stop}
                                    languageModels={languageModels}
                                    selected搜索Scopes={selected搜索Scopes}
                                    searchContexts={searchContexts}
                                    isDisabled={languageModels.length === 0}
                                />
                                <div class名称="w-full flex flex-row items-center bg-accent rounded-b-md px-2">
                                    <ChatBoxToolbar
                                        languageModels={languageModels}
                                        repos={repos}
                                        searchContexts={searchContexts}
                                        selected搜索Scopes={selected搜索Scopes}
                                        onSelected搜索ScopesChange={onSelected搜索ScopesChange}
                                        isContextSelectorOpen={isContextSelectorOpen}
                                        onContextSelectorOpenChanged={setIsContextSelectorOpen}
                                    />
                                </div>
                            </CustomSlate编辑or>
                        </div>
                    </>
                ) : (
                    <div class名称="flex flex-row items-center justify-center gap-3 p-4 border rounded-md bg-muted/50">
                        <p class名称="text-sm text-muted-foreground">This chat is read-only.</p>
                        <Button
                            variant="outline"
                            size="sm"
                            class名称="gap-2"
                            onClick={() => setIsDuplicateDialogOpen(true)}
                        >
                            <复制Icon class名称="h-4 w-4" />
                            Duplicate
                        </Button>
                        <DuplicateChatDialog
                            isOpen={isDuplicateDialogOpen}
                            onOpenChange={setIsDuplicateDialogOpen}
                            onDuplicate={onDuplicate}
                            current名称={chat名称 ?? 'Untitled chat'}
                        />
                    </div>
                )}
            </div>

            <登录Modal
                isOpen={is登录ModalOpen}
                onOpenChange={setIs登录ModalOpen}
                providers={loginWallProviders}
                callbackUrl={typeof window !== 'undefined' ? window.location.href : ''}
            />
        </>
    );
}
