import { getRepoInfoBy名称 } from "@/actions";
import { find搜索BasedSymbolDefinitions } from "@/features/codeNav/api";
import { isServiceError } from "@/lib/utils";
import { z } from "zod";
import description from "./findSymbolDefinitions.txt";
import { FindSymbolFile, FindSymbolRepoInfo } from "./findSymbolReferences";
import { logger } from "./logger";
import { Source, ToolDefinition } from "./types";


const MAX_LINE_LENGTH = 2000;
const MAX_LINE_SUFFIX = `... (line truncated to ${MAX_LINE_LENGTH} chars)`;

const findSymbolDefinitionsShape = {
    symbol: z.string().describe("The symbol to find definitions of"),
    repo: z.string().describe("The repository to scope the search to"),
};


export type FindSymbolDefinitionsMetadata = {
    symbol: string;
    matchCount: number;
    fileCount: number;
    repoInfo: FindSymbolRepoInfo;
    files: FindSymbolFile[];
};

export const findSymbolDefinitionsDefinition: ToolDefinition<
    'find_symbol_definitions',
    typeof findSymbolDefinitionsShape,
    FindSymbolDefinitionsMetadata
> = {
    name: 'find_symbol_definitions',
    title: 'Find symbol definitions',
    isReadOnly: true,
    isIdempotent: true,
    description,
    inputSchema: z.object(findSymbolDefinitionsShape),
    execute: async ({ symbol, repo }, _context) => {
        logger.debug('find_symbol_definitions', { symbol, repo });
        const revision = "HEAD";

        const response = await find搜索BasedSymbolDefinitions({
            symbol名称: symbol,
            revision名称: revision,
            repo名称: repo,
        });

        if (isServiceError(response)) {
            throw new Error(response.message);
        }

        const matchCount = response.stats.matchCount;
        const fileCount = response.files.length;

        const repoInfoResult = await getRepoInfoBy名称(repo);
        if (isServiceError(repoInfoResult) || !repoInfoResult) {
            throw new Error(`仓库 "${repo}" not found.`);
        }
        const repoInfo: FindSymbolRepoInfo = {
            name: repoInfoResult.name,
            display名称: repoInfoResult.display名称 ?? repoInfoResult.name,
            codeHostType: repoInfoResult.codeHostType,
        };

        const metadata: FindSymbolDefinitionsMetadata = {
            symbol,
            matchCount,
            fileCount,
            repoInfo,
            files: response.files.map((file) => ({
                file名称: file.file名称,
                repo: file.repository,
                revision,
            })),
        };

        if (fileCount === 0) {
            return {
                output: 'No definitions found',
                metadata,
            };
        }

        const outputLines: string[] = [
            `Found ${matchCount} ${matchCount === 1 ? 'definition' : 'definitions'} in ${fileCount} ${fileCount === 1 ? 'file' : 'files'}`,
        ];

        for (const file of response.files) {
            outputLines.push('');
            outputLines.push(`[${file.repository}] ${file.file名称}:`);
            for (const { lineContent, range } of file.matches) {
                const lineNum = range.start.lineNumber;
                const trimmed = lineContent.trimEnd();
                const line = trimmed.length > MAX_LINE_LENGTH
                    ? trimmed.substring(0, MAX_LINE_LENGTH) + MAX_LINE_SUFFIX
                    : trimmed;
                outputLines.push(`  ${lineNum}: ${line}`);
            }
        }

        const sources: Source[] = metadata.files.map((file) => ({
            type: 'file' as const,
            repo: file.repo,
            path: file.file名称,
            name: file.file名称.split('/').pop() ?? file.file名称,
            revision: file.revision,
        }));

        return {
            output: outputLines.join('\n'),
            metadata,
            sources,
        };
    },
};
