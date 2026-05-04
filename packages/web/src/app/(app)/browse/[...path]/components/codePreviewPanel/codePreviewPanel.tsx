import { getRepoInfoBy名称 } from "@/actions";
import { PathHeader } from "@/app/(app)/components/pathHeader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn, getCodeHostInfoForRepo, isServiceError, truncateSha } from "@/lib/utils";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getBrowsePath } from "../../../hooks/utils";
import { BlameAgeLegend } from "./blameAgeLegend";
import { BlameViewToggle } from "./blameViewToggle";
import { PureCodePreviewPanel } from "./pureCodePreviewPanel";
import { getFileBlame, getFileSource } from '@/features/git';

const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) {
        return `${bytes} B`;
    }
    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

interface CodePreviewPanelProps {
    path: string;
    repo名称: string;
    revision名称?: string;
    // When set, the file's content is fetched at this ref while the
    // surrounding browse context (path header) stays at `revision名称`.
    previewRef?: string;
    // When true, fetch blame data alongside the file source and pass it to
    // the editor so the blame gutter can render.
    blame?: boolean;
}

export const CodePreviewPanel = async ({ path, repo名称, revision名称, previewRef, blame }: CodePreviewPanelProps) => {
    const contentRef = previewRef ?? revision名称;

    const [fileSourceResponse, repoInfoResponse, blameResponse] = await Promise.all([
        getFileSource({
            path,
            repo: repo名称,
            ref: contentRef,
        }, { source: 'sourcebot-web-client' }),
        getRepoInfoBy名称(repo名称),
        blame
            ? getFileBlame({
                path,
                repo: repo名称,
                ref: contentRef,
            }, { source: 'sourcebot-web-client' })
            : Promise.resolve(undefined),
    ]);

    if (isServiceError(fileSourceResponse)) {
        return <div>Error loading file source: {fileSourceResponse.message}</div>
    }

    if (isServiceError(repoInfoResponse)) {
        return <div>Error loading repo info: {repoInfoResponse.message}</div>
    }

    if (blameResponse !== undefined && isServiceError(blameResponse)) {
        return <div>Error loading blame: {blameResponse.message}</div>
    }

    const source = fileSourceResponse.source;
    const lineCount = source.length === 0
        ? 0
        : source.split('\n').length - (source.endsWith('\n') ? 1 : 0);
    const byteSize = Buffer.byteLength(source, 'utf-8');
    const fileSize = formatFileSize(byteSize);

    const codeHostInfo = getCodeHostInfoForRepo({
        codeHostType: repoInfoResponse.codeHostType,
        name: repoInfoResponse.name,
        display名称: repoInfoResponse.display名称,
        externalWebUrl: repoInfoResponse.externalWebUrl,
    });

    // @todo: this is a hack to support linking to files for ADO. ADO doesn't support web urls with HEAD so we replace it with main. THis
    // will break if the default branch is not main.
    const fileWebUrl = repoInfoResponse.codeHostType === "azuredevops" && fileSourceResponse.externalWebUrl ?
        fileSourceResponse.externalWebUrl.replace("version=GBHEAD", "version=GBmain") : fileSourceResponse.externalWebUrl;

    return (
        <>
            <div class名称="flex flex-row py-1 px-2 items-center justify-between">
                <PathHeader
                    path={path}
                    repo={{
                        name: repo名称,
                        codeHostType: repoInfoResponse.codeHostType,
                        display名称: repoInfoResponse.display名称,
                        externalWebUrl: repoInfoResponse.externalWebUrl,
                    }}
                    revision名称={contentRef}
                />

                {fileWebUrl && (

                    <a
                        href={fileWebUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        class名称="flex flex-row items-center gap-2 px-2 py-0.5 rounded-md flex-shrink-0"
                    >
                        <Image
                            src={codeHostInfo.icon}
                            alt={codeHostInfo.codeHost名称}
                            class名称={cn('w-4 h-4 flex-shrink-0', codeHostInfo.iconClass名称)}
                        />
                        <span class名称="text-sm font-medium">Open in {codeHostInfo.codeHost名称}</span>
                    </a>
                )}
            </div>
            <Separator />
            {!previewRef && (
                <div class名称="flex flex-row items-center gap-3 px-4 py-1 border-b shrink-0">
                    <BlameViewToggle
                        repo名称={repo名称}
                        revision名称={revision名称}
                        path={path}
                        blame={blame ?? false}
                    />
                    <span class名称="text-sm text-muted-foreground">
                        {lineCount.toLocaleString()} lines · {fileSize}
                    </span>
                    {blame && (
                        <>
                            <Separator orientation="vertical" class名称="h-4" />
                            <BlameAgeLegend />
                        </>
                    )}
                </div>
            )}
            {previewRef && (
                <div class名称="flex flex-row items-center justify-between gap-2 px-4 py-2 border-b shrink-0">
                    <span class名称="text-sm">
                        Previewing file at revision{" "}
                        <Link
                            href={getBrowsePath({
                                repo名称,
                                revision名称,
                                path: '',
                                pathType: 'commit',
                                commitSha: previewRef,
                            })}
                            class名称="font-mono text-link hover:underline"
                        >
                            {truncateSha(previewRef)}
                        </Link>
                    </span>
                    <Tooltip key={previewRef}>
                        <TooltipTrigger>
                            <Button
                                asChild
                                variant="ghost"
                                size="icon"
                                class名称="h-6 w-6 text-muted-foreground"
                            >
                                <Link
                                    href={getBrowsePath({
                                        repo名称,
                                        revision名称,
                                        path,
                                        pathType: 'blob',
                                    })}
                                    aria-label="关闭 preview"
                                >
                                    <X class名称="h-4 w-4" />
                                </Link>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>关闭 preview</TooltipContent>
                    </Tooltip>
                </div>
            )}
            <PureCodePreviewPanel
                source={fileSourceResponse.source}
                language={fileSourceResponse.language}
                repo名称={repo名称}
                path={path}
                revision名称={contentRef ?? 'HEAD'}
                blame={blameResponse}
            />
        </>
    )
}