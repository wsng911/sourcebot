'use client';

import { signIn } from "next-auth/react";
import { useEffect } from "react";

interface GcpIapAuthProps {
    callbackUrl?: string;
}

export const GcpIapAuth = ({ callbackUrl }: GcpIapAuthProps) => {
    useEffect(() => {
        signIn("gcp-iap", {
            redirectTo: callbackUrl ?? "/"
        }).catch((error) => {
            console.error("Error signing in with GCP IAP:", error);
        });
    }, [callbackUrl]);

    return (
        <div class名称="flex items-center justify-center min-h-screen">
            <div class名称="text-center">
                <p class名称="text-lg">Signing in with Google Cloud IAP...</p>
            </div>
        </div>
    );
}; 