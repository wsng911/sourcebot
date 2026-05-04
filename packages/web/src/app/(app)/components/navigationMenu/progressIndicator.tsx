'use client';

import { useToast } from "@/components/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { 仓库Query } from "@/lib/types";
import { getCodeHostInfoForRepo, getShortenedNumberDisplayString } from "@/lib/utils";
import clsx from "clsx";
import { Loader2Icon, RefreshCwIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

interface ProgressIndicatorProps {
    numberOfReposWithFirstTimeIndexingJobsInProgress: number;
    sampleRepos: 仓库Query[];
}

export const ProgressIndicator = ({
    numberOfReposWithFirstTimeIndexingJobsInProgress: numRepos,
    sampleRepos,
}: ProgressIndicatorProps) => {
    const router = useRouter();
    const { toast } = useToast();

    if (numRepos === 0) {
        return null;
    }

    const numReposString = getShortenedNumberDisplayString(numRepos);

    return (
        <Tooltip>
            <TooltipTrigger>
                <Link href={`/repos`}>
                    <Badge variant="outline" class名称="flex flex-row items-center gap-2 h-8">
                        <Loader2Icon class名称="h-4 w-4 animate-spin" />
                        <span>{numReposString}</span>
                    </Badge>
                </Link>
            </TooltipTrigger>
            <TooltipContent class名称="p-4 w-72">
                <div class名称="flex flex-row gap-1 items-center">
                    <p class名称="text-md font-medium">{`同步ing ${numReposString} ${numRepos === 1 ? 'repository' : 'repositories'}`}</p>
                    <Button
                        variant="ghost"
                        size="icon"
                        class名称="h-6 w-6 text-muted-foreground"
                        onClick={() => {
                            router.refresh();
                            toast({
                                description: "Page refreshed",
                            });
                        }}
                    >
                        <RefreshCwIcon class名称="w-3 h-3" />
                    </Button>
                </div>
                <Separator class名称="my-3" />
                <div class名称="flex flex-col gap-2">
                    {sampleRepos.map((repo) => (
                        <RepoItem key={repo.repoId} repo={repo} />
                    ))}
                </div>
                {numRepos > sampleRepos.length && (
                    <div class名称="mt-2">
                        <Link href={`/repos`} class名称="text-sm text-link hover:underline">
                            {`View ${numRepos - sampleRepos.length} more`}
                        </Link>
                    </div>
                )}
            </TooltipContent>
        </Tooltip>
    )
}

const RepoItem = ({ repo }: { repo: 仓库Query }) => {

    const { repoIcon, display名称 } = useMemo(() => {
        const info = getCodeHostInfoForRepo({
            name: repo.repo名称,
            codeHostType: repo.codeHostType,
            display名称: repo.repoDisplay名称,
            externalWebUrl: repo.externalWebUrl,
        });

        return {
            repoIcon: <Image
                src={info.icon}
                alt={info.codeHost名称}
                class名称={`w-4 h-4 ${info.iconClass名称}`}
            />,
            display名称: info.display名称,
        }
    }, [repo.repo名称, repo.codeHostType, repo.repoDisplay名称, repo.externalWebUrl]);


    return (
        <Link
            class名称={clsx("flex flex-row items-center gap-2 border rounded-md p-2 text-clip")}
            href={`/repos/${repo.repoId}`}
        >
            {repoIcon}
            <span class名称="text-sm truncate">
                {display名称}
            </span>
        </Link>
    )
}