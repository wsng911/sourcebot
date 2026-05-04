import { getFormattedDate } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const formatFullDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        timeZone名称: "short",
    }).format(date)
}

interface DisplayDateProps {
    date: Date
    class名称?: string
}

export const DisplayDate = ({ date, class名称 }: DisplayDateProps) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span class名称={class名称}>
                        {getFormattedDate(date)}
                    </span>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{formatFullDate(date)}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}