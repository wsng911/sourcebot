import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommitsPaginationProps {
    page: number;
    perPage: number;
    totalCount: number;
    extraParams?: Record<string, string | undefined>;
}

const buildHref = (page: number, extraParams?: Record<string, string | undefined>) => {
    const params = new URL搜索Params();
    params.set('page', String(page));
    if (extraParams) {
        for (const [key, value] of Object.entries(extraParams)) {
            if (value !== undefined && value !== '') {
                params.set(key, value);
            }
        }
    }
    return `?${params.toString()}`;
};

export const CommitsPagination = ({ page, perPage, totalCount, extraParams }: CommitsPaginationProps) => {
    const hasPrev = page > 1;
    const hasNext = page * perPage < totalCount;

    if (!hasPrev && !hasNext) {
        return null;
    }

    const linkClass = "flex flex-row items-center gap-1 text-sm text-primary hover:underline";
    const disabledClass = "flex flex-row items-center gap-1 text-sm text-muted-foreground cursor-not-allowed";

    return (
        <div class名称="flex flex-row items-center justify-center gap-6 py-6">
            {hasPrev ? (
                <Link href={buildHref(page - 1, extraParams)} class名称={linkClass}>
                    <ChevronLeft class名称="h-4 w-4" />
                    Previous
                </Link>
            ) : (
                <span class名称={cn(disabledClass)} aria-disabled="true">
                    <ChevronLeft class名称="h-4 w-4" />
                    Previous
                </span>
            )}
            {hasNext ? (
                <Link href={buildHref(page + 1, extraParams)} class名称={linkClass}>
                    Next
                    <ChevronRight class名称="h-4 w-4" />
                </Link>
            ) : (
                <span class名称={cn(disabledClass)} aria-disabled="true">
                    Next
                    <ChevronRight class名称="h-4 w-4" />
                </span>
            )}
        </div>
    );
};
