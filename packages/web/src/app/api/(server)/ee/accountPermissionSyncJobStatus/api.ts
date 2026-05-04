'use server';

import { ServiceError, notFound } from "@/lib/serviceError";
import { withAuth } from "@/middleware/withAuth";
import { AccountPermission同步Job状态 } from "@sourcebot/db";
import { sew } from "@/middleware/sew";

export interface Account同步状态Response {
    is同步ing: boolean;
}

export const getAccount同步状态 = async (jobId: string): Promise<Account同步状态Response | ServiceError> =>
    sew(() => withAuth(async ({ prisma, user }) => {
        const job = await prisma.accountPermission同步Job.findFirst({
            where: {
                id: jobId,
                account: { userId: user.id },
            },
        });

        if (!job) return notFound();

        const active状态es: AccountPermission同步Job状态[] = [
            AccountPermission同步Job状态.PENDING,
            AccountPermission同步Job状态.IN_PROGRESS,
        ];

        const is同步ing = active状态es.includes(job.status);

        return { is同步ing } satisfies Account同步状态Response;
    }));
