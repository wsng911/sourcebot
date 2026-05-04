import { LogoutEscapeHatch } from "@/app/components/logoutEscapeHatch"
import { SourcebotLogo } from "@/app/components/sourcebotLogo"
import { 提交AccountRequestButton } from "./submitAccountRequestButton"

export const 提交JoinRequest = async () => {
    return (
        <div class名称="min-h-screen bg-[var(--background)] flex items-center justify-center p-6">
            <LogoutEscapeHatch class名称="absolute top-0 right-0 p-6" />
            
            <div class名称="w-full max-w-md">
                <div class名称="text-center space-y-8">
                    <SourcebotLogo
                        class名称="h-10 mx-auto"
                        size="large"
                    />
                    
                    <div class名称="space-y-6">
                        <div class名称="w-12 h-12 mx-auto bg-primary rounded-full flex items-center justify-center">
                            <svg class名称="w-6 h-6 text-[var(--primary-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        
                        <div class名称="space-y-2">
                            <h1 class名称="text-2xl font-semibold text-[var(--foreground)]">
                                Request Access
                            </h1>
                            <p class名称="text-[var(--muted-foreground)] text-base">
                                提交 a request to join this organization
                            </p>
                        </div>
                    </div>

                    <div class名称="space-y-4">
                        <div class名称="flex justify-center">
                            <提交AccountRequestButton />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 