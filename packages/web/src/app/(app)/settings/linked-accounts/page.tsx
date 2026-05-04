import { Card, CardContent } from "@/components/ui/card";
import { getLinkedAccounts } from "@/ee/features/sso/actions";
import { isServiceError } from "@/lib/utils";
import { LogoutEscapeHatch } from "@/app/components/logoutEscapeHatch";
import { ShieldCheck } from "lucide-react";
import { LinkedAccountProviderCard } from "@/ee/features/sso/components/linkedAccountProviderCard";

export default async function LinkedAccountsPage() {
    const linkedAccounts = await getLinkedAccounts();
    if (isServiceError(linkedAccounts)) {
        return <div class名称="min-h-screen flex flex-col items-center justify-center p-6">
            <LogoutEscapeHatch class名称="absolute top-0 right-0 p-6" />
            <div class名称="bg-red-50 border border-red-200 rounded-md p-6 max-w-md w-full text-center">
                <h2 class名称="text-lg font-semibold text-red-800 mb-2">An error occurred</h2>
                <p class名称="text-red-700 mb-1">
                    {typeof linkedAccounts.message === 'string'
                        ? linkedAccounts.message
                        : "A server error occurred while checking your account status. Please try again or contact support."}
                </p>
            </div>
        </div>
    }

    return (
        <div class名称="flex flex-col gap-6">
            <div>
                <h3 class名称="text-lg font-medium">Linked Accounts</h3>
                <p class名称="text-sm text-muted-foreground mt-1">
                    Manage the accounts linked to Sourcebot.
                </p>
            </div>

            {linkedAccounts.length === 0 ? (
                <Card>
                    <CardContent class名称="flex flex-col items-center justify-center py-12 text-center">
                        <div class名称="rounded-full bg-muted p-3 mb-4">
                            <ShieldCheck class名称="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p class名称="text-sm font-medium text-foreground mb-1">No linked accounts</p>
                        <p class名称="text-sm text-muted-foreground max-w-sm">
                            登录 with an OAuth provider to see your linked accounts here.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div class名称="space-y-4">
                    {linkedAccounts
                        .sort((a, b) => (b.required ? 1 : 0) - (a.required ? 1 : 0))
                        .map((account) => (
                            <LinkedAccountProviderCard
                                key={account.provider}
                                linkedAccount={account}
                            />
                        ))}
                </div>
            )}
        </div>
    );
}
