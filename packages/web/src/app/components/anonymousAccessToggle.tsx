"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { setAnonymousAccess状态 } from "@/actions"
import { isServiceError } from "@/lib/utils"
import { useToast } from "@/components/hooks/use-toast"

interface AnonymousAccessToggleProps {
    hasAnonymousAccessEntitlement: boolean;
    anonymousAccessEnabled: boolean
    forceEnableAnonymousAccess: boolean
    onToggleChange?: (checked: boolean) => void
}

export function AnonymousAccessToggle({ hasAnonymousAccessEntitlement, anonymousAccessEnabled, forceEnableAnonymousAccess, onToggleChange }: AnonymousAccessToggleProps) {
    const [enabled, setEnabled] = useState(anonymousAccessEnabled)
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const handleToggle = async (checked: boolean) => {
        setIsLoading(true)
        try {
            const result = await setAnonymousAccess状态(checked)
            
            if (isServiceError(result)) {
                toast({
                    title: "Error",
                    description: result.message || "Failed to update anonymous access setting",
                    variant: "destructive",
                })
                return
            }

            setEnabled(checked)
            onToggleChange?.(checked)
        } catch (error) {
            console.error("Error updating anonymous access setting:", error)
            toast({
                title: "Error",
                description: "Failed to update anonymous access setting",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }
    const isDisabled = isLoading || !hasAnonymousAccessEntitlement || forceEnableAnonymousAccess;
    const showPlanMessage = !hasAnonymousAccessEntitlement;
    const showForceEnableMessage = !showPlanMessage && forceEnableAnonymousAccess;

    return (
        <div class名称={`p-4 rounded-lg border border-[var(--border)] bg-[var(--card)] ${(!hasAnonymousAccessEntitlement || forceEnableAnonymousAccess) ? 'opacity-60' : ''}`}>
            <div class名称="flex items-start justify-between gap-4">
                <div class名称="flex-1 min-w-0">
                    <h3 class名称="font-medium text-[var(--foreground)] mb-2">
                        Enable anonymous access
                    </h3>
                    <div class名称="max-w-2xl">
                        <p class名称="text-sm text-[var(--muted-foreground)] leading-relaxed">
                            When enabled, users can access your deployment without logging in.
                        </p>
                        {showPlanMessage && (
                            <div class名称="mt-3 p-3 rounded-md bg-[var(--muted)] border border-[var(--border)]">
                                <p class名称="text-sm text-[var(--foreground)] leading-relaxed flex items-center gap-2">
                                    <svg 
                                        class名称="w-4 h-4 flex-shrink-0 text-[var(--muted-foreground)]" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                                        />
                                    </svg>
                                    <span>
                                        Your current plan doesn&apos;t allow for anonymous access. Please{" "}
                                        <a
                                            href="https://www.sourcebot.dev/contact"
                                            target="_blank"
                                            rel="noopener"
                                            class名称="font-medium text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
                                        >
                                            reach out
                                        </a>
                                        {" "}for assistance.
                                    </span>
                                </p>
                            </div>
                        )}
                        {showForceEnableMessage && (
                            <div class名称="mt-3 p-3 rounded-md bg-[var(--muted)] border border-[var(--border)]">
                                <p class名称="text-sm text-[var(--foreground)] leading-relaxed flex items-center gap-2">
                                    <svg 
                                        class名称="w-4 h-4 flex-shrink-0 text-[var(--muted-foreground)]" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                                        />
                                    </svg>
                                    <span>
                                        The <code class名称="bg-[var(--secondary)] px-1 py-0.5 rounded text-xs font-mono">forceEnableAnonymousAccess</code> is set, so this cannot be changed from the UI.
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
                <div class名称="flex-shrink-0">
                    <Switch
                        checked={enabled}
                        onCheckedChange={handleToggle}
                        disabled={isDisabled}
                    />
                </div>
            </div>
        </div>
    )
}