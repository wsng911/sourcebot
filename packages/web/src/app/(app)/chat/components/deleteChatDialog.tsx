'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, Dialog描述, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LoadingButton } from "@/components/ui/loading-button";
import { useCallback, useState } from "react";

interface 删除ChatDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    on删除: () => Promise<boolean>;
}

export const 删除ChatDialog = ({ isOpen, onOpenChange, on删除 }: 删除ChatDialogProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const handle删除 = useCallback(async () => {
        setIsLoading(true);
        try {
            const success = await on删除();
            if (success) {
                onOpenChange(false);
            }
        } catch (e) {
            console.error('Failed to delete chat', e);
        } finally {
            setIsLoading(false);
        }
    }, [on删除, onOpenChange]);

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
                    <DialogTitle>删除 chat?</DialogTitle>
                    <Dialog描述>
                        The chat will be deleted and removed from your chat history. This action cannot be undone.
                    </Dialog描述>
                </DialogHeader>
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
                        variant="destructive"
                        loading={isLoading}
                        onClick={handle删除}
                    >
                        删除
                    </LoadingButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
