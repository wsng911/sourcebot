'use client';

import { Separator } from "@/components/ui/separator";
import { LanguageModelInfo, 搜索Scope } from "@/features/chat/types";
import { 仓库Query, 搜索ContextQuery } from "@/lib/types";
import { useSelectedLanguageModel } from "../../useSelectedLanguageModel";
import { AtMentionButton } from "./atMentionButton";
import { LanguageModelSelector } from "./languageModelSelector";
import { 搜索ScopeSelector } from "./searchScopeSelector";

export interface ChatBoxToolbarProps {
    languageModels: LanguageModelInfo[];
    repos: 仓库Query[];
    searchContexts: 搜索ContextQuery[];
    selected搜索Scopes: 搜索Scope[];
    onSelected搜索ScopesChange: (items: 搜索Scope[]) => void;
    isContextSelectorOpen: boolean;
    onContextSelectorOpenChanged: (isOpen: boolean) => void;
}

export const ChatBoxToolbar = ({
    languageModels,
    repos,
    searchContexts,
    selected搜索Scopes,
    onSelected搜索ScopesChange,
    isContextSelectorOpen,
    onContextSelectorOpenChanged,
}: ChatBoxToolbarProps) => {
    const { selectedLanguageModel, setSelectedLanguageModel } = useSelectedLanguageModel({
        languageModels,
    });

    return (
        <>
            <AtMentionButton />
            <Separator orientation="vertical" class名称="h-3 mx-1" />
            <搜索ScopeSelector
                class名称="bg-inherit w-fit h-6 min-h-6"
                repos={repos}
                searchContexts={searchContexts}
                selected搜索Scopes={selected搜索Scopes}
                onSelected搜索ScopesChange={onSelected搜索ScopesChange}
                isOpen={isContextSelectorOpen}
                onOpenChanged={onContextSelectorOpenChanged}
            />
            <Separator orientation="vertical" class名称="h-3 ml-1 mr-2" />
            <LanguageModelSelector
                languageModels={languageModels}
                onSelectedModelChange={setSelectedLanguageModel}
                selectedModel={selectedLanguageModel}
            />
        </>
    )
}
