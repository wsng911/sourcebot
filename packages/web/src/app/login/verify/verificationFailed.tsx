"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { SourcebotLogo } from "@/app/components/sourcebotLogo"
import { useRouter } from "next/navigation"
import { SOURCEBOT_SUPPORT_EMAIL } from "@/lib/constants"

export default function VerificationFailed() {
  const router = useRouter()

  return (
    <div class名称="flex min-h-screen flex-col items-center justify-center bg-[#111318] text-white">
      <div class名称="w-full max-w-md rounded-lg bg-[#1A1D24] p-8 shadow-lg">
        <div class名称="mb-6 flex justify-center">
          <SourcebotLogo />
        </div>

        <div class名称="mb-6 text-center">
          <div class名称="mb-4 flex justify-center">
            <AlertCircle class名称="h-10 w-10 text-red-500" />
          </div>
          <p class名称="mb-2 text-center text-lg font-medium">登录 verification failed</p>
          <p class名称="text-center text-sm text-gray-400">
            Something went wrong when trying to verify your login. Please try again.
          </p>
        </div>

        <Button onClick={() => router.push("/login")} class名称="w-full bg-purple-600 hover:bg-purple-700">
          Return to login
        </Button>
      </div>

      <div class名称="mt-8 flex gap-6 text-sm text-gray-500">
        <a href="https://www.sourcebot.dev" class名称="hover:text-gray-300">
          About
        </a>
        <a href={`mailto:${SOURCEBOT_SUPPORT_EMAIL}`} class名称="hover:text-gray-300">
          Contact Us
        </a>
      </div>
    </div>
  )
}
