import { auth } from "@/auth";
import { __unsafePrisma } from "@/prisma";
import { SINGLE_TENANT_ORG_ID } from "@/lib/constants";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SourcebotLogo } from "@/app/components/sourcebotLogo";
import { AuthMethodSelector } from "@/app/components/authMethodSelector";
import { LogoutEscapeHatch } from "@/app/components/logoutEscapeHatch";
import { getIdentityProviderMetadata, IdentityProviderMetadata } from "@/lib/identityProviders";
import { JoinOrganizationCard } from "@/app/components/joinOrganizationCard";

interface InvitePageProps {
    searchParams: Promise<{
        id?: string;
    }>;
}

export default async function InvitePage(props: InvitePageProps) {
    const searchParams = await props.searchParams;
    const org = await __unsafePrisma.org.findUnique({ where: { id: SINGLE_TENANT_ORG_ID } });
    if (!org || !org.isOnboarded) {
        return redirect("/onboard");
    }

    const inviteLinkId = searchParams.id;
    if (!org.inviteLinkEnabled || !inviteLinkId || org.inviteLinkId !== inviteLinkId) {
        return notFound();
    }

    const session = await auth();
    if (!session) {
        const providers = getIdentityProviderMetadata();
        return <WelcomeCard inviteLinkId={inviteLinkId} providers={providers} />;
    }

    const membership = await __unsafePrisma.userToOrg.findUnique({
        where: {
            orgId_userId: {
                orgId: org.id,
                userId: session.user.id
            }
        }
    });

    // If already a member, redirect to the organization
    if (membership) {
        redirect(`/`);
    }

    // User is logged in but not a member, show join invitation
    return (
        <div class名称="min-h-screen flex items-center justify-center p-6">
            <LogoutEscapeHatch class名称="absolute top-0 right-0 p-6" />
            <JoinOrganizationCard inviteLinkId={inviteLinkId} />
        </div>
    );
}

function WelcomeCard({ inviteLinkId, providers }: { inviteLinkId: string; providers: IdentityProviderMetadata[] }) {
    return (    
        <div class名称="min-h-screen bg-gradient-to-br from-[var(--background)] to-[var(--accent)]/30 flex items-center justify-center p-6">
            <Card class名称="w-full max-w-md">
                <CardHeader class名称="text-center">
                    <SourcebotLogo class名称="h-12 mb-4 mx-auto" size="large" />
                    <CardTitle class名称="text-2xl font-semibold">
                        Welcome to Sourcebot
                    </CardTitle>
                </CardHeader>
                <CardContent class名称="space-y-6">
                    <div class名称="text-center space-y-3">
                        <p class名称="text-[var(--muted-foreground)] text-[15px] leading-6">
                            You&apos;ve been invited to join this Sourcebot deployment. 注册 to get started.
                        </p>
                    </div>  

                    <AuthMethodSelector
                        providers={providers}
                        callbackUrl={`/invite?id=${inviteLinkId}`}
                        context="signup"
                        securityNoticeClosable={true}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
