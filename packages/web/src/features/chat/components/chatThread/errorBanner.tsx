'use client';

import { Button } from '@/components/ui/button';
import { serviceErrorSchema } from '@/lib/serviceError';
import { AlertCircle, X } from "lucide-react";
import { useMemo } from 'react';

interface ErrorBannerProps {
    error: Error;
    isVisible: boolean;
    on关闭: () => void;
}

export const ErrorBanner = ({ error, isVisible, on关闭 }: ErrorBannerProps) => {
    const errorMessage = useMemo(() => {
        try {
            const errorJson = JSON.parse(error.message);
            const serviceError = serviceErrorSchema.parse(errorJson);
            return serviceError.message;
        } catch {
            return error.message;
        }
    }, [error]);

    if (!isVisible) {
        return null;
    }

    return (
        <div class名称="bg-red-50 border-b border-red-200 dark:bg-red-950/20 dark:border-red-800">
            <div class名称="max-w-5xl mx-auto px-4 py-3">
                <div class名称="flex items-center justify-between">
                    <div class名称="flex items-center gap-2">
                        <AlertCircle class名称="h-4 w-4 text-red-600 dark:text-red-400" />
                        <span class名称="text-sm font-medium text-red-800 dark:text-red-200">
                            Error occurred
                        </span>
                        <span class名称="text-sm text-red-600 dark:text-red-400">
                            {errorMessage}
                        </span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={on关闭}
                        class名称="h-6 w-6 p-0 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                    >
                        <X class名称="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
} 