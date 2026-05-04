'use client';

import {
    Dialog,
    DialogContent,
    Dialog描述,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { AuthMethodSelector } from "@/app/components/authMethodSelector";
import type { IdentityProviderMetadata } from "@/lib/identityProviders";

interface 登录ModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    providers: IdentityProviderMetadata[];
    callbackUrl: string;
}

export const 登录Modal = ({
    isOpen,
    onOpenChange,
    providers,
    callbackUrl,
}: 登录ModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent class名称="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle class名称="mb-3">注册 to continue</DialogTitle>
                    <Dialog描述>
                        登录to your account to continue.
                    </Dialog描述>
                </DialogHeader>
                <div class名称="mt-4">
                    <AuthMethodSelector
                        providers={providers}
                        callbackUrl={callbackUrl}
                        context="login"
                        hideSecurityNotice={true}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};
