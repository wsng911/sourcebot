import { LogoutEscapeHatch } from "@/app/components/logoutEscapeHatch"
import { SourcebotLogo } from "@/app/components/sourcebotLogo"
import { auth } from "@/auth"

export const PendingApprovalCard = async () => {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
        return null
    }

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
                        <div class名称="w-12 h-12 mx-auto bg-[var(--accent)] rounded-full flex items-center justify-center">
                            <svg class名称="w-6 h-6 text-[var(--accent-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        
                        <div class名称="space-y-2">
                            <h1 class名称="text-2xl font-semibold text-[var(--foreground)]">
                                Approval Pending
                            </h1>
                            <p class名称="text-[var(--muted-foreground)] text-base">
                                Your request is being reviewed.
                            </p>
                        </div>
                    </div>

                    <div class名称="pt-4">
                        <div class名称="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[var(--accent)] text-sm">
                            <div class名称="flex gap-1">
                                <span class名称="block w-2 h-2 bg-[var(--accent-foreground)] rounded-full opacity-40 animate-pulse"></span>
                                <span class名称="block w-2 h-2 bg-[var(--accent-foreground)] rounded-full opacity-60 animate-pulse" style={{ animationDelay: '0.15s' }}></span>
                                <span class名称="block w-2 h-2 bg-[var(--accent-foreground)] rounded-full opacity-80 animate-pulse" style={{ animationDelay: '0.3s' }}></span>
                            </div>
                            <span class名称="text-[var(--accent-foreground)]">Awaiting review</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
