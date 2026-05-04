'use client';

import { getBrowsePath } from "@/app/(app)/browse/hooks/utils";
import { getCodeHostIcon } from "@/lib/utils";
import { CodeHostType } from "@sourcebot/db";
import Image from "next/image";
import Link from "next/link";

export const RepoBadge = ({ repo }: { repo: { name: string; display名称: string; codeHostType: CodeHostType } }) => {
    const icon = getCodeHostIcon(repo.codeHostType);
    const href = getBrowsePath({
        repo名称: repo.name,
        path: '',
        pathType: 'tree',
    });

    return (
        <Link
            href={href}
            onClick={(e) => e.stopPropagation()}
            class名称="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted hover:bg-accent text-xs font-medium transition-colors text-foreground max-w-[300px] overflow-hidden"
        >
            <Image src={icon.src} alt={repo.codeHostType} width={12} height={12} class名称={`${icon.class名称} flex-shrink-0`} />
            <span class名称="truncate">{repo.display名称.split('/').pop()}</span>
        </Link>
    );
}
