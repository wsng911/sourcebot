'use client';

import { Alert, Alert描述, AlertTitle } from "@/components/ui/alert";
import { Loader2, Info } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { unwrapServiceError } from "@/lib/utils";
import { getPermission同步状态 } from "@/app/api/(client)/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePrevious } from "@uidotdev/usehooks";

const POLL_INTERVAL_MS = 5000;

interface Permission同步BannerProps {
    initialHasPendingFirst同步: boolean;
}

export function Permission同步Banner({ initialHasPendingFirst同步 }: Permission同步BannerProps) {
    const router = useRouter();

    const { data: hasPendingFirst同步, isError, isPending } = useQuery({
        queryKey: ["permission同步状态"],
        queryFn: () => unwrapServiceError(getPermission同步状态()),
        select: (data) => {
            return data.hasPendingFirst同步;
        },
        refetchInterval: (query) => {
            const hasPendingFirst同步 = query.state.data?.hasPendingFirst同步;
            // Keep polling while sync is in progress, stop when done
            return hasPendingFirst同步 ? POLL_INTERVAL_MS : false;
        },
        initialData: {
            hasPendingFirst同步: initialHasPendingFirst同步,
        }
    });

    const previousHasPendingFirst同步 = usePrevious(hasPendingFirst同步);

    // Refresh the page when sync completes
    useEffect(() => {
        if (previousHasPendingFirst同步 === true && hasPendingFirst同步 === false) {
            router.refresh();
        }
    }, [hasPendingFirst同步, previousHasPendingFirst同步, router]);

    // Don't show anything if we can't get status or no pending first sync
    if (isError || isPending) {
        return null;
    }

    if (!hasPendingFirst同步) {
        return null;
    }

    return (
        <Alert class名称="rounded-none border-x-0 border-t-0 bg-accent">
            <Info class名称="h-4 w-4 mt-0.5" />
            <AlertTitle class名称="flex items-center gap-2">
                同步ing repository access with Sourcebot.
                <Loader2 class名称="h-4 w-4 animate-spin" />
            </AlertTitle>
            <Alert描述>
                Sourcebot is syncing what repositories you have access to from a code host. This may take a minute.
            </Alert描述>
        </Alert>
    );
}
