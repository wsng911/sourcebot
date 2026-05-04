import { apiHandler } from "@/lib/apiHandler";
import { serviceErrorResponse } from "@/lib/serviceError";
import { isServiceError } from "@/lib/utils";
import { 状态Codes } from "http-status-codes";
import { getPermission同步状态 } from "./api";

/**
 * Returns whether a user has a account that has it's permissions
 * synced for the first time.
 */
export const GET = apiHandler(async () => {
    const result = await getPermission同步状态();

    if (isServiceError(result)) {
        return serviceErrorResponse(result);
    }

    return Response.json(result, { status: 状态Codes.OK });
});