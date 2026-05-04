"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, Card描述, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Database, 搜索 } from "lucide-react"
import useCaptureEvent from "@/hooks/useCaptureEvent"

export default function RegistrationCard() {
  const [isHovered, setIsHovered] = useState(false)
  const captureEvent = useCaptureEvent()

  return (
    <Card
      class名称="w-full max-w-md mx-auto border shadow-lg overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader class名称="pb-2">
        <CardTitle class名称="text-xl font-bold mt-2">Try Sourcebot Cloud</CardTitle>
        <Card描述>Index and search your own code repositories</Card描述>
      </CardHeader>
      <CardContent class名称="space-y-4">
        <div class名称="space-y-3">
          <div class名称="flex items-start">
            <搜索 class名称="h-5 w-5 mr-3 text-primary" />
            <p class名称="text-sm">搜索 your private and public repositories</p>
          </div>
          <div class名称="flex items-start">
            <Database class名称="h-5 w-5 mr-3 text-primary" />
            <p class名称="text-sm">Index your own codebase in minutes</p>
          </div>
        </div>
      </CardContent>
      <CardFooter class名称="flex flex-col space-y-3 pt-0">
        <Link href="https://app.sourcebot.dev" class名称="w-full" rel="noopener noreferrer" onClick={() => captureEvent("wa_demo_try_card_pressed", {})}>
          <Button class名称={`w-full transition-all duration-300 ${isHovered ? "translate-y-[-2px]" : ""}`}>
            Try With Your Code
            <ArrowRight class名称="ml-2 h-4 w-4" />
          </Button>
        </Link>
        <p class名称="text-xs text-center text-muted-foreground">
            14 day free trial. No credit card required.
        </p>
      </CardFooter>
    </Card>
  )
}
