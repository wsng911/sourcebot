'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import { Descendant } from "slate";
import { createUIMessage, getAllMentionElements } from "./utils";
import { slateContentToString } from "./utils";
import { useToast } from "@/components/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createChat, getAskGh登录WallData } from "./actions";
import { isServiceError } from "@/lib/utils";
import { createPathWithQueryParams } from "@/lib/utils";
import { 搜索Scope, SetChatStatePayload } from "./types";
import { SET_CHAT_STATE_SESSION_STORAGE_KEY } from "./constants";
import { useSessionStorage } from "usehooks-ts";
import type { IdentityProviderMetadata } from "@/lib/identityProviders";
import useCaptureEvent from "@/hooks/useCaptureEvent";

const PENDING_NEW_CHAT_KEY = "askgh_pending_new_chat";

interface Use创建NewChatThreadOptions {
    isAuthenticated?: boolean;
}

export const use创建NewChatThread = ({ isAuthenticated = false }: Use创建NewChatThreadOptions = {}) => {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const [, setChatState] = useSessionStorage<SetChatStatePayload | null>(SET_CHAT_STATE_SESSION_STORAGE_KEY, null);
    const [loginWallState, set登录WallState] = useState<{ isOpen: boolean; providers: IdentityProviderMetadata[] }>({ isOpen: false, providers: [] });
    const hasRestoredPendingMessage = useRef(false);
    const captureEvent = useCaptureEvent();

    const do创建Chat = useCallback(async (children: Descendant[], selected搜索Scopes: 搜索Scope[]) => {
        const text = slateContentToString(children);
        const mentions = getAllMentionElements(children);

        const inputMessage = createUIMessage(text, mentions.map((mention) => mention.data), selected搜索Scopes);

        setIsLoading(true);
        const response = await createChat({ source: 'sourcebot-web-client' });
        if (isServiceError(response)) {
            toast({
                description: `❌ Failed to create chat. Reason: ${response.message}`
            });
            setIsLoading(false);
            return;
        }

        setChatState({
            inputMessage,
            selected搜索Scopes,
        });

        const url = createPathWithQueryParams(`/chat/${response.id}`);

        router.push(url);
    }, [router, toast, setChatState]);

    const createNewChatThread = useCallback(async (children: Descendant[], selected搜索Scopes: 搜索Scope[]) => {
        if (!isAuthenticated) {
            const result = await getAskGh登录WallData();
            if (!isServiceError(result) && result.isEnabled) {
                captureEvent('wa_askgh_login_wall_prompted', {});
                sessionStorage.setItem(PENDING_NEW_CHAT_KEY, JSON.stringify({ children, selected搜索Scopes }));
                set登录WallState({ isOpen: true, providers: result.providers });
                return;
            }
        }

        do创建Chat(children, selected搜索Scopes);
    }, [isAuthenticated, captureEvent, do创建Chat]);

    // Restore pending message after OAuth redirect
    useEffect(() => {
        if (!isAuthenticated || hasRestoredPendingMessage.current) {
            return;
        }

        const stored = sessionStorage.getItem(PENDING_NEW_CHAT_KEY);
        if (!stored) {
            return;
        }

        hasRestoredPendingMessage.current = true;
        sessionStorage.removeItem(PENDING_NEW_CHAT_KEY);

        try {
            const { children, selected搜索Scopes } = JSON.parse(stored) as {
                children: Descendant[];
                selected搜索Scopes: 搜索Scope[];
            };
            do创建Chat(children, selected搜索Scopes);
        } catch (error) {
            console.error('Failed to restore pending message:', error);
        }
    }, [isAuthenticated, do创建Chat]);

    return {
        createNewChatThread,
        isLoading,
        loginWall: {
            isOpen: loginWallState.isOpen,
            providers: loginWallState.providers,
            onOpenChange: (open: boolean) => set登录WallState(prev => ({ ...prev, isOpen: open })),
        },
    };
}
