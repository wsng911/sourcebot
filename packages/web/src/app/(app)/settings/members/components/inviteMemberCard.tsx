'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, Card描述, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCallback, useState } from "react";
import { z } from "zod";
import { PlusCircleIcon, Loader2, AlertCircle } from "lucide-react";
import { OrgRole } from "@prisma/client";
import { AlertDialog, AlertDialogAction, AlertDialog取消, AlertDialogContent, AlertDialog描述, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { createInvites } from "@/actions";
import { isServiceError } from "@/lib/utils";
import { useToast } from "@/components/hooks/use-toast";
import { useRouter } from "next/navigation";
import useCaptureEvent from "@/hooks/useCaptureEvent";
export const inviteMemberFormSchema = z.object({
    emails: z.array(z.object({
        email: z.string().email()
    }))
    .refine((emails) => {
        const emailSet = new Set(emails.map(e => e.email.toLowerCase()));
        return emailSet.size === emails.length;
    }, "Duplicate email addresses are not allowed")
});

interface InviteMemberCardProps {
    currentUserRole: OrgRole;
    seatsAvailable?: boolean;
}

export const InviteMemberCard = ({ currentUserRole, seatsAvailable = true }: InviteMemberCardProps) => {
    const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const captureEvent = useCaptureEvent();

    const form = useForm<z.infer<typeof inviteMemberFormSchema>>({
        resolver: zodResolver(inviteMemberFormSchema),
        defaultValues: {
            emails: [{ email: "" }]
        },
    });

    const add邮箱Field = useCallback(() => {
        const emails = form.getValues().emails;
        form.setValue('emails', [...emails, { email: "" }]);
    }, [form]);

    const on提交 = useCallback((data: z.infer<typeof inviteMemberFormSchema>) => {
        setIsLoading(true);
        createInvites(data.emails.map(e => e.email))
            .then((res) => {
                if (isServiceError(res)) {
                    toast({
                        description: `❌ Failed to invite members. Reason: ${res.message}`
                    });
                    captureEvent('wa_invite_member_card_invite_fail', {
                        errorCode: res.errorCode,
                        num_emails: data.emails.length,
                    });
                } else {
                    form.reset();
                    router.push(`?tab=invites`);
                    toast({
                        description: `✅ Successfully invited ${data.emails.length} members`
                    });
                    captureEvent('wa_invite_member_card_invite_success', {
                        num_emails: data.emails.length,
                    });
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [form, toast, router, captureEvent]);

    const isDisabled = !seatsAvailable || currentUserRole !== OrgRole.OWNER || isLoading;

    return (
        <>
            <Card class名称={!seatsAvailable ? "opacity-70" : ""}>
                <CardHeader>
                    <CardTitle>Invite Member</CardTitle>
                    <Card描述>Invite new members to your organization.</Card描述>
                </CardHeader>
                {!seatsAvailable && (
                    <div class名称="px-6 mb-4">
                        <div class名称="flex items-start space-x-2.5 p-3 rounded-md border border-gray-700 bg-gray-800/50 text-gray-200 shadow-md">
                            <AlertCircle class名称="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                            <div class名称="flex-1">
                                <p class名称="text-sm font-medium leading-tight text-white">
                                    Maximum seats reached
                                </p>
                                <p class名称="text-xs mt-1 text-gray-300">
                                    You&apos;ve reached the maximum number of seats for your license. Upgrade your plan to invite additional members.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                <Form {...form}>
                    <form on提交={form.handle提交(() => setIsInviteDialogOpen(true))}>
                        <CardContent class名称="space-y-4">
                            <FormLabel>邮箱 添加ress</FormLabel>
                            {form.watch('emails').map((_, index) => (
                                <FormField
                                    key={index}
                                    control={form.control}
                                    name={`emails.${index}.email`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    class名称="max-w-md"
                                                    placeholder="melissa@example.com"
                                                    disabled={isDisabled}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                            {form.formState.errors.emails?.root?.message && (
                                <FormMessage>{form.formState.errors.emails.root.message}</FormMessage>
                            )}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={add邮箱Field}
                                disabled={isDisabled}
                            >
                                <PlusCircleIcon class名称="w-4 h-4 mr-0.5" />
                                添加 more
                            </Button>
                        </CardContent>
                        <CardFooter class名称="flex justify-end">
                            <Button
                                size="sm"
                                type="submit"
                                disabled={isDisabled}
                            >
                                {isLoading && <Loader2 class名称="w-4 h-4 mr-0.5 animate-spin" />}
                                Invite
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
            <AlertDialog
                open={isInviteDialogOpen}
                onOpenChange={setIsInviteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Invite Team Members</AlertDialogTitle>
                        <AlertDialog描述>
                            {`Your team is growing! By confirming, you will be inviting ${form.getValues().emails.length} new members to your organization.`}
                        </AlertDialog描述>
                    </AlertDialogHeader>
                    <div class名称="border rounded-lg overflow-hidden">
                        <div class名称="max-h-[400px] overflow-y-auto divide-y">
                            {form.getValues().emails.map(({ email }, index) => (
                                <p
                                    key={index}
                                    class名称="text-sm p-2"
                                >
                                    {email}
                                </p>
                            ))}
                        </div>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialog取消 onClick={() => captureEvent('wa_invite_member_card_invite_cancel', {
                            num_emails: form.getValues().emails.length,
                        })}>取消</AlertDialog取消>
                        <AlertDialogAction
                            onClick={() => on提交(form.getValues())}
                        >
                            Invite
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}