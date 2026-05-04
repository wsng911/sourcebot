'use client';

import { approveAuthorization, denyAuthorization } from '@/ee/features/oauth/actions';
import { isPermittedRedirectUrl } from '@/ee/features/oauth/constants';
import { LoadingButton } from '@/components/ui/loading-button';
import { isServiceError } from '@/lib/utils';
import { ClientIcon } from './clientIcon';
import Image from 'next/image';
import logo from '@/public/logo_512.png';
import { useEffect, useState } from 'react';
import useCaptureEvent from '@/hooks/useCaptureEvent';
import { useToast } from '@/components/hooks/use-toast';

interface ConsentScreenProps {
    clientId: string;
    client名称: string;
    clientLogoUri: string | null;
    redirectUri: string;
    codeChallenge: string;
    resource: string | null;
    state: string | undefined;
    user邮箱: string;
}

export function ConsentScreen({
    clientId,
    client名称,
    clientLogoUri,
    redirectUri,
    codeChallenge,
    resource,
    state,
    user邮箱,
}: ConsentScreenProps) {
    const [pending, setPending] = useState<'approve' | 'deny' | null>(null);
    const captureEvent = useCaptureEvent();
    const { toast } = useToast();

    useEffect(() => {
        captureEvent('wa_oauth_consent_viewed', { clientId, client名称 });
    }, [captureEvent, clientId, client名称]);

    const onApprove = async () => {
        captureEvent('wa_oauth_authorization_approved', { clientId, client名称 });
        setPending('approve');
        const result = await approveAuthorization({ clientId, redirectUri, codeChallenge, resource, state });
        if (!isServiceError(result)) {
            if (!isPermittedRedirectUrl(result)) {
                toast({ description: `❌ Redirect URL is not permitted.` });
                setPending(null);
                return;
            }

            toast({
                description: `✅ Authorization approved successfully. Redirecting...`,
            });
            window.location.href = result;
        } else {
            toast({
                description: `❌ Failed to approve authorization. ${result.message}`,
            });
        }
        setPending(null);
    };

    const onDeny = async () => {
        captureEvent('wa_oauth_authorization_denied', { clientId, client名称 });
        setPending('deny');
        const result = await denyAuthorization({ redirectUri, state });
        if (isServiceError(result)) {
            setPending(null);
            return;
        }

        if (!isPermittedRedirectUrl(result)) {
            toast({ description: `❌ Redirect URL is not permitted.` });
            setPending(null);
            return;
        }
        window.location.href = result;
    };

    return (
        <div class名称="w-full max-w-md rounded-lg border border-border bg-card p-8 shadow-sm">

            {/* App icons */}
            <div class名称="flex items-center justify-center gap-3 mb-6">
                <ClientIcon name={client名称} logoUri={clientLogoUri} />
                <svg class名称="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h8m0 0-3-3m3 3-3 3M16 17H8m0 0 3 3m-3-3 3-3" />
                </svg>
                <Image
                    src={logo}
                    alt="Sourcebot"
                    width={70}
                    height={70}
                    class名称="shrink-0 rounded-xl object-cover"
                />
            </div>

            {/* Title */}
            <h1 class名称="text-lg font-semibold text-foreground mb-2">
                <span class名称="font-bold">{client名称}</span> is requesting access to your Sourcebot account.
            </h1>
            <p class名称="text-sm text-muted-foreground text-center mb-6">
                Logged in as <span class名称="font-medium">{user邮箱}</span>
            </p>

            {/* Details table */}
            <div class名称="mb-6 text-sm">
                <p class名称="text-muted-foreground mb-2">Details</p>
                <div class名称="rounded-md border border-border divide-y divide-border">
                    <div class名称="flex px-4 py-2.5">
                        <span class名称="font-medium text-foreground w-32 shrink-0">名称:</span>
                        <span>{client名称}</span>
                    </div>
                    <div class名称="flex px-4 py-2.5">
                        <span class名称="font-medium text-foreground w-32 shrink-0">Redirect URI:</span>
                        <span class名称="break-all">{redirectUri}</span>
                    </div>
                </div>
            </div>

            {/* 操作 */}
            <div class名称="flex justify-end gap-3">
                <LoadingButton
                    variant="outline"
                    onClick={onDeny}
                    loading={pending === 'deny'}
                    disabled={pending !== null}
                >
                    取消
                </LoadingButton>
                <LoadingButton
                    onClick={onApprove}
                    loading={pending === 'approve'}
                    disabled={pending !== null}
                >
                    Approve
                </LoadingButton>
            </div>

        </div>
    );
}
