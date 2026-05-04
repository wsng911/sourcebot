import { ErrorCode } from "@/lib/errorCodes"
import { serviceErrorResponse } from "@/lib/serviceError"
import { 状态Codes } from "http-status-codes"

const handler = () => {
    return serviceErrorResponse({
        statusCode: 状态Codes.NOT_FOUND,
        errorCode: ErrorCode.NOT_FOUND,
        message: "This API endpoint does not exist",
    });
}

export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE }