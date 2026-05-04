'use client';

import { useMemo } from "react";
import { LanguageModelProvider } from "../../types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import anthropicLogo from "@/public/anthropic.svg";
import azureAiLogo from "@/public/azureai.svg";
import bedrockLogo from "@/public/bedrock.svg";
import geminiLogo from "@/public/gemini.svg";
import openaiLogo from "@/public/openai.svg";
import deepseekLogo from "@/public/deepseek.svg";
import mistralLogo from "@/public/mistral.svg";
import openrouterLogo from "@/public/openrouter.svg";
import xaiLogo from "@/public/xai.svg";
import { Box, LucideIcon } from "lucide-react";

interface ModelProviderLogoProps {
    provider: LanguageModelProvider;
    class名称?: string;
}

export const ModelProviderLogo = ({
    provider,
    class名称,
}: ModelProviderLogoProps) => {
    const { src, Icon, class名称: logoClass名称 } = useMemo((): { src?: string, Icon?: LucideIcon, class名称?: string } => {
        switch (provider) {
            case 'amazon-bedrock':
                return {
                    src: bedrockLogo,
                    class名称: 'dark:invert'
                };
            case 'anthropic':
                return {
                    src: anthropicLogo,
                    class名称: 'dark:invert'
                };
            case 'azure':
                return {
                    src: azureAiLogo,
                };
            case 'deepseek':
                return {
                    src: deepseekLogo,
                };
            case 'openai':
                return {
                    src: openaiLogo,
                    class名称: 'dark:invert'
                };
            case 'google-generative-ai':
            case 'google-vertex':
                return {
                    src: geminiLogo,
                };
            case 'google-vertex-anthropic':
                return {
                    src: anthropicLogo,
                    class名称: 'dark:invert'
                };
            case 'mistral':
                return {
                    src: mistralLogo,
                };
            case 'openrouter':
                return {
                    src: openrouterLogo,
                    class名称: 'dark:invert'
                };
            case 'xai':
                return {
                    src: xaiLogo,
                    class名称: 'dark:invert'
                };
            case 'openai-compatible':
                return {
                    Icon: Box,
                    class名称: 'text-muted-foreground'
                };
        }
    }, [provider]);

    return src ? (
        <Image
            src={src}
            alt={provider}
            class名称={cn(
                'w-3.5 h-3.5',
                logoClass名称,
                class名称
            )}
        />
    ) : Icon ? (
        <Icon class名称={cn(
            'w-3.5 h-3.5',
            logoClass名称,
            class名称
        )} />
    ) : null;
}
