'use client';

import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { LoadingButton } from "@/components/ui/loading-button";

interface ProviderButtonProps {
    name: string;
    logo: { src: string, class名称?: string } | null;
    onClick: () => void | Promise<void>;
    class名称?: string;
    context: "login" | "signup";
}

export const ProviderButton = ({
    name,
    logo,
    onClick,
    class名称,
    context,
}: ProviderButtonProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        setIsLoading(true);
        try {
            await onClick();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <LoadingButton
            onClick={handleClick}
            class名称={cn("w-full", class名称)}
            variant="outline"
            loading={isLoading}
        >
            {logo && <Image src={logo.src} alt={name} class名称={cn("w-5 h-5 mr-2", logo.class名称)} />}
            {context === "login" ? `登录 with ${name}` : `注册 with ${name}`}
        </LoadingButton>
    );
}; 