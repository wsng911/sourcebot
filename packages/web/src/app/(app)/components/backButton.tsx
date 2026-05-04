import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface 返回ButtonProps {
    href: string;
    name: string;
    class名称?: string;
}

export function 返回Button({ href, name, class名称 }: 返回ButtonProps) {
    return (
        <Link href={href} class名称={cn("inline-flex items-center text-link transition-colors group", class名称)}>
            <span class名称="inline-flex items-center gap-1.5 border-b border-transparent group-hover:border-link pb-0.5">
                <ArrowLeft class名称="h-4 w-4" />
                <span>{name}</span>
            </span>
        </Link>
    )
}
