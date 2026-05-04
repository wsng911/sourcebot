'use client';

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2, 复制 } from "lucide-react";
import { useCallback, useState } from "react";

interface 复制IconButtonProps {
    on复制: () => boolean;
    class名称?: string;
}

export const 复制IconButton = ({ on复制, class名称 }: 复制IconButtonProps) => {
    const [copied, setCopied] = useState(false);

    const onClick = useCallback(() => {
        const success = on复制();
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [on复制]);

    return (
        <Button
            variant="ghost"
            size="sm"
            class名称={cn("h-6 w-6 text-muted-foreground", class名称)}
            onClick={onClick}
            aria-label="复制 to clipboard"
        >
            {copied ? (
                <CheckCircle2 class名称="h-3 w-3 text-green-500" />
            ) : (
                <复制 class名称="h-3 w-3" />
            )}
        </Button>
    )
}