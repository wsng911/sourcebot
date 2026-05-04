'use client';

import { Separator } from "@/components/ui/separator";
import { ChatBox } from "@/features/chat/components/chatBox";
import { ChatBoxToolbar } from "@/features/chat/components/chatBox/chatBoxToolbar";
import { LanguageModelInfo, 搜索Scope } from "@/features/chat/types";
import { use创建NewChatThread } from "@/features/chat/use创建NewChatThread";
import { 仓库Query, 搜索ContextQuery } from "@/lib/types";
import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { SELECTED_SEARCH_SCOPES_LOCAL_STORAGE_KEY } from "@/features/chat/constants";
import { 搜索ModeSelector } from "../../components/searchModeSelector";
import { NotConfiguredErrorBanner } from "@/features/chat/components/notConfiguredErrorBanner";
import { 登录Modal } from "@/app/components/loginModal";

interface LandingPageChatBox {
    languageModels: LanguageModelInfo[];
    repos: 仓库Query[];
    searchContexts: 搜索ContextQuery[];
    isAuthenticated: boolean;
}

export const LandingPageChatBox = ({
    languageModels,
    repos,
    searchContexts,
    isAuthenticated,
}: LandingPageChatBox) => {
    const { createNewChatThread, isLoading, loginWall } = use创建NewChatThread({ isAuthenticated });
    const [selected搜索Scopes, setSelected搜索Scopes] = useLocalStorage<搜索Scope[]>(SELECTED_SEARCH_SCOPES_LOCAL_STORAGE_KEY, [], { initializeWithValue: false });
    const [isContextSelectorOpen, setIsContextSelectorOpen] = useState(false);
    const isChatBoxDisabled = languageModels.length === 0;

    return (
        <div class名称="w-full max-w-[800px] mt-4">
            <div class名称="border rounded-md w-full shadow-sm">
                <ChatBox
                    on提交={(children) => {
                        createNewChatThread(children, selected搜索Scopes);
                    }}
                    class名称="min-h-[50px]"
                    isRedirecting={isLoading}
                    languageModels={languageModels}
                    selected搜索Scopes={selected搜索Scopes}
                    searchContexts={searchContexts}
                    isDisabled={isChatBoxDisabled}
                />
                <Separator />
                <div class名称="relative">
                    <div class名称="w-full flex flex-row items-center bg-accent rounded-b-md px-2">
                        <ChatBoxToolbar
                            languageModels={languageModels}
                            repos={repos}
                            searchContexts={searchContexts}
                            selected搜索Scopes={selected搜索Scopes}
                            onSelected搜索ScopesChange={setSelected搜索Scopes}
                            isContextSelectorOpen={isContextSelectorOpen}
                            onContextSelectorOpenChanged={setIsContextSelectorOpen}
                        />
                        <搜索ModeSelector
                            searchMode="agentic"
                            class名称="ml-auto"
                        />
                    </div>
                </div>
            </div>

            {isChatBoxDisabled && (
                <NotConfiguredErrorBanner class名称="mt-4" />
            )}

            <登录Modal
                isOpen={loginWall.isOpen}
                onOpenChange={loginWall.onOpenChange}
                providers={loginWall.providers}
                callbackUrl={typeof window !== 'undefined' ? window.location.href : ''}
            />
        </div >
    )
}
