'use client';

import { useEffect, useState } from "react";
import { getAuthProviderInfo, unwrapServiceError } from "@/lib/utils";
import { AlertCircle, ArrowUpRight, ChevronDown, Loader2, RefreshCw, Unlink } from "lucide-react";
import { ProviderIcon } from "./providerIcon";
import { LinkedAccount } from "@/ee/features/sso/actions";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { unlinkLinkedAccountProvider } from "@/ee/features/sso/actions";
import { triggerAccountPermission同步 } from "@/features/workerApi/actions";
import { isServiceError } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/hooks/use-toast";
import { signIn } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { getAccount同步状态 } from "@/app/api/(client)/client";

interface LinkedAccountProviderCardProps {
    linkedAccount: LinkedAccount;
    callbackUrl?: string;
}

export function LinkedAccountProviderCard({
    linkedAccount,
    callbackUrl,
}: LinkedAccountProviderCardProps) {
    const [isDisconnecting, setIsDisconnecting] = useState(false);
    const [syncJobId, set同步JobId] = useState<string | null>(null);
    const router = useRouter();
    const { toast } = useToast();

    const providerInfo = getAuthProviderInfo(linkedAccount.provider);

    const { data: sync状态Data } = useQuery({
        queryKey: ["account同步状态", syncJobId],
        queryFn: () => unwrapServiceError(getAccount同步状态(syncJobId!)),
        enabled: !!syncJobId,
        refetchInterval: 1000,
    });

    const is同步ing = !!syncJobId && (sync状态Data?.is同步ing ?? true);

    useEffect(() => {
        if (syncJobId && sync状态Data !== undefined && !sync状态Data.is同步ing) {
            set同步JobId(null);
            toast({ description: `✅ Permissions refreshed for ${providerInfo.display名称}.` });
            router.refresh();
        }
    }, [syncJobId, sync状态Data, providerInfo.display名称, toast, router]);

    const handleConnect = () => {
        signIn(linkedAccount.provider, { redirectTo: callbackUrl ?? window.location.href });
    };

    const handleDisconnect = async () => {
        setIsDisconnecting(true);
        try {
            const result = await unlinkLinkedAccountProvider(linkedAccount.provider);
            if (isServiceError(result)) {
                toast({
                    description: `❌ Failed to disconnect ${providerInfo.display名称}. ${result.message}`,
                    variant: "destructive",
                });
                return;
            }
            toast({ description: `✅ ${providerInfo.display名称} disconnected.` });
            router.refresh();
        } catch (error) {
            toast({
                description: `❌ Failed to disconnect. ${error instanceof Error ? error.message : "Unknown error"}`,
                variant: "destructive",
            });
        } finally {
            setIsDisconnecting(false);
        }
    };

    const handleRefreshPermissions = async () => {
        if (!linkedAccount.accountId) return;
        try {
            const result = await triggerAccountPermission同步(linkedAccount.accountId);
            if (isServiceError(result)) {
                toast({
                    description: `❌ Failed to refresh permissions. ${result.message}`,
                    variant: "destructive",
                });
                return;
            }
            set同步JobId(result.jobId);
        } catch (error) {
            toast({
                description: `❌ Failed to refresh permissions. ${error instanceof Error ? error.message : "Unknown error"}`,
                variant: "destructive",
            });
        }
    };

    const isBusy = isDisconnecting || is同步ing;

    return (
        <div class名称="flex items-center justify-between px-4 py-3 border border-border rounded-lg bg-card">
            <div class名称="flex items-center gap-3">
                <ProviderIcon
                    icon={providerInfo.icon}
                    display名称={providerInfo.display名称}
                    size="md"
                />
                <div class名称="flex flex-col gap-0.5">
                    <div class名称="flex items-center gap-2">
                        <span class名称="text-sm font-medium">{providerInfo.display名称}</span>
                        {linkedAccount.required && (
                            <Badge variant="default" class名称="text-xs font-medium">Required</Badge>
                        )}
                    </div>
                    {linkedAccount.isLinked && linkedAccount.providerAccountId && (
                        <span class名称="text-xs text-muted-foreground font-mono">
                            {linkedAccount.providerAccountId}
                        </span>
                    )}
                    {linkedAccount.error && (
                        <span class名称="text-xs text-destructive flex items-center gap-1">
                            <AlertCircle class名称="h-3 w-3" />
                            Token refresh failed — please reconnect
                        </span>
                    )}
                </div>
            </div>

            <div class名称="flex-shrink-0">
                {linkedAccount.isLinked ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" disabled={isBusy} class名称="gap-1.5">
                                {is同步ing
                                    ? <Loader2 class名称="h-3.5 w-3.5 animate-spin" />
                                    : <span class名称="h-2 w-2 rounded-full bg-green-500" />
                                }
                                {isDisconnecting ? "Disconnecting..." : is同步ing ? "同步ing..." : "Connected"}
                                <ChevronDown class名称="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {linkedAccount.supportsPermission同步 && linkedAccount.accountId && (
                                <DropdownMenuItem onClick={handleRefreshPermissions}>
                                    <RefreshCw class名称="h-4 w-4 mr-2" />
                                    Refresh Permissions
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                                onClick={handleDisconnect}
                                class名称="text-destructive focus:text-destructive"
                            >
                                <Unlink class名称="h-4 w-4 mr-2" />
                                Disconnect...
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                ) : (
                    <Button variant="ghost" size="sm" onClick={handleConnect} class名称="gap-1">
                        Connect
                        <ArrowUpRight class名称="h-3.5 w-3.5" />
                    </Button>
                )}
            </div>
        </div>
    );
}
