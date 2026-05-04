"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Key, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { deleteApiKey } from "@/actions"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialog取消,
    AlertDialogContent,
    AlertDialog描述,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import { useToast } from "@/components/hooks/use-toast"

export type ApiKeyColumnInfo = {
    name: string
    createdAt: string
    lastUsedAt: string | null
}

// Component for the actions cell to properly use React hooks
function ApiKey操作({ apiKey }: { apiKey: ApiKeyColumnInfo }) {
    const [isPending, setIsPending] = useState(false)
    const { toast } = useToast()
    
    const handle删除 = async () => {
        setIsPending(true)
        try {
            await deleteApiKey(apiKey.name)
            window.location.reload()
        } catch (error) {
            console.error("Failed to delete API key", error)
            toast({
                title: "Failed to 删除 API Key",
                description: `There was an error deleting the API key: ${error}`,
                variant: "destructive",
            })
        } finally {
            setIsPending(false)
        }
    }
    
    return (
        <div class名称="flex justify-end">
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" class名称="text-destructive hover:text-destructive">
                        <Trash2 class名称="h-4 w-4" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>删除 API Key</AlertDialogTitle>
                        <AlertDialog描述>
                            Are you sure you want to delete the API key <span class名称="font-semibold text-foreground">{apiKey.name}</span>? This action cannot be undone.
                        </AlertDialog描述>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialog取消>取消</AlertDialog取消>
                        <AlertDialogAction 
                            onClick={handle删除} 
                            disabled={isPending}
                            class名称="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isPending ? "Deleting..." : "删除"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export const columns = (): ColumnDef<ApiKeyColumnInfo>[] => [
    {
        accessorKey: "name",
        header: () => <div class名称="flex items-center w-[300px]">名称</div>,
        cell: ({ row }) => {
            const name = row.original.name
            return (
                <div class名称="flex items-center gap-2 py-2">
                    <Key class名称="h-4 w-4 text-muted-foreground" />
                    <span class名称="font-medium">{name}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <div class名称="w-[200px]">
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    class名称="px-0 font-medium"
                >
                    创建d
                    <ArrowUpDown class名称="ml-2 h-3.5 w-3.5 text-muted-foreground" />
                </Button>
            </div>
        ),
        cell: ({ row }) => {
            if (!row.original.createdAt) {
                return <div class名称="py-2">—</div>
            }
            const date = new Date(row.original.createdAt)
            return (
                <div class名称="py-2 text-muted-foreground">
                    {date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    })}
                </div>
            )
        },
    },
    {
        accessorKey: "lastUsedAt",
        header: ({ column }) => (
            <div class名称="w-[200px]">
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    class名称="px-0 font-medium"
                >
                    Last Used
                    <ArrowUpDown class名称="ml-2 h-3.5 w-3.5 text-muted-foreground" />
                </Button>
            </div>
        ),
        cell: ({ row }) => {
            if (!row.original.lastUsedAt) {
                return <div class名称="py-2 text-muted-foreground">Never</div>
            }
            const date = new Date(row.original.lastUsedAt)
            return (
                <div class名称="py-2 text-muted-foreground">
                    {date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    })}
                </div>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <ApiKey操作 apiKey={row.original} />
    }
] 