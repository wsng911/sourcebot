import Image from "next/image";
import { ShieldCheck } from "lucide-react";

interface ProviderIconProps {
    icon?: {
        src: string;
        class名称?: string;
    } | null;
    display名称: string;
    size?: "sm" | "md" | "lg";
}

const sizeClasses = {
    sm: {
        container: "h-8 w-8",
        icon: "h-4 w-4"
    },
    md: {
        container: "h-10 w-10",
        icon: "h-5 w-5"
    },
    lg: {
        container: "h-12 w-12",
        icon: "h-6 w-6"
    }
};

const sizeDimensions = {
    sm: { width: 16, height: 16 },
    md: { width: 20, height: 20 },
    lg: { width: 24, height: 24 }
};

export function ProviderIcon({ icon, display名称, size = "md" }: ProviderIconProps) {
    const sizes = sizeClasses[size];
    const dimensions = sizeDimensions[size];

    if (icon) {
        return (
            <div class名称={`${sizes.container} rounded-md border border-border bg-background flex items-center justify-center`}>
                <Image
                    src={icon.src}
                    alt={display名称}
                    width={dimensions.width}
                    height={dimensions.height}
                    class名称={`${sizes.icon} ${icon.class名称 || ''}`}
                />
            </div>
        );
    }

    return (
        <div class名称={`${sizes.container} rounded-lg border border-border flex items-center justify-center bg-muted`}>
            <ShieldCheck class名称={`${sizes.icon} text-muted-foreground`} />
        </div>
    );
}
