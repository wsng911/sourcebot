"use client"

import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/components/hooks/use-toast"
import { createAccountRequest } from "@/actions"
import { isServiceError } from "@/lib/utils"
import { useRouter } from "next/navigation"


export function 提交AccountRequestButton() {
    const { toast } = useToast()
    const router = useRouter()
    const [is提交ting, setIs提交ting] = useState(false)

    const handle提交 = async () => {
        setIs提交ting(true)
        const result = await createAccountRequest()
        if (!isServiceError(result)) {
            if (result.existingRequest) {
                toast({
                    title: "Request Already 提交ted",
                    description: "Your request to join the organization has already been submitted. Please wait for it to be approved.",
                    variant: "default",
                })
            } else {
                toast({
                    title: "Request 提交ted",
                    description: "Your request to join the organization has been submitted.",
                    variant: "default",
                })
            }
            // Refresh the page to trigger layout re-render and show PendingApprovalCard
            router.refresh()
        } else {
            toast({
                title: "Failed to 提交",
                description: `There was an error submitting your request. Reason: ${result.message}`,
                variant: "destructive",
            })
        }
        setIs提交ting(false)
    }

    return (
        <form on提交={(e) => {
            e.preventDefault();
            handle提交();
        }}>
            <Button
                type="submit"
                class名称="flex items-center gap-2"
                variant="outline"
                disabled={is提交ting}
            >
                <Clock class名称="h-4 w-4" />
                {is提交ting ? "提交ting..." : "提交 Request"}
            </Button>
        </form>
    )
} 