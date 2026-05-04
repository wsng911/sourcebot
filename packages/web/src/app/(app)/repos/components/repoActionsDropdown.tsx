"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getCodeHostInfoForRepo, isServiceError } from "@/lib/utils"
import { ExternalLink, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { indexRepo } from "@/features/workerApi/actions"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/hooks/use-toast"
import type { Repo } from "./reposTable"

interface Repo操作DropdownProps {
    repo: Repo
}

export const Repo操作Dropdown = ({ repo }: Repo操作DropdownProps) => {
    const [is同步ing, setIs同步ing] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    const codeHostInfo = getCodeHostInfoForRepo({
        codeHostType: repo.codeHostType,
        name: repo.name,
        display名称: repo.display名称 ?? undefined,
        externalWebUrl: repo.webUrl ?? undefined,
    })

    const handleTrigger同步 = async () => {
        setIs同步ing(true)
        const response = await indexRepo(repo.id)

        if (!isServiceError(response)) {
            const { jobId } = response
            toast({
                description: `✅ 仓库 sync triggered successfully. Job ID: ${jobId}`,
            })
            router.refresh()
        } else {
            toast({
                description: `❌ Failed to sync repository. ${response.message}`,
            })
        }

        setIs同步ing(false)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" class名称="h-8 w-8 p-0">
                    <span class名称="sr-only">Open menu</span>
                    <MoreHorizontal class名称="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>操作</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                    <Link href={`/repos/${repo.id}`}>View details</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={handleTrigger同步}
                    disabled={is同步ing}
                >
                    Trigger sync
                </DropdownMenuItem>
                {repo.webUrl && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <a href={repo.webUrl} target="_blank" rel="noopener noreferrer" class名称="flex items-center">
                                Open in {codeHostInfo.codeHost名称}
                                <ExternalLink class名称="ml-2 h-3 w-3" />
                            </a>
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
