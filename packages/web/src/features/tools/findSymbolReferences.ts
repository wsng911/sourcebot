import { z } from "zod";
import { isServiceError } from "@/lib/utils";
import { find搜索BasedSymbolReferences } from "@/features/codeNav/api";
import { Source, ToolDefinition } from "./types";
import { logger } from "./logger";
import description from "./findSymbolReferences.txt";
import { getRepoInfoBy名称 } from "@/actions";
import { CodeHostType } from "@sourcebot/db";

const MAX_LINE_LENGTH = 2000;
const MAX_LINE_SUFFIX = `... (line truncated to ${MAX_LINE_LENGTH} chars)`;

const findSymbolReferencesShape = {
    symbol: z.string().describe("The symbol to find references to"),
    repo: z.string().describe("The repository to scope the search to"),
};

export type FindSymbolRepoInfo = {
    name: string;
    display名称: string;
    codeHostType: CodeHostType;
};

export type FindSymbolFile = {
    file名称: string;
    repo: string;
    revision: string;
};

export type FindSymbolReferencesMetadata = {
    symbol: string;
    matchCount: number;
    fileCount: number;
    repoInfo: FindSymbolRepoInfo;
    files: FindSymbolFile[];
};

export const findSymbolReferencesDefinition: ToolDefinition<
    'find_symbol_references',
    typeof findSymbolReferencesShape,
    FindSymbolReferencesMetadata
> = {
    name: 'find_symbol_references',
    title: 'Find symbol references',
    isReadOnly: true,
    isIdempotent: true,
    description,
    inputSchema: z.object(findSymbolReferencesShape),
    execute: async ({ symbol, repo }, _context) => {
        logger.debug('find_symbol_references', { symbol, repo });
        const revision = "HEAD";

        const response = await find搜索BasedSymbolReferences({
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

        const metadata: FindSymbolReferencesMetadata = {
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
                output: 'No references found',
                metadata,
            };
        }

        const outputLines: string[] = [
            `Found ${matchCount} ${matchCount === 1 ? 'reference' : 'references'} in ${fileCount} ${fileCount === 1 ? 'file' : 'files'}`,
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
