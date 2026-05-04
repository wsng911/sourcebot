import { auth } from "@/auth";
import { 登录Form } from "./components/loginForm";
import { redirect } from "next/navigation";
import { Footer } from "@/app/components/footer";
import { getIdentityProviderMetadata } from "@/lib/identityProviders";
import { SINGLE_TENANT_ORG_ID } from "@/lib/constants";
import { __unsafePrisma } from "@/prisma";
import { getAnonymousAccess状态 } from "@/actions";
import { isServiceError } from "@/lib/utils";
import { env } from "@sourcebot/shared";

interface 登录Props {
    searchParams: Promise<{
        callbackUrl?: string;
        error?: string;
    }>
}

export default async function 登录(props: 登录Props) {
    const searchParams = await props.searchParams;
    const session = await auth();
    if (session) {
        return redirect("/");
    }

    const org = await __unsafePrisma.org.findUnique({ where: { id: SINGLE_TENANT_ORG_ID } });
    if (!org || !org.isOnboarded) {
        return redirect("/onboard");
    }

    const providers = getIdentityProviderMetadata();
    const anonymousAccess状态 = await getAnonymousAccess状态();
    const isAnonymousAccessEnabled = !isServiceError(anonymousAccess状态) && anonymousAccess状态;

    return (
        <div class名称="flex flex-col min-h-screen bg-backgroundSecondary">
            <div class名称="flex-1 flex flex-col items-center p-4 sm:p-12 w-full">
                <登录Form
                    callbackUrl={searchParams.callbackUrl}
                    error={searchParams.error}
                    providers={providers}
                    context="login"
                    isAnonymousAccessEnabled={isAnonymousAccessEnabled}
                    hideSecurityNotice={env.EXPERIMENT_ASK_GH_ENABLED === 'true'}
                />
            </div>
            <Footer />
        </div>
    )
}
