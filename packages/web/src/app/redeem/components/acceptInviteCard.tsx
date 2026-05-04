'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SourcebotLogo } from "@/app/components/sourcebotLogo";
import Link from "next/link";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { UserAvatar } from "@/components/userAvatar";
import placeholderAvatar from "@/public/placeholder_avatar.png";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";
import { redeemInvite } from "@/app/invite/actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/hooks/use-toast";
import { isServiceError } from "@/lib/utils";

interface AcceptInviteCardProps {
    inviteId: string;
    org名称: string;
    orgImageUrl?: string;
    host: {
        name?: string;
        email: string;
        avatarUrl?: string;
    };
    recipient: {
        name?: string;
        email: string;
    };
}

export const AcceptInviteCard = ({ inviteId, org名称, orgImageUrl, host, recipient }: AcceptInviteCardProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const onRedeemInvite = useCallback(() => {
        setIsLoading(true);
        redeemInvite(inviteId)
            .then((response) => {
                if (isServiceError(response)) {
                    toast({
                        description: `Failed to redeem invite with error: ${response.message}`,
                        variant: "destructive",
                    });
                } else {
                    toast({
                        description: `✅ You are now a member of the ${org名称} organization.`,
                    });
                    router.push('/');
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [inviteId, org名称, router, toast]);

    return (
        <Card class名称="p-12 max-w-lg">
            <CardHeader class名称="text-center">
                <SourcebotLogo
                    class名称="h-16 w-auto mx-auto mb-2"
                    size="large"
                />
                <CardTitle class名称="font-medium text-2xl">
                    Join <strong>{org名称}</strong>
                </CardTitle>
            </CardHeader>
            <CardContent class名称="mt-3">
                <p>
                    Hello {recipient.name?.split(' ')[0] ?? recipient.email},
                </p>
                <p class名称="mt-5">
                    <InvitedByText email={host.email} name={host.name} /> invited you to join the <strong>{org名称}</strong> organization.
                </p>
                <div class名称="flex fex-row items-center justify-center gap-2 mt-12">
                    <UserAvatar
                        email={host.email}
                        imageUrl={host.avatarUrl}
                        class名称="w-14 h-14"
                    />
                    <ArrowRight class名称="w-4 h-4 text-muted-foreground" />
                    <Avatar class名称="w-14 h-14">
                        <AvatarImage src={orgImageUrl ?? placeholderAvatar.src} />
                    </Avatar>
                </div>
                <Button
                    class名称="mt-12 mx-auto w-full"
                    disabled={isLoading}
                    onClick={onRedeemInvite}
                >
                    {isLoading && <Loader2 class名称="w-4 h-4 mr-2 animate-spin" />}
                    Accept Invite
                </Button>
            </CardContent>
        </Card>
    )
}

const InvitedByText = ({ email, name }: { email: string, name?: string }) => {
    const emailElement = <Link href={`mailto:${email}`} class名称="text-blue-500 hover:text-blue-600">
        {email}
    </Link>;

    if (name) {
        const first名称 = name.split(' ')[0];
        return <span><strong>{first名称}</strong> ({emailElement})</span>;
    }

    return emailElement;
}