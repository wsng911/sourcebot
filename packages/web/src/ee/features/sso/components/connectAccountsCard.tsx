'use client';

import { Card, CardContent, Card描述, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { skipOptionalProvidersLink } from "@/ee/features/sso/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LinkedAccountProviderCard } from "./linkedAccountProviderCard";
import { LinkedAccount } from "@/ee/features/sso/actions";

interface ConnectAccountsCardProps {
    linkedAccounts: LinkedAccount[]
    callbackUrl?: string;
}

export const ConnectAccountsCard = ({ linkedAccounts, callbackUrl }: ConnectAccountsCardProps) => {
    const router = useRouter();
    const [isSkipping, setIsSkipping] = useState(false);

    const handleSkip = async () => {
        setIsSkipping(true);
        try {
            await skipOptionalProvidersLink();
        } catch (error) {
            console.error("Failed to skip optional providers:", error);
        } finally {
            setIsSkipping(false);
            router.refresh()
        }
    };

    // Only show account_linking providers in this flow
    const accountLinkingProviders = linkedAccounts.filter(a => a.isAccountLinkingProvider);
    const canSkip = !accountLinkingProviders.some(a => a.required && !a.isLinked);

    return (
        <Card>
            <CardHeader>
                <CardTitle class名称="text-base">Connect Your Accounts</CardTitle>
                <Card描述>
                    Link the following accounts to enable permission syncing and access all features.
                    <br />
                    You can manage your linked accounts later in <strong>设置 → Linked Accounts.</strong>
                </Card描述>
            </CardHeader>
            <CardContent class名称="space-y-4">
                <div class名称="space-y-2">
                    {accountLinkingProviders
                        .sort((a, b) => (b.required ? 1 : 0) - (a.required ? 1 : 0))
                        .map(account => (
                        <LinkedAccountProviderCard
                            key={account.provider}
                            linkedAccount={account}
                            callbackUrl={callbackUrl}
                        />
                    ))}
                </div>
                {canSkip && (
                    <Button
                        variant="outline"
                        class名称="w-full"
                        onClick={handleSkip}
                        disabled={isSkipping}
                    >
                        {isSkipping ? "Skipping..." : "Skip for now"}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};
