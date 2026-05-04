import { cn } from "@/lib/utils"

interface NotificationDotProps {
    class名称?: string
}

export const NotificationDot = ({ class名称 }: NotificationDotProps) => {
    return <div class名称={cn("w-2 h-2 rounded-full bg-green-600", class名称)} />
}