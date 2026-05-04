"use client"

import * as React from "react"
import {
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getCodeHostBrowseAtBranchUrl } from "@/lib/utils"
import Link from "next/link"
import { CodeHostType } from "@sourcebot/db";

type RepoBranchesTableProps = {
    indexRevisions: string[];
    repoWebUrl: string | null;
    repoCodeHostType: CodeHostType;
}

export const RepoBranchesTable = ({ indexRevisions, repoWebUrl, repoCodeHostType }: RepoBranchesTableProps) => {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

    const columns = React.useMemo<ColumnDef<string>[]>(() => {
        return [
            {
                id: "ref名称",
                accessorFn: (row) => row,
                header: "Revision",
                cell: ({ row }) => {
                    const ref名称 = row.original;
                    const shortRef名称 = ref名称.replace(/^refs\/(heads|tags)\//, "");

                    const branchUrl = getCodeHostBrowseAtBranchUrl({
                        webUrl: repoWebUrl,
                        codeHostType: repoCodeHostType,
                        branch名称: ref名称,
                    });

                    return branchUrl ? (
                        <Link
                            href={branchUrl}
                            class名称="font-mono text-sm text-link hover:underline"
                            target="_blank"
                        >
                            {shortRef名称}
                        </Link>
                    ) : (
                        <span
                            class名称="font-mono text-sm text-muted-foreground"
                            title="This revision is not indexed"
                        >
                            {shortRef名称}
                        </span>
                    )
                },
            }
        ]
    }, [repoCodeHostType, repoWebUrl]);

    const table = useReactTable({
        data: indexRevisions,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        state: {
            sorting,
            columnFilters,
        },
        initialState: {
            pagination: {
                pageSize: 5,
            },
        },
    })

    return (
        <div class名称="space-y-4">
            <div class名称="flex items-center gap-2">
                <Input
                    placeholder="Filter branches..."
                    value={(table.getColumn("ref名称")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => table.getColumn("ref名称")?.setFilterValue(event.target.value)}
                    class名称="max-w-sm"
                />
            </div>

            <div class名称="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
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
                                    No branches found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div class名称="flex items-center justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                    Previous
                </Button>
                <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                    Next
                </Button>
            </div>
        </div>
    )
}
