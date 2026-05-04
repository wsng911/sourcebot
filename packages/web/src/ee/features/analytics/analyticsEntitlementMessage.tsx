"use client"

import { Card, CardContent, Card描述, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, Mail } from "lucide-react"

export function AnalyticsEntitlementMessage() {
    return (
        <div class名称="flex items-center justify-center min-h-[60vh] py-12">
            <Card class名称="w-full max-w-lg bg-card border-border shadow-xl p-2">
                <CardHeader class名称="text-center pb-4">
                    <div class名称="flex justify-center mb-4">
                        <div class名称="p-3 rounded-full bg-muted">
                            <BarChart3 class名称="h-8 w-8 text-muted-foreground" />
                        </div>
                    </div>
                    <CardTitle class名称="text-xl font-semibold text-card-foreground">
                        Analytics is an Enterprise Feature
                    </CardTitle>
                    <Card描述 class名称="text-muted-foreground mt-2">
                        Get insights into your organization&apos;s usage patterns and activity. <a href="https://docs.sourcebot.dev/docs/features/analytics" target="_blank" rel="noopener" class名称="text-primary hover:underline">Learn more</a>
                    </Card描述>
                </CardHeader>
                <CardContent class名称="text-center space-y-4">
                    <div class名称="bg-muted/50 rounded-lg p-4 border border-border">
                        <p class名称="text-sm text-muted-foreground">
                            Want to try out Sourcebot&apos;s enterprise features? Reach out to us and we&apos;ll get back to you within
                            a couple hours with a trial license.
                        </p>
                    </div>
                    <div class名称="flex flex-col gap-2">
                        <Button asChild class名称="w-full">
                            <a 
                                href="https://sourcebot.dev/contact" 
                                target="_blank" 
                                rel="noopener"
                            >
                                <Mail class名称="h-4 w-4 mr-2" />
                                Request a trial license
                            </a>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
} 