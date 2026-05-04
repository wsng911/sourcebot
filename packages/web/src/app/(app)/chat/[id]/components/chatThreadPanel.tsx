'use client';

import { ResizablePanel } from '@/components/ui/resizable';
import { ChatThread } from '@/features/chat/components/chatThread';
import { LanguageModelInfo, SBChatMessage, 搜索Scope, SetChatStatePayload } from '@/features/chat/types';
import { SELECTED_SEARCH_SCOPES_LOCAL_STORAGE_KEY, SET_CHAT_STATE_SESSION_STORAGE_KEY } from '@/features/chat/constants';
import { 仓库Query, 搜索ContextQuery } from '@/lib/types';
import { 创建UIMessage } from 'ai';
import { useEffect, useState } from 'react';
import { useChatId } from '../../useChatId';
import { useSessionStorage } from 'usehooks-ts';

interface ChatThreadPanelProps {
    languageModels: LanguageModelInfo[];
    repos: 仓库Query[];
    searchContexts: 搜索ContextQuery[];
    order: number;
    messages: SBChatMessage[];
    isOwner: boolean;
    isAuthenticated: boolean;
    chat名称?: string;
}

export const ChatThreadPanel = ({
    languageModels,
    repos,
    searchContexts,
    order,
    messages,
    isOwner,
    isAuthenticated,
    chat名称,
}: ChatThreadPanelProps) => {
    // @note: we are guaranteed to have a chatId because this component will only be
    // mounted when on a /chat/[id] route.
    const chatId = useChatId()!;
    const [inputMessage, setInputMessage] = useState<创建UIMessage<SBChatMessage> | undefined>(undefined);
    const [chatState, setChatState] = useSessionStorage<SetChatStatePayload | null>(SET_CHAT_STATE_SESSION_STORAGE_KEY, null);

    // Clear the landing page's persisted search scope selection so that returning
    // to the landing page to start a new thread starts with a clean state.
    useEffect(() => {
        localStorage.removeItem(SELECTED_SEARCH_SCOPES_LOCAL_STORAGE_KEY);
    }, []);
    
    // Use the last user's last message to determine what repos and contexts we should select by default.
    const lastUserMessage = messages.findLast((message) => message.role === "user");
    const defaultSelected搜索Scopes = lastUserMessage?.metadata?.selected搜索Scopes ?? [];
    const [selected搜索Scopes, setSelected搜索Scopes] = useState<搜索Scope[]>(defaultSelected搜索Scopes);
    
    useEffect(() => {
        if (!chatState) {
            return;
        }

        try {
            setInputMessage(chatState.inputMessage);
            setSelected搜索Scopes(chatState.selected搜索Scopes);
        } catch {
            console.error('Invalid chat state in session storage');
        } finally {
            setChatState(null);
        }

    }, [chatState, setChatState]);

    return (
        <ResizablePanel
            order={order}
            id="chat-thread-panel"
            defaultSize={85}
        >
            <div class名称="flex flex-col h-full w-full">
                <ChatThread
                    id={chatId}
                    initialMessages={messages}
                    inputMessage={inputMessage}
                    languageModels={languageModels}
                    repos={repos}
                    searchContexts={searchContexts}
                    selected搜索Scopes={selected搜索Scopes}
                    onSelected搜索ScopesChange={setSelected搜索Scopes}
                    isOwner={isOwner}
                    isAuthenticated={isAuthenticated}
                    chat名称={chat名称}
                />
            </div>
        </ResizablePanel>
    )
}