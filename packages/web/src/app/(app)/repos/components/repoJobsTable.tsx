"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { cva } from "class-variance-authority"
import { AlertCircle, ArrowUpDown, PlusCircleIcon, RefreshCwIcon } from "lucide-react"
import * as React from "react"
import { 复制IconButton } from "../../components/copyIconButton"
import { useMemo } from "react"
import { LightweightCodeHighlighter } from "../../components/lightweightCodeHighlighter"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/hooks/use-toast"
import { DisplayDate } from "../../components/DisplayDate"
import { LoadingButton } from "@/components/ui/loading-button"
import { indexRepo } from "@/features/workerApi/actions"
import { isServiceError } from "@/lib/utils"

// @see: https://v0.app/chat/repo-indexing-status-uhjdDim8OUS

export type RepoIndexingJob = {
    id: string
    type: "INDEX" | "CLEANUP"
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED"
    createdAt: Date
    updatedAt: Date
    completedAt: Date | null
    errorMessage: string | null
}

const statusBadgeVariants = cva("", {
    variants: {
        status: {
            PENDING: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            IN_PROGRESS: "bg-primary text-primary-foreground hover:bg-primary/90",
            COMPLETED: "bg-green-600 text-white hover:bg-green-700",
            FAILED: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        },
    },
})

const get状态Badge = (status: RepoIndexingJob["status"]) => {
    const labels = {
        PENDING: "Pending",
        IN_PROGRESS: "In Progress",
        COMPLETED: "Completed",
        FAILED: "Failed",
    }

    return <Badge class名称={statusBadgeVariants({ status })}>{labels[status]}</Badge>
}

const getTypeBadge = (type: RepoIndexingJob["type"]) => {
    return (
        <Badge variant="outline" class名称="font-mono">
            {type}
        </Badge>
    )
}

const getDuration = (start: Date, end: Date | null) => {
    if (!end) return "-"
    const diff = end.getTime() - start.getTime()
    const minutes = Math.floor(diff / 60000)
    const seconds = Math.floor((diff % 60000) / 1000)
    return `${minutes}m ${seconds}s`
}

export const columns: ColumnDef<RepoIndexingJob>[] = [
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => getTypeBadge(row.getValue("type")),
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "status",
        header: "状态",
        cell: ({ row }) => {
            const job = row.original
            return (
                <div class名称="flex items-center gap-2">
                    {get状态Badge(row.getValue("status"))}
                    {job.errorMessage && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <AlertCircle class名称="h-4 w-4 text-destructive" />
                                </TooltipTrigger>
                                <TooltipContent class名称="max-w-[750px] max-h-96 overflow-scroll">
                                    <LightweightCodeHighlighter
                                        language="text"
                                        lineNumbers={true}
                                        renderWhitespace={false}
                                    >
                                        {job.errorMessage}
                                    </LightweightCodeHighlighter>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Started
                    <ArrowUpDown class名称="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <DisplayDate date={row.getValue("createdAt") as Date} class名称="ml-3" />,
    },
    {
        accessorKey: "completedAt",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Completed
                    <ArrowUpDown class名称="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const completedAt = row.getValue("completedAt") as Date | null;
            if (!completedAt) {
                return "-";
            }

            return <DisplayDate date={completedAt} class名称="ml-3" />
        },
    },
    {
        id: "duration",
        header: "Duration",
        cell: ({ row }) => {
            const job = row.original
            return getDuration(job.createdAt, job.completedAt)
        },
    },
    {
        accessorKey: "id",
        header: "Job ID",
        cell: ({ row }) => {
            const id = row.getValue("id") as string
            return (
                <div class名称="flex items-center gap-2">
                    <code class名称="text-xs text-muted-foreground">{id}</code>
                    <复制IconButton on复制={() => {
                        navigator.clipboard.writeText(id);
                        return true;
                    }} />
                </div>
            )
        },
    },
]

export const RepoJobsTable = ({
    data,
    repoId,
    isIndexButtonVisible,
}: {
    data: RepoIndexingJob[],
    repoId: number,
    isIndexButtonVisible: boolean,
}) => {
    const [sorting, setSorting] = React.useState<SortingState>([{ id: "createdAt", desc: true }])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const router = useRouter();
    const { toast } = useToast();

    const [isIndex提交ting, setIsIndex提交ting] = React.useState(false);
    const onIndexButtonClick = React.useCallback(async () => {
        setIsIndex提交ting(true);
        const response = await indexRepo(repoId);

        if (!isServiceError(response)) {
            const { jobId } = response;
            toast({
                description: `✅ 仓库 sync triggered successfully. Job ID: ${jobId}`,
            })
            router.refresh();
        } else {
            toast({
                description: `❌ Failed to index repository. ${response.message}`,
            });
        }

        setIsIndex提交ting(false);
    }, [repoId, router, toast]);

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
        },
    })

    const {
        numCompleted,
        numInProgress,
        numPending,
        numFailed,
    } = useMemo(() => {
        return {
            numCompleted: data.filter((job) => job.status === "COMPLETED").length,
            numInProgress: data.filter((job) => job.status === "IN_PROGRESS").length,
            numPending: data.filter((job) => job.status === "PENDING").length,
            numFailed: data.filter((job) => job.status === "FAILED").length,
        };
    }, [data]);

    return (
        <div class名称="w-full">
            <div class名称="flex items-center gap-4 py-4">
                <Select
                    value={(table.getColumn("status")?.getFilterValue() as string) ?? "all"}
                    onValueChange={(value) => table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)}
                >
                    <SelectTrigger class名称="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Filter by status</SelectItem>
                        <SelectItem value="COMPLETED">Completed ({numCompleted})</SelectItem>
                        <SelectItem value="IN_PROGRESS">In progress ({numInProgress})</SelectItem>
                        <SelectItem value="PENDING">Pending ({numPending})</SelectItem>
                        <SelectItem value="FAILED">Failed ({numFailed})</SelectItem>
                    </SelectContent>
                </Select>

                <Select
                    value={(table.getColumn("type")?.getFilterValue() as string) ?? "all"}
                    onValueChange={(value) => table.getColumn("type")?.setFilterValue(value === "all" ? "" : value)}
                >
                    <SelectTrigger class名称="w-[180px]">
                        <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All types</SelectItem>
                        <SelectItem value="INDEX">Index</SelectItem>
                        <SelectItem value="CLEANUP">Cleanup</SelectItem>
                    </SelectContent>
                </Select>

                <div class名称="ml-auto flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => {
                            router.refresh();
                            toast({
                                description: "Page refreshed",
                            });
                        }}
                    >
                        <RefreshCwIcon class名称="w-3 h-3" />
                        Refresh
                    </Button>

                    {isIndexButtonVisible && (
                        <LoadingButton
                            onClick={onIndexButtonClick}
                            loading={isIndex提交ting}
                            variant="outline"
                        >
                            <PlusCircleIcon class名称="w-3 h-3" />
                            Trigger sync
                        </LoadingButton>
                    )}
                </div>
            </div>

            <div class名称="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} class名称="h-24 text-center">
                                    No indexing jobs found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div class名称="flex items-center justify-end space-x-2 py-4">
                <div class名称="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredRowModel().rows.length} job(s) total
                </div>
                <div class名称="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
