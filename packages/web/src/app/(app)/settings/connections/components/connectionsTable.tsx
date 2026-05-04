"use client"

import { DisplayDate } from "@/app/(app)/components/DisplayDate"
import { NotificationDot } from "@/app/(app)/components/notificationDot"
import { useToast } from "@/components/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { getCodeHostIcon } from "@/lib/utils"
import { ConnectionType } from "@sourcebot/db"
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
import { ArrowUpDown, RefreshCwIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"


export type Connection = {
    id: number
    name: string
    syncedAt: Date | null
    connectionType: ConnectionType
    latestJob状态: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED" | null
    isFirstTime同步: boolean
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

const get状态Badge = (status: Connection["latestJob状态"]) => {
    if (!status) {
        return "-";
    }

    const labels = {
        PENDING: "Pending",
        IN_PROGRESS: "In Progress",
        COMPLETED: "Completed",
        FAILED: "Failed",
    }

    return <Badge class名称={statusBadgeVariants({ status })}>{labels[status]}</Badge>
}

export const columns: ColumnDef<Connection>[] = [
    {
        accessorKey: "name",
        size: 400,
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    名称
                    <ArrowUpDown class名称="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const connection = row.original;
            const codeHostIcon = getCodeHostIcon(connection.connectionType);

            return (
                <div class名称="flex flex-row gap-2 items-center">
                    <Image
                        src={codeHostIcon.src}
                        alt={`${connection.connectionType} logo`}
                        class名称={codeHostIcon.class名称}
                        width={20}
                        height={20}
                    />
                    <Link href={`/settings/connections/${connection.id}`} class名称="font-medium hover:underline">
                        {connection.name}
                    </Link>
                    {connection.isFirstTime同步 && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span>
                                    <NotificationDot class名称="ml-1.5" />
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <span>This is the first time Sourcebot is syncing this connection. It may take a few minutes to complete.</span>
                            </TooltipContent>
                        </Tooltip>
                    )}
                </div>
            )
        },
    },
    {
        accessorKey: "latestJob状态",
        size: 150,
        header: "Lastest status",
        cell: ({ row }) => get状态Badge(row.getValue("latestJob状态")),
    },
    {
        accessorKey: "syncedAt",
        size: 200,
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Last synced
                    <ArrowUpDown class名称="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const syncedAt = row.getValue("syncedAt") as Date | null;
            if (!syncedAt) {
                return "-";
            }

            return (
                <DisplayDate date={syncedAt} class名称="ml-3" />
            )
        }
    },
]

export const ConnectionsTable = ({ data }: { data: Connection[] }) => {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const router = useRouter();
    const { toast } = useToast();

    const {
        numCompleted,
        numInProgress,
        numPending,
        numFailed,
        numNoJobs,
    } = useMemo(() => {
        return {
            numCompleted: data.filter((connection) => connection.latestJob状态 === "COMPLETED").length,
            numInProgress: data.filter((connection) => connection.latestJob状态 === "IN_PROGRESS").length,
            numPending: data.filter((connection) => connection.latestJob状态 === "PENDING").length,
            numFailed: data.filter((connection) => connection.latestJob状态 === "FAILED").length,
            numNoJobs: data.filter((connection) => connection.latestJob状态 === null).length,
        }
    }, [data]);

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
        onRowSelectionChange: setRowSelection,
        columnResizeMode: 'onChange',
        enableColumnResizing: false,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <div class名称="w-full">
            <div class名称="flex items-center gap-4 py-4">
                <Input
                    placeholder="Filter connections..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
                    class名称="max-w-sm"
                />
                <Select
                    value={(table.getColumn("latestJob状态")?.getFilterValue() as string) ?? "all"}
                    onValueChange={(value) => {
                        table.getColumn("latestJob状态")?.setFilterValue(value === "all" ? "" : value)
                    }}
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
                        <SelectItem value="null">No status ({numNoJobs})</SelectItem>
                    </SelectContent>
                </Select>
                <Button
                    variant="outline"
                    class名称="ml-auto"
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
            </div>
            <div class名称="rounded-md border">
                <Table style={{ width: '100%' }}>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            style={{ width: `${header.getSize()}px` }}
                                        >
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
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            style={{ width: `${cell.column.getSize()}px` }}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} class名称="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div class名称="flex items-center justify-end space-x-2 py-4">
                <div class名称="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredRowModel().rows.length} {data.length > 1 ? 'connections' : 'connection'} total
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
