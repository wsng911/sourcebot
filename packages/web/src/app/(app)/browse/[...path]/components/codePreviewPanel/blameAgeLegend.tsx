import { BLAME_AGE_BG_CLASSES } from "./blameAgeColors";
import { cn } from "@/lib/utils";

export const BlameAgeLegend = () => {
    return (
        <div class名称="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Older</span>
            <div class名称="flex items-center gap-px">
                {BLAME_AGE_BG_CLASSES.map((bg, i) => (
                    <div
                        key={i}
                        class名称={cn('h-2 w-2', bg)}
                    />
                ))}
            </div>
            <span>Newer</span>
        </div>
    );
};
