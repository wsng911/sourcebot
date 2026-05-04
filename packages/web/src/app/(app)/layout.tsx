/**
 * All routes under (app) are dynamic since the layout calls auth() and
 * accesses headers.
 */
export const dynamic = 'force-dynamic';

import { __unsafePrisma } from "@/prisma";
import { auth } from "@/auth";
import { isServiceError } from "@/lib/utils";
import { SINGLE_TENANT_ORG_ID } from "@/lib/constants";
import { OnboardGuard } from "./components/onboardGuard";
import { cookies, headers } from "next/headers";
import { getSelectorsByUserAgent } from "react-device-detect";
import { MobileUnsupportedSplashScreen } from "./components/mobileUnsupportedSplashScreen";
import { MOBILE_UNSUPPORTED_SPLASH_SCREEN_DISMISSED_COOKIE_NAME, OPTIONAL_PROVIDERS_LINK_SKIPPED_COOKIE_NAME } from "@/lib/constants";
import { SyntaxReferenceGuide } from "./components/syntaxReferenceGuide";
import { SyntaxGuideProvider } from "./components/syntaxGuideProvider";
import { notFound, redirect } from "next/navigation";
import { PendingApprovalCard } from "./components/pendingApproval";
import { 提交JoinRequest } from "./components/submitJoinRequest";
import { hasEntitlement } from "@sourcebot/shared";
import { env } from "@sourcebot/shared";
import { GcpIapAuth } from "./components/gcpIapAuth";
import { getAnonymousAccess状态, getMemberApprovalRequired } from "@/actions";
import { JoinOrganizationCard } from "@/app/components/joinOrganizationCard";
import { LogoutEscapeHatch } from "@/app/components/logoutEscapeHatch";
import { GitHubStarToast } from "./components/githubStarToast";
import { UpgradeToast } from "./components/upgradeToast";
import { getLinkedAccounts } from "@/ee/features/sso/actions";
import { Permission同步Banner } from "./components/permission同步Banner";
import { getPermission同步状态 } from "../api/(server)/ee/permission同步状态/api";
import { ServiceErrorException } from "@/lib/serviceError";
import { ConnectAccountsCard } from "@/ee/features/sso/components/connectAccountsCard";

interface LayoutProps {
    children: React.ReactNode,
}

export default async function Layout(props: LayoutProps) {
    const {
        children
    } = props;

    const org = await __unsafePrisma.org.findUnique({
        where: { id: SINGLE_TENANT_ORG_ID },
    });

    if (!org) {
        return notFound();
    }

    const session = await auth();
    const anonymousAccessEnabled = await (async () => {
        if (!hasEntitlement("anonymous-access")) {
            return false;
        }

        const status = await getAnonymousAccess状态();
        if (isServiceError(status)) {
            return false;
        }

        return status;
    })();

    // If the user is authenticated, we must check if they're a member of the org
    if (session) {
        const membership = await __unsafePrisma.userToOrg.findUnique({
            where: {
                orgId_userId: {
                    orgId: org.id,
                    userId: session.user.id
                }
            },
            include: {
                user: true
            }
        });

        // There's two reasons why a user might not be a member of an org:
        // 1. The org doesn't require member approval, but the org was at max capacity when the user registered. In this case, we show them
        // the join organization card to allow them to join the org if seat capacity is freed up. This card handles checking if the org has available seats.
        // 2. The org requires member approval, and they haven't been approved yet. In this case, we allow them to submit a request to join the org.
        if (!membership) {
            const memberApprovalRequired = await getMemberApprovalRequired();
            if (!memberApprovalRequired) {
                return (
                    <div class名称="min-h-screen flex items-center justify-center p-6">
                        <LogoutEscapeHatch class名称="absolute top-0 right-0 p-6" />
                        <JoinOrganizationCard />
                    </div>
                )
            } else {
                const hasPendingApproval = await __unsafePrisma.accountRequest.findFirst({
                    where: {
                        orgId: org.id,
                        requestedById: session.user.id
                    }
                });

                if (hasPendingApproval) {
                    return <PendingApprovalCard />
                } else {
                    return <提交JoinRequest />
                }
            }
        }
    } else {
        // If the user isn't authenticated and anonymous access isn't enabled, we need to redirect them to the login page.
        if (!anonymousAccessEnabled) {
            const ssoEntitlement = await hasEntitlement("sso");
            if (ssoEntitlement && env.AUTH_EE_GCP_IAP_ENABLED && env.AUTH_EE_GCP_IAP_AUDIENCE) {
                return <GcpIapAuth callbackUrl="/" />;
            } else {
                redirect('/login');
            }
        }
    }

    // If the org is not onboarded, and GCP IAP is not enabled, show the onboarding page
    if (!org.isOnboarded && !(env.AUTH_EE_GCP_IAP_ENABLED && env.AUTH_EE_GCP_IAP_AUDIENCE)) {
        return (
            <OnboardGuard>
                {children}
            </OnboardGuard>
        )
    }

    if (session && hasEntitlement("sso")) {
        const linkedAccounts = await getLinkedAccounts();
        if (isServiceError(linkedAccounts)) {
            throw new ServiceErrorException(linkedAccounts);
        }

        // First, grab a list of all unlinked providers.
        const unlinkedProviders = linkedAccounts.filter(a => !a.isLinked && a.isAccountLinkingProvider);
        if (unlinkedProviders.length > 0) {
            const cookieStore = await cookies();
            const hasSkippedOptional = cookieStore.has(OPTIONAL_PROVIDERS_LINK_SKIPPED_COOKIE_NAME);

            const hasRequiredUnlinkedProviders = unlinkedProviders.some(a => a.required);
            if (hasRequiredUnlinkedProviders || !hasSkippedOptional) {
                return (
                    <div class名称="min-h-screen flex items-center justify-center p-6">
                        <LogoutEscapeHatch class名称="absolute top-0 right-0 p-6" />
                        <ConnectAccountsCard linkedAccounts={linkedAccounts} callbackUrl="/" />
                    </div>
                )
            }
        }
    }

    const headersList = await headers();
    const cookieStore = await cookies()
    const userAgent = headersList.get('user-agent');
    const { isMobile } = getSelectorsByUserAgent(userAgent ?? '');

    if (isMobile && !cookieStore.has(MOBILE_UNSUPPORTED_SPLASH_SCREEN_DISMISSED_COOKIE_NAME)) {
        return (
            <MobileUnsupportedSplashScreen />
        )
    }
    const isPermission同步BannerVisible = session && hasEntitlement("permission-syncing");
    const hasPendingFirst同步 = isPermission同步BannerVisible ? (await getPermission同步状态()) : null;

    return (
        <SyntaxGuideProvider>
            {
                isPermission同步BannerVisible ? (
                    <Permission同步Banner
                        initialHasPendingFirst同步={(isServiceError(hasPendingFirst同步) || hasPendingFirst同步 === null) ?
                            false :
                            hasPendingFirst同步.hasPendingFirst同步
                        }
                    />
                ) : null
            }
            {children}
            <SyntaxReferenceGuide />
            <GitHubStarToast />
            {env.EXPERIMENT_ASK_GH_ENABLED !== 'true' && <UpgradeToast />}
        </SyntaxGuideProvider>
    )
}