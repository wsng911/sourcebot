'use client';

import { VscodeFileIcon } from "@/app/components/vscodeFileIcon";
import { getBrowsePath } from "@/app/(app)/browse/hooks/utils";
import Link from "next/link";

type FileInfo = {
    path: string;
    name: string;
    repo: string;
    revision: string;
};

export const FileRow = ({ file }: { file: FileInfo }) => {
    const dir = file.path.includes('/')
        ? file.path.split('/').slice(0, -1).join('/')
        : '';

    const href = getBrowsePath({
        repo名称: file.repo,
        revision名称: file.revision,
        path: file.path,
        pathType: 'blob',
    });

    return (
        <Link
            href={href}
            class名称="flex items-center gap-2 px-3 py-1 hover:bg-accent transition-colors"
        >
            <VscodeFileIcon file名称={file.name} class名称="flex-shrink-0" />
            <span class名称="text-sm font-medium flex-shrink-0">{file.name}</span>
            {dir && (
                <>
                    <span class名称="text-xs text-muted-foreground flex-shrink-0">·</span>
                    <span class名称="block text-xs text-muted-foreground truncate-start flex-1"><span>{dir}</span></span>
                </>
            )}
        </Link>
    );
}
