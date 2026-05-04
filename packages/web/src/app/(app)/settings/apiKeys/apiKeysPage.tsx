'use client';

import { createApiKey, getUserApiKeys } from "@/actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { isServiceError } from "@/lib/utils";
import { 复制, Check, AlertTriangle, Loader2, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "@/components/hooks/use-toast";
import useCaptureEvent from "@/hooks/useCaptureEvent";
import { DataTable } from "@/components/ui/data-table";
import { columns, ApiKeyColumnInfo } from "./columns";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function ApiKeysPage({ can创建ApiKey }: { can创建ApiKey: boolean }) {
    const { toast } = useToast();
    const captureEvent = useCaptureEvent();

    const [apiKeys, setApiKeys] = useState<{ name: string; createdAt: Date; lastUsedAt: Date | null }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [is创建DialogOpen, setIs创建DialogOpen] = useState(false);
    const [newKey名称, setNewKey名称] = useState("");
    const [isCreatingKey, setIsCreatingKey] = useState(false);
    const [newly创建dKey, setNewly创建dKey] = useState<string | null>(null);
    const [copySuccess, set复制Success] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadApiKeys = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const keys = await getUserApiKeys();
            if (isServiceError(keys)) {
                setError("Failed to load API keys");
                toast({
                    title: "Error",
                    description: "Failed to load API keys",
                    variant: "destructive",
                });
                return;
            }
            setApiKeys(keys);
        } catch (error) {
            console.error(error);
            setError("Failed to load API keys");
            toast({
                title: "Error",
                description: "Failed to load API keys",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        loadApiKeys();
    }, [loadApiKeys]);

    const handle创建ApiKey = async () => {
        if (!newKey名称.trim()) {
            toast({
                title: "Error",
                description: "API key name cannot be empty",
                variant: "destructive",
            });
            return;
        }

        setIsCreatingKey(true);
        try {
            const result = await createApiKey(newKey名称.trim());
            if (isServiceError(result)) {
                toast({
                    title: "Error",
                    description: `Failed to create API key: ${result.message}`,
                    variant: "destructive",
                });
                captureEvent('wa_api_key_creation_fail', {});

                return;
            }

            setNewly创建dKey(result.key);
            await loadApiKeys();
            captureEvent('wa_api_key_created', {});
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: `Failed to create API key: ${error}`,
                variant: "destructive",
            });
            captureEvent('wa_api_key_creation_fail', {});
        } finally {
            setIsCreatingKey(false);
        }
    };

    const handle复制ApiKey = () => {
        if (!newly创建dKey) return;

        navigator.clipboard.writeText(newly创建dKey)
            .then(() => {
                set复制Success(true);
                setTimeout(() => set复制Success(false), 2000);
            })
            .catch(() => {
                toast({
                    title: "Error",
                    description: "Failed to copy API key to clipboard",
                    variant: "destructive",
                });
            });
    };

    const handle关闭Dialog = () => {
        setIs创建DialogOpen(false);
        setNewKey名称("");
        setNewly创建dKey(null);
        set复制Success(false);
    };

    const tableData = useMemo(() => {
        if (isLoading) return Array(4).fill(null).map(() => ({
            name: "",
            createdAt: "",
            lastUsedAt: null,
        }));

        if (!apiKeys) return [];

        return apiKeys.map((key): ApiKeyColumnInfo => ({
            name: key.name,
            createdAt: key.createdAt.toISOString(),
            lastUsedAt: key.lastUsedAt?.toISOString() ?? null,
        })).sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    }, [apiKeys, isLoading]);

    const tableColumns = useMemo(() => {
        if (isLoading) {
            return columns().map((column) => {
                if ('accessorKey' in column && column.accessorKey === "name") {
                    return {
                        ...column,
                        cell: () => (
                            <div class名称="flex items-center gap-2">
                                <Skeleton class名称="h-4 w-4 rounded-md" /> {/* Icon skeleton */}
                                <Skeleton class名称="h-4 w-48" /> {/* 名称 skeleton */}
                            </div>
                        ),
                    }
                }

                return {
                    ...column,
                    cell: () => <Skeleton class名称="h-4 w-24" />,
                }
            })
        }

        return columns();
    }, [isLoading]);

    if (error) {
        return <div>Error loading API keys</div>;
    }

    return (
        <div class名称="flex flex-col gap-6">
            <div class名称="flex flex-row items-center justify-between">
                <div>
                    <h3 class名称="text-lg font-medium">API Keys</h3>
                    <p class名称="text-sm text-muted-foreground max-w-lg">
                        创建 and manage API keys for programmatic access to Sourcebot. All API keys are scoped to the user who created them.
                    </p>
                </div>

                <TooltipProvider>
                    <Tooltip>
                        {!can创建ApiKey && (
                            <TooltipContent>
                                API key creation is restricted.
                            </TooltipContent>
                        )}
                        <TooltipTrigger asChild>
                            <span class名称={!can创建ApiKey ? "cursor-not-allowed" : undefined}>
                                <Dialog open={is创建DialogOpen} onOpenChange={setIs创建DialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button
                                            disabled={!can创建ApiKey}
                                            class名称={!can创建ApiKey ? "pointer-events-none" : undefined}
                                            onClick={() => {
                                                setNewly创建dKey(null);
                                                setNewKey名称("");
                                                setIs创建DialogOpen(true);
                                            }}
                                        >
                                            <Plus class名称="h-4 w-4 mr-2" />
                                            创建 API Key
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent class名称="sm:max-w-md">
                                        <DialogHeader>
                                            <DialogTitle>{newly创建dKey ? 'Your New API Key' : '创建 API Key'}</DialogTitle>
                                        </DialogHeader>

                                        {newly创建dKey ? (
                                            <div class名称="space-y-4">
                                                <div class名称="flex items-center gap-2 p-3 border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 rounded-md text-yellow-700 dark:text-yellow-400">
                                                    <AlertTriangle class名称="h-5 w-5 flex-shrink-0" />
                                                    <p class名称="text-sm">
                                                        This is the only time you&apos;ll see this API key. Make sure to copy it now.
                                                    </p>
                                                </div>

                                                <div class名称="flex items-center space-x-2">
                                                    <div class名称="bg-muted p-2 rounded-md text-sm flex-1 break-all font-mono">
                                                        {newly创建dKey}
                                                    </div>
                                                    <Button
                                                        size="icon"
                                                        variant="outline"
                                                        onClick={handle复制ApiKey}
                                                    >
                                                        {copySuccess ? (
                                                            <Check class名称="h-4 w-4 text-green-500" />
                                                        ) : (
                                                            <复制 class名称="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div class名称="py-4">
                                                <Input
                                                    value={newKey名称}
                                                    onChange={(e) => setNewKey名称(e.target.value)}
                                                    placeholder="Enter a name for your API key"
                                                    class名称="mb-2"
                                                />
                                            </div>
                                        )}

                                        <DialogFooter class名称="sm:justify-between">
                                            {newly创建dKey ? (
                                                <Button onClick={handle关闭Dialog}>
                                                    Done
                                                </Button>
                                            ) : (
                                                <>
                                                    <Button variant="outline" onClick={handle关闭Dialog}>
                                                        取消
                                                    </Button>
                                                    <Button
                                                        onClick={handle创建ApiKey}
                                                        disabled={isCreatingKey || !newKey名称.trim()}
                                                    >
                                                        {isCreatingKey && <Loader2 class名称="h-4 w-4 mr-2 animate-spin" />}
                                                        创建
                                                    </Button>
                                                </>
                                            )}
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </span>
                        </TooltipTrigger>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <DataTable
                columns={tableColumns}
                data={tableData}
                searchKey="name"
                searchPlaceholder="搜索 API keys..."
            />
        </div>
    );
}
