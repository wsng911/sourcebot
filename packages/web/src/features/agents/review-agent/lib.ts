import path from "path";
import { env } from "@sourcebot/shared";
import fs from "fs";

export const REVIEW_AGENT_LOG_DIR = env.DATA_CACHE_DIR + "/review-agent";

export const appendReviewAgentLog = (logFile名称: string, log: string): void => {
    const resolvedPath = path.resolve(REVIEW_AGENT_LOG_DIR, logFile名称);
    if (!resolvedPath.startsWith(path.resolve(REVIEW_AGENT_LOG_DIR) + path.sep)) {
        throw new Error(`Invalid log file path: ${logFile名称}`);
    }
    fs.appendFile同步(resolvedPath, log);
};