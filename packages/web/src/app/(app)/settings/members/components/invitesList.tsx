'use client';

import { OrgRole } from "@sourcebot/db";
import { useToast } from "@/components/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialog取消, AlertDialogContent, AlertDialog描述, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createPathWithQueryParams, isServiceError } from "@/lib/utils";
import { UserAvatar } from "@/components/userAvatar";
import { 复制, MoreVertical, 搜索 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { cancelInvite } from "@/actions";
import { useRouter } from "next/navigation";
import useCaptureEvent from "@/hooks/useCaptureEvent";
interface Invite {
    id: string;
    email: string;
    createdAt: Date;
}

interface InviteListProps {
    invites: Invite[]
    currentUserRole: OrgRole
}

export const InvitesList = ({ invites, currentUserRole }: InviteListProps) => {
    const [searchQuery, set搜索Query] = useState("")
    const [dateSort, setDateSort] = useState<"newest" | "oldest">("newest")
    const [is取消InviteDialogOpen, setIs取消InviteDialogOpen] = useState(false)
    const [inviteTo取消, setInviteTo取消] = useState<Invite | null>(null)
    const { toast } = useToast();
    const router = useRouter();
    const captureEvent = useCaptureEvent();

    const filteredInvites = useMemo(() => {
        return invites
            .filter((invite) => {
                const searchLower = searchQuery.toLowerCase();
                const matches搜索 =
                    invite.email.toLowerCase().includes(searchLower);
                return matches搜索;
            })
            .sort((a, b) => {
                return dateSort === "newest"
                    ? b.createdAt.getTime() - a.createdAt.getTime()
                    : a.createdAt.getTime() - b.createdAt.getTime()
            });
    }, [invites, searchQuery, dateSort]);

    const on取消Invite = useCallback((inviteId: string) => {
        cancelInvite(inviteId)
            .then((response) => {
                if (isServiceError(response)) {
                    toast({
                        description: `❌ Failed to cancel invite. Reason: ${response.message}`
                    })
                    captureEvent('wa_invites_list_cancel_invite_fail', {
                        errorCode: response.errorCode,
                    })
                } else {
                    toast({
                        description: `✅ Invite cancelled successfully.`
                    })
                    captureEvent('wa_invites_list_cancel_invite_success', {})
                    router.refresh();
                }
            });
    }, [toast, router, captureEvent]);

    return (
        <div class名称="w-full mx-auto space-y-6">
            <div class名称="flex gap-4 flex-col sm:flex-row">
                <div class名称="relative flex-1">
                    <搜索 class名称="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Filter by name or email..."
                        class名称="pl-9"
                        value={searchQuery}
                        onChange={(e) => set搜索Query(e.target.value)}
                    />
                </div>

                <Select value={dateSort} onValueChange={(value) => setDateSort(value as "newest" | "oldest")}>
                    <SelectTrigger class名称="w-[140px]">
                        <SelectValue placeholder="Date" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="oldest">Oldest</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div class名称="border rounded-lg overflow-hidden">
                <div class名称="max-h-[600px] overflow-y-auto divide-y">
                    {invites.length === 0 || (filteredInvites.length === 0 && searchQuery.length > 0) ? (
                        <div class名称="flex flex-col items-center justify-center h-96 p-4">
                            <p class名称="font-medium text-sm">No Pending Invitations Found</p>
                            <p class名称="text-sm text-muted-foreground mt-2">
                                {filteredInvites.length === 0 && searchQuery.length > 0 ? "No pending invitations found matching your filters." : "Use the form above to invite new members."}
                            </p>
                        </div>
                    ) : (
                        filteredInvites.map((invite) => (
                            <div key={invite.id} class名称="p-4 flex items-center justify-between bg-background">
                                <div class名称="flex items-center gap-3">
                                    <UserAvatar email={invite.email} />
                                    <div>
                                        <div class名称="text-sm text-muted-foreground">{invite.email}</div>
                                    </div>
                                </div>
                                <div class名称="flex items-center gap-4">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        class名称="gap-2"
                                        title="复制 invite link"
                                        onClick={() => {
                                            const url = createPathWithQueryParams(`${window.location.origin}/redeem?invite_id=${invite.id}`);
                                            navigator.clipboard.writeText(url)
                                                .then(() => {
                                                    toast({
                                                        description: `✅ Copied invite link for ${invite.email} to clipboard`
                                                    })
                                                    captureEvent('wa_invites_list_copy_invite_link_success', {})
                                                })
                                                .catch(() => {
                                                    toast({
                                                        description: "❌ Failed to copy invite link"
                                                    })
                                                    captureEvent('wa_invites_list_copy_invite_link_fail', {})
                                                })
                                        }}
                                    >
                                        <复制 class名称="h-4 w-4" />
                                        复制 invite link
                                    </Button>
                                    <DropdownMenu modal={false}>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" class名称="h-8 w-8 p-0">
                                                <MoreVertical class名称="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                class名称="cursor-pointer"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(invite.email)
                                                        .then(() => {
                                                            toast({
                                                                description: `✅ 邮箱 copied to clipboard.`
                                                            })
                                                            captureEvent('wa_invites_list_copy_email_success', {})
                                                        })
                                                        .catch(() => {
                                                            toast({
                                                                description: `❌ Failed to copy email.`
                                                            })
                                                            captureEvent('wa_invites_list_copy_email_fail', {})
                                                        })
                                                }}
                                            >
                                                复制 email
                                            </DropdownMenuItem>
                                            {currentUserRole === OrgRole.OWNER && (
                                                <DropdownMenuItem
                                                    class名称="cursor-pointer text-destructive"
                                                    onClick={() => {
                                                        setIs取消InviteDialogOpen(true);
                                                        setInviteTo取消(invite);
                                                    }}
                                                >
                                                    取消 invite
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <AlertDialog
                open={is取消InviteDialogOpen}
                onOpenChange={setIs取消InviteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>取消 Invite</AlertDialogTitle>
                        <AlertDialog描述>
                            Are you sure you want to cancel this invite for <strong>{inviteTo取消?.email}</strong>?
                        </AlertDialog描述>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialog取消>
                            返回
                        </AlertDialog取消>
                        <AlertDialogAction
                            class名称="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => {
                                on取消Invite(inviteTo取消?.id ?? "");
                            }}
                        >
                            取消
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}