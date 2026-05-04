import { TriangleAlertIcon } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils";

const DOCS_URL = "https://docs.sourcebot.dev/docs/configuration/language-model-providers"; 

interface NotConfiguredErrorBannerProps {
    class名称?: string;
}

export const NotConfiguredErrorBanner = ({ class名称 }: NotConfiguredErrorBannerProps) => {
    return (
        <div class名称={cn("flex flex-row items-center bg-error rounded-md p-2", class名称)}>
            <TriangleAlertIcon class名称="h-4 w-4 text-accent mr-1.5" />
            <span class名称="text-sm font-medium text-accent"><span class名称="font-bold">Ask unavailable:</span> no language model configured. See the <Link href={DOCS_URL} target="_blank" class名称="underline">configuration docs</Link> for more information.</span>
        </div>
    )
}