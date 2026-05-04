'use client';

import { getBrowsePath } from "@/app/(app)/browse/hooks/utils";
import { cn, getCodeHostIcon } from "@/lib/utils";
import { CodeHostType } from "@sourcebot/db";
import Image from "next/image";
import Link from "next/link";

type RepoInfo = {
    display名称: string;
    codeHostType: CodeHostType;
};

export const RepoHeader = ({ repo, repo名称, isPrimary }: { repo: RepoInfo | undefined; repo名称: string; isPrimary: boolean }) => {
    const display名称 = repo?.display名称 ?? repo名称.split('/').slice(1).join('/');
    const icon = repo ? getCodeHostIcon(repo.codeHostType) : null;

    const href = getBrowsePath({
        repo名称: repo名称,
        path: '',
        pathType: 'tree',
    });

    const class名称 = cn("top-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-popover border-b border-border",
        {
            'sticky text-muted-foreground': !isPrimary,
            'text-foreground cursor-pointer hover:bg-accent transition-colors': isPrimary,
        }
    );

    const Content = (
        <>
            {icon && (
                <Image src={icon.src} alt={repo!.codeHostType} width={12} height={12} class名称={icon.class名称} />
            )}
            <span>{display名称}</span>
        </>
    );

    if (isPrimary) {
        return (
            <Link class名称={class名称} href={href}>
                {Content}
            </Link>
        );
    } else {
        return (
            <div class名称={class名称}>
                {Content}
            </div>
        );
    }
}
