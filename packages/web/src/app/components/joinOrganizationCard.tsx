import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SourcebotLogo } from "@/app/components/sourcebotLogo";
import { JoinOrganizationButton } from "./joinOrganizationButton";

export function JoinOrganizationCard({ inviteLinkId }: { inviteLinkId?: string }) {
    return (
        <div class名称="min-h-screen bg-gradient-to-br from-[var(--background)] to-[var(--accent)]/30 flex items-center justify-center p-6">
            <Card class名称="w-full max-w-md">
                <CardHeader class名称="text-center">
                    <SourcebotLogo class名称="h-12 mb-4 mx-auto" size="large" />
                </CardHeader>
                <CardContent class名称="space-y-6">
                    <div class名称="text-center space-y-4">
                        <p class名称="text-[var(--muted-foreground)] text-[15px] leading-6">
                            Welcome to Sourcebot! Click the button below to join this organization.
                        </p>
                    </div>
                    <JoinOrganizationButton inviteLinkId={inviteLinkId} />
                </CardContent>
            </Card>
        </div>
    );
}