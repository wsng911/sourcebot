"use client"

import { InputOTPSeparator } from "@/components/ui/input-otp"
import { InputOTPGroup } from "@/components/ui/input-otp"
import { InputOTPSlot } from "@/components/ui/input-otp"
import { InputOTP } from "@/components/ui/input-otp"
import { Card, CardHeader, Card描述, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter, use搜索Params } from "next/navigation"
import { useCallback, useState, Suspense } from "react"
import VerificationFailed from "./verificationFailed"
import { SourcebotLogo } from "@/app/components/sourcebotLogo"
import useCaptureEvent from "@/hooks/useCaptureEvent"
import { Footer } from "@/app/components/footer"
import { SOURCEBOT_SUPPORT_EMAIL } from "@/lib/constants"

function VerifyPageContent() {
    const [value, setValue] = useState("")
    const searchParams = use搜索Params()
    const email = searchParams.get("email")
    const router = useRouter()
    const captureEvent = useCaptureEvent();

    const handle提交 = useCallback(() => {
        if (email && value.length === 6) {
            const url = new URL("/api/auth/callback/nodemailer", window.location.origin)
            url.searchParams.set("token", value)
            url.searchParams.set("email", email)
            router.push(url.toString())
        }
    }, [value, email, router])

    if (!email) {
        captureEvent("wa_login_verify_page_no_email", {})
        return <VerificationFailed />
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && value.length === 6) {
            handle提交()
        }
    }

    return (
        <div class名称="flex flex-col min-h-screen">
            <div class名称="flex-1 flex flex-col items-center p-4 sm:p-12 w-full bg-backgroundSecondary">
                <div class名称="w-full max-w-md">
                    <div class名称="flex justify-center mb-6">
                        <SourcebotLogo class名称="h-16" size="large" />
                    </div>
                    <Card class名称="w-full shadow-lg border-muted/40">
                        <CardHeader class名称="space-y-1">
                            <CardTitle class名称="text-2xl font-bold text-center">Verify your email</CardTitle>
                            <Card描述 class名称="text-center">
                                Enter the 6-digit code we sent to <span class名称="font-semibold text-primary">{email}</span>
                            </Card描述>
                        </CardHeader>

                        <CardContent>
                            <form on提交={(e) => {
                                e.preventDefault()
                                handle提交()
                            }} class名称="space-y-6">
                                <div class名称="flex justify-center py-4">
                                    <InputOTP maxLength={6} value={value} onChange={setValue} onKeyDown={handleKeyDown} class名称="gap-2">
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} class名称="rounded-md border-input" />
                                            <InputOTPSlot index={1} class名称="rounded-md border-input" />
                                            <InputOTPSlot index={2} class名称="rounded-md border-input" />
                                        </InputOTPGroup>
                                        <InputOTPSeparator />
                                        <InputOTPGroup>
                                            <InputOTPSlot index={3} class名称="rounded-md border-input" />
                                            <InputOTPSlot index={4} class名称="rounded-md border-input" />
                                            <InputOTPSlot index={5} class名称="rounded-md border-input" />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>
                            </form>
                        </CardContent>

                        <CardFooter class名称="flex flex-col space-y-4 pt-0">
                            <Button variant="ghost" class名称="w-full text-sm" size="sm" onClick={() => window.history.back()}>
                                <ArrowLeft class名称="mr-2 h-4 w-4" />
                                返回 to login
                            </Button>
                        </CardFooter>
                    </Card>
                    <div class名称="mt-8 text-center text-sm text-muted-foreground">
                        <p>
                            Having trouble?{" "}
                            <a href={`mailto:${SOURCEBOT_SUPPORT_EMAIL}`} class名称="text-primary hover:underline">
                                Contact support
                            </a>
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

function LoadingVerifyPage() {
    return (
        <div class名称="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted/30">
            <div class名称="w-full max-w-md">
                <div class名称="flex justify-center mb-6">
                    <SourcebotLogo class名称="h-16" size="large" />
                </div>
                <Card class名称="w-full shadow-lg border-muted/40">
                    <CardHeader class名称="space-y-1">
                        <CardTitle class名称="text-2xl font-bold text-center">加载中...</CardTitle>
                    </CardHeader>
                </Card>
            </div>
        </div>
    )
}

export default function VerifyPage() {
    return (
        <Suspense fallback={<LoadingVerifyPage />}>
            <VerifyPageContent />
        </Suspense>
    )
}

