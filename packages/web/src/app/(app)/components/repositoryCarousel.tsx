'use client';

import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { 仓库Query } from "@/lib/types";
import { getCodeHostInfoForRepo } from "@/lib/utils";
import clsx from "clsx";
import Autoscroll from "embla-carousel-auto-scroll";
import Image from "next/image";
import Link from "next/link";

interface 仓库CarouselProps {
    displayRepos: 仓库Query[];
    numberOfReposWithIndex: number;
}

export function 仓库Carousel({
    displayRepos,
    numberOfReposWithIndex,
}: 仓库CarouselProps) {
    if (numberOfReposWithIndex === 0) {
        return (
            <div class名称="flex flex-col items-center gap-3">
                <span class名称="text-sm">No repositories found</span>

                <div class名称="w-full max-w-lg">
                    <div class名称="flex flex-row items-center gap-2 border rounded-md p-4 justify-center">
                        <span class名称="text-sm text-muted-foreground">
                            <>
                                创建 a{" "}
                                <Link href={`/settings/connections`} class名称="text-blue-500 hover:underline inline-flex items-center gap-1">
                                    connection
                                </Link>{" "}
                                to start indexing repositories
                            </>
                        </span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div class名称="flex flex-col items-center gap-3">
            <span class名称="text-sm">
                {`${numberOfReposWithIndex} `}
                <Link
                    href={`/repos`}
                    class名称="text-link hover:underline"
                >
                    {numberOfReposWithIndex > 1 ? 'repositories' : 'repository'}
                </Link>
                {` indexed`}
            </span>
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                class名称="w-full max-w-lg"
                plugins={[
                    Autoscroll({
                        startDelay: 0,
                        speed: 1,
                        stopOnMouseEnter: true,
                        stopOnInteraction: false,
                    }),
                ]}
            >
                <CarouselContent>
                    {displayRepos.map((repo, index) => (
                        <CarouselItem key={index} class名称="basis-auto">
                            <仓库Badge
                                key={index}
                                repo={repo}
                            />
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
    )
}

interface 仓库BadgeProps {
    repo: 仓库Query;
}

const 仓库Badge = ({
    repo
}: 仓库BadgeProps) => {
    const { repoIcon, display名称 } = (() => {
        const info = getCodeHostInfoForRepo({
            codeHostType: repo.codeHostType,
            name: repo.repo名称,
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
    })();

    return (
        <Link
            href={repo.webUrl}
            class名称={clsx("flex flex-row items-center gap-2 border rounded-md p-2 text-clip")}
        >
            {repoIcon}
            <span class名称="text-sm font-mono">
                {display名称}
            </span>
        </Link>
    )
}
