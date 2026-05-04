'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, Dialog描述, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface DuplicateChatDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onDuplicate: (name: string) => Promise<string | null>;
    current名称: string;
}

export const DuplicateChatDialog = ({ isOpen, onOpenChange, onDuplicate, current名称 }: DuplicateChatDialogProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const formSchema = z.object({
        name: z.string().min(1),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    useEffect(() => {
        form.reset({
            name: `${current名称} (copy)`,
        });
    }, [current名称, form]);

    const on提交 = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
            const newChatId = await onDuplicate(data.name);
            if (newChatId) {
                form.reset();
                onOpenChange(false);
            }
        } catch (e) {
            console.error('Failed to duplicate chat', e);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!isLoading) {
                    onOpenChange(open);
                }
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Duplicate Chat</DialogTitle>
                    <Dialog描述>
                        创建 a copy of this chat to edit in a new session.
                    </Dialog描述>
                </DialogHeader>
                <Form
                    {...form}
                >
                    <form
                        class名称="space-y-4 flex flex-col w-full py-2"
                        on提交={(event) => {
                            event.stopPropagation();
                            form.handle提交(on提交)(event);
                        }}
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem
                                    class名称="flex flex-col gap-2"
                                >
                                    <FormLabel class名称="font-normal">New chat name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Enter chat name"
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
                <DialogFooter>
                    <Button
                        variant="outline"
                        disabled={isLoading}
                        onClick={(e) => {
                            e.stopPropagation();
                            onOpenChange(false);
                        }}
                    >
                        取消
                    </Button>
                    <LoadingButton
                        loading={isLoading}
                        onClick={() => {
                            form.handle提交(on提交)();
                        }}
                    >
                        Duplicate
                    </LoadingButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
