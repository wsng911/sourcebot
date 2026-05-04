'use client';

import { OrgRole } from "@sourcebot/db";
import { useToast } from "@/components/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialog取消, AlertDialogContent, AlertDialog描述, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { isServiceError } from "@/lib/utils";
import { UserAvatar } from "@/components/userAvatar";
import { CheckCircle, 搜索, XCircle } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { approveAccountRequest, rejectAccountRequest } from "@/actions";
import { useRouter } from "next/navigation";
import useCaptureEvent from "@/hooks/useCaptureEvent";

interface Request {
    id: string;
    email: string;
    createdAt: Date;
    name?: string;
    image?: string;
}

interface RequestsListProps {
    requests: Request[]
    currentUserRole: OrgRole
}

export const RequestsList = ({ requests, currentUserRole }: RequestsListProps) => {
    const [searchQuery, set搜索Query] = useState("")
    const [dateSort, setDateSort] = useState<"newest" | "oldest">("newest")
    const [isApproveRequestDialogOpen, setIsApproveRequestDialogOpen] = useState(false)
    const [isRejectRequestDialogOpen, setIsRejectRequestDialogOpen] = useState(false)
    const [requestToAction, setRequestToAction] = useState<Request | null>(null)
    const { toast } = useToast();
    const router = useRouter();
    const captureEvent = useCaptureEvent();

    const filteredRequests = useMemo(() => {
        return requests
            .filter((request) => {
                const searchLower = searchQuery.toLowerCase();
                const matches搜索 =
                    request.email.toLowerCase().includes(searchLower) ||
                    (request.name?.toLowerCase().includes(searchLower) || false);
                return matches搜索;
            })
            .sort((a, b) => {
                return dateSort === "newest"
                    ? b.createdAt.getTime() - a.createdAt.getTime()
                    : a.createdAt.getTime() - b.createdAt.getTime()
            });
    }, [requests, searchQuery, dateSort]);

    const onApproveRequest = useCallback((requestId: string) => {
        approveAccountRequest(requestId)
            .then((response) => {
                if (isServiceError(response)) {
                    toast({
                        description: `❌ Failed to approve request. Reason: ${response.message}`
                    })
                    captureEvent('wa_requests_list_approve_request_fail', {
                        errorCode: response.errorCode,
                    })
                } else {
                    toast({
                        description: `✅ Request approved successfully.`
                    })
                    captureEvent('wa_requests_list_approve_request_success', {})
                    router.refresh();
                }
            });
    }, [toast, router, captureEvent]);

    const onRejectRequest = useCallback((requestId: string) => {
        rejectAccountRequest(requestId)
            .then((response) => {
                if (isServiceError(response)) {
                    toast({
                        description: `❌ Failed to reject request.`
                    })
                    captureEvent('wa_requests_list_reject_request_fail', {
                        errorCode: response.errorCode,
                    })
                } else {
                    toast({
                        description: `✅ Request rejected successfully.`
                    })
                    captureEvent('wa_requests_list_reject_request_success', {})
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
                    {requests.length === 0 || (filteredRequests.length === 0 && searchQuery.length > 0) ? (
                        <div class名称="flex flex-col items-center justify-center h-96 p-4">
                            <p class名称="font-medium text-sm">No Pending Requests Found</p>
                            <p class名称="text-sm text-muted-foreground mt-2">
                                {filteredRequests.length === 0 && searchQuery.length > 0 ? "No pending requests found matching your filters." : "There are currently no pending requests to join your organization."}
                            </p>
                        </div>
                    ) : (
                        filteredRequests.map((request) => (
                            <div key={request.id} class名称="p-4 flex items-center justify-between bg-background">
                                <div class名称="flex items-center gap-3">
                                    <UserAvatar email={request.email} imageUrl={request.image} />
                                    <div>
                                        <div class名称="font-medium">{request.name || request.email}</div>
                                        <div class名称="text-sm text-muted-foreground">{request.email}</div>
                                    </div>
                                </div>
                                <div class名称="flex items-center gap-2">
                                    {currentUserRole === OrgRole.OWNER && (
                                        <>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                class名称="gap-2"
                                                onClick={() => {
                                                    setRequestToAction(request);
                                                    setIsApproveRequestDialogOpen(true);
                                                }}
                                            >
                                                <CheckCircle class名称="h-4 w-4" />
                                                Approve
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                class名称="gap-2 text-destructive border-destructive hover:bg-destructive/10"
                                                onClick={() => {
                                                    setRequestToAction(request);
                                                    setIsRejectRequestDialogOpen(true);
                                                }}
                                            >
                                                <XCircle class名称="h-4 w-4" />
                                                Reject
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Approve Request Dialog */}
            <AlertDialog
                open={isApproveRequestDialogOpen}
                onOpenChange={setIsApproveRequestDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Approve Request</AlertDialogTitle>
                        <AlertDialog描述>
                            Are you sure you want to approve the request from <strong>{requestToAction?.email}</strong>? They will be added as a member to your organization.
                        </AlertDialog描述>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialog取消>
                            返回
                        </AlertDialog取消>
                        <AlertDialogAction
                            class名称="bg-primary text-primary-foreground hover:bg-primary/90"
                            onClick={() => {
                                onApproveRequest(requestToAction?.id ?? "");
                            }}
                        >
                            Approve
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Reject Request Dialog */}
            <AlertDialog
                open={isRejectRequestDialogOpen}
                onOpenChange={setIsRejectRequestDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Reject Request</AlertDialogTitle>
                        <AlertDialog描述>
                            Are you sure you want to reject the request from <strong>{requestToAction?.email}</strong>?
                        </AlertDialog描述>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialog取消>
                            返回
                        </AlertDialog取消>
                        <AlertDialogAction
                            class名称="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => {
                                onRejectRequest(requestToAction?.id ?? "");
                            }}
                        >
                            Reject
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
} 