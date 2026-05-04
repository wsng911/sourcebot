import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { 设置2Icon } from "lucide-react"
import { AppearanceDropdownMenuGroup } from "./appearanceDropdownMenuGroup"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface AppearanceDropdownMenuProps {
    class名称?: string;
}

export const AppearanceDropdownMenu = ({ class名称 }: AppearanceDropdownMenuProps) => {
    return (
        <DropdownMenu>
            <Tooltip
                delayDuration={100}
            >
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" class名称={class名称}>
                            <设置2Icon class名称="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    Appearance settings
                </TooltipContent>
            </Tooltip>
            <DropdownMenuContent>
                <AppearanceDropdownMenuGroup />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}