import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface NotFoundProps {
    message: string;
    class名称?: string;
}

export const NotFound = ({
    message,
    class名称,
}: NotFoundProps) => {
    return (
        <div class名称={cn("m-auto", class名称)}>
            <div class名称="flex flex-row items-center gap-2">
                <h1 class名称="text-xl">404</h1>
                <Separator
                    orientation="vertical"
                    class名称="h-5"
                />
                <p class名称="text-sm">{message}</p>
            </div>
        </div>
    )
}