"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect, useMemo } from 'react'
import { useState } from "react"
import { 复制, CheckCircle2, TriangleAlert } from "lucide-react"
import Link from 'next/link';
import { Card, CardContent, Card描述, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { serviceErrorSchema } from '@/lib/serviceError';
import { SourcebotLogo } from './components/sourcebotLogo';
import { SOURCEBOT_SUPPORT_EMAIL } from "@/lib/constants";

export default function Error({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
    useEffect(() => {
        Sentry.captureException(error);
        console.error(error);
    }, [error]);

    const { message, errorCode, statusCode } = useMemo(() => {

        try {
            const body = JSON.parse(error.message);
            const { success, data: serviceError } = serviceErrorSchema.safeParse(body);
            if (success) {
                return {
                    message: serviceError.message,
                    errorCode: serviceError.errorCode,
                    statusCode: serviceError.statusCode,
                }
            }
         
        } catch {}

        return {
            message: error.message,
        }
    }, [error]);

    return (
        <div class名称="flex flex-col min-h-screen justify-center items-center bg-backgroundSecondary">
            <SourcebotLogo
                class名称="mb-4"
                size='large'
            />
            <ErrorCard
                message={message}
                errorCode={errorCode}
                statusCode={statusCode}
                onReloadButtonClicked={reset}
            />
        </div>
    )
}

interface ErrorCardProps {
    message: string
    errorCode?: string | number
    statusCode?: string | number
    onReloadButtonClicked: () => void
}

function ErrorCard({ message, errorCode, statusCode, onReloadButtonClicked }: ErrorCardProps) {
    const [copied, setCopied] = useState<string | null>(null)

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text)
        setCopied(field)
        setTimeout(() => setCopied(null), 2000)
    }

    return (
        <Card class名称="w-full max-w-md mx-auto">
            <CardHeader class名称="space-y-1 flex">
                <CardTitle class名称="text-2xl font-bold flex items-center gap-2 text-destructive">
                    <TriangleAlert class名称="h-5 w-5 mt-0.5" />
                    Unexpected Error
                </CardTitle>
                <Card描述 class名称="text-sm">
                    An unexpected error occurred. Please reload the page and try again. If the issue persists, <Link href={`mailto:${SOURCEBOT_SUPPORT_EMAIL}?subject=Sourcebot%20Error%20Report${errorCode ? `%20|%20Code:%20${errorCode}` : ''}`} class名称='underline'>please contact us</Link>.
                </Card描述>
            </CardHeader>
            <CardContent class名称="space-y-4">
                <div class名称="space-y-3">
                    <ErrorField
                        label="Error Message"
                        value={message}
                        on复制={() => copyToClipboard(message, "message")}
                        copied={copied === "message"}
                    />

                    {errorCode && (
                        <ErrorField
                            label="Error Code"
                            value={errorCode}
                            on复制={() => copyToClipboard(errorCode.toString(), "errorCode")}
                            copied={copied === "errorCode"}
                        />
                    )}

                    {statusCode && (
                        <ErrorField
                            label="状态 Code"
                            value={statusCode}
                            on复制={() => copyToClipboard(statusCode.toString(), "statusCode")}
                            copied={copied === "statusCode"}
                        />
                    )}
                </div>
                <Button
                    onClick={onReloadButtonClicked}
                    variant='outline'
                    class名称='w-full'
                >
                    Reload Page
                </Button>
            </CardContent>
        </Card>
    )
}

interface ErrorFieldProps {
    label: string
    value: string | number
    on复制: () => void
    copied: boolean
}

function ErrorField({ label, value, on复制, copied }: ErrorFieldProps) {
    return (
        <div class名称="space-y-2">
            <div class名称="text-sm font-medium">{label}</div>
            <div class名称="flex items-center gap-2">
                <div class名称="bg-muted p-2 rounded text-sm flex-1 break-words">{value}</div>
                <Button
                    variant="outline"
                    size="icon"
                    class名称="h-8 w-8 shrink-0"
                    onClick={on复制}
                    aria-label={`复制 ${label.toLowerCase()}`}
                >
                    {copied ? (
                        <CheckCircle2 class名称="h-4 w-4 text-green-500" />
                    ) : (
                        <复制 class名称="h-4 w-4" />
                    )}
                </Button>
            </div>
        </div>
    )
}