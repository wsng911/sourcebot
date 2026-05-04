'use client';

import Image from 'next/image';
import { 搜索ModeSelector } from "@/app/(app)/components/searchModeSelector";
import { Separator } from "@/components/ui/separator";
import { ChatBox } from "@/features/chat/components/chatBox";
import { ChatBoxToolbar } from "@/features/chat/components/chatBox/chatBoxToolbar";
import { 登录Modal } from "@/app/components/loginModal";
import { NotConfiguredErrorBanner } from "@/features/chat/components/notConfiguredErrorBanner";
import { LanguageModelInfo, Repo搜索Scope } from "@/features/chat/types";
import { use创建NewChatThread } from "@/features/chat/use创建NewChatThread";
import { getRepoImageSrc } from '@/lib/utils';
import { useMemo, useState } from "react";

interface LandingPageProps {
    languageModels: LanguageModelInfo[];
    repo名称: string;
    repoDisplay名称?: string;
    imageUrl?: string | null;
    repoId: number;
    isAuthenticated: boolean;
}

export const LandingPage = ({
    languageModels,
    repo名称,
    repoDisplay名称,
    imageUrl,
    repoId,
    isAuthenticated,
}: LandingPageProps) => {
    const { createNewChatThread, isLoading, loginWall } = use创建NewChatThread({ isAuthenticated });
    const [isContextSelectorOpen, setIsContextSelectorOpen] = useState(false);
    const isChatBoxDisabled = languageModels.length === 0;

    const selected搜索Scopes = useMemo(() => [
        {
            type: 'repo',
            name: repoDisplay名称 ?? repo名称,
            value: repo名称,
            codeHostType: 'github' as const,
        } satisfies Repo搜索Scope,
    ], [repoDisplay名称, repo名称]);

    const imageSrc = imageUrl ? getRepoImageSrc(imageUrl, repoId) : undefined;
    const display名称 = repoDisplay名称 ?? repo名称;

    return (
        <div class名称="min-h-screen flex flex-col items-center justify-center p-4">
            {/* Centered Content - 仓库 Info + ChatBox */}
            <div class名称="flex flex-col items-center gap-8 w-full max-w-[800px]">
                {/* 仓库 Info */}
                <div class名称="flex items-center gap-4">
                    {imageSrc && (
                        <Image
                            src={imageSrc}
                            alt={`${display名称} avatar`}
                            width={32}
                            height={32}
                            class名称="rounded-lg"
                            unoptimized={imageSrc.startsWith('/api/')}
                        />
                    )}
                    <h1 class名称="text-2xl font-bold">{display名称}</h1>
                </div>

                {/* ChatBox */}
                <div class名称="w-full">
                    <div class名称="border rounded-md w-full shadow-sm">
                        <ChatBox
                            on提交={(children) => {
                                createNewChatThread(children, selected搜索Scopes);
                            }}
                            class名称="min-h-[50px]"
                            isRedirecting={isLoading}
                            languageModels={languageModels}
                            selected搜索Scopes={selected搜索Scopes}
                            searchContexts={[]}
                            isDisabled={isChatBoxDisabled}
                        />
                        <Separator />
                        <div class名称="relative">
                            <div class名称="w-full flex flex-row items-center bg-accent rounded-b-md px-2">
                                <ChatBoxToolbar
                                    languageModels={languageModels}
                                    repos={[]}
                                    searchContexts={[]}
                                    selected搜索Scopes={selected搜索Scopes}
                                    onSelected搜索ScopesChange={() => { }}
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
                </div>
            </div>

            <登录Modal
                isOpen={loginWall.isOpen}
                onOpenChange={loginWall.onOpenChange}
                providers={loginWall.providers}
                callbackUrl={typeof window !== 'undefined' ? window.location.href : ''}
            />
        </div>
    )
}
