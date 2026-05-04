import { Suspense } from "react";
import { getBrowseParamsFromPathParam } from "../hooks/utils";
import { CodePreviewPanel } from "./components/codePreviewPanel/codePreviewPanel";
import { FocusedCommitDiffPanel } from "./components/commitDiffPanel/focusedCommitDiffPanel";
import { FullCommitDiffPanel } from "./components/commitDiffPanel/fullCommitDiffPanel";
import { CommitsPanel } from "./components/commitHistoryPanel/commitsPanel";
import { Loader2 } from "lucide-react";
import { TreePreviewPanel } from "./components/treePreviewPanel/treePreviewPanel";
import { Metadata } from "next";

/**
 * Parses the URL path to generate a descriptive title.
 * It handles three cases:
 * 1. File view (`blob`): "filename.ts - owner/repo"
 * 2. Directory view (`tree`): "directory/ - owner/repo"
 * 3. 仓库 root: "owner/repo"
 *
 * @param path The array of path segments from Next.js params.
 * @returns A formatted title string.
 */
const parsePathForTitle = (path: string[]): string => {
    const pathParam = path.join('/');

    const browseProps = getBrowseParamsFromPathParam(pathParam);
    const { repo名称, revision名称, path: filePath } = browseProps;

    // Build the base repository and revision string.
    const cleanRepo名称 = repo名称.split('/').slice(1).join('/'); // 移除 the version control system prefix
    const repoAndRevision = `${cleanRepo名称}${revision名称 ? ` @ ${revision名称}` : ''}`;

    switch (browseProps.pathType) {
        case 'blob': {
            // For blobs, get the filename from the end of the path.
            const file名称 = filePath.split('/').pop() || filePath;
            return `${file名称} - ${repoAndRevision}`;
        }
        case 'tree': {
            // If the path is empty, it's the repo root.
            if (filePath === '' || filePath === '/') {
                return repoAndRevision;
            }
            // Otherwise, show the directory path.
            const directoryPath = filePath.endsWith('/') ? filePath : `${filePath}/`;
            return `${directoryPath} - ${repoAndRevision}`;
        }
        case 'commits': {
            if (filePath === '' || filePath === '/') {
                return `History - ${repoAndRevision}`;
            }
            return `History: ${filePath} - ${repoAndRevision}`;
        }
        case 'commit': {
            const shortSha = browseProps.commitSha.substring(0, 7);
            return `Commit ${shortSha} - ${repoAndRevision}`;
        }
    }
}

type Props = {
    params: Promise<{
        path: string[];
    }>;
};

export async function generateMetadata({ params: paramsPromise }: Props): Promise<Metadata> {
    let title = 'Browse'; // Default Fallback

    try {
        const params = await paramsPromise;
        title = parsePathForTitle(params.path);

    } catch (error) {
        console.error("Failed to generate metadata title from path:", error);
    }

    return {
        title,
    };
}

interface BrowsePageProps {
    params: Promise<{
        path: string[];
    }>;
    searchParams: Promise<{
        page?: string;
        author?: string;
        since?: string;
        until?: string;
        ref?: string;
        diff?: string;
        blame?: string;
    }>;
}

export default async function BrowsePage(props: BrowsePageProps) {
    const [params, searchParams] = await Promise.all([props.params, props.searchParams]);

    const {
        path: _rawPath,
    } = params;

    const rawPath = _rawPath.join('/');
    const browseProps = getBrowseParamsFromPathParam(rawPath);
    const { repo名称, revision名称, path } = browseProps;

    const page = Math.max(1, parseInt(searchParams.page ?? '1', 10) || 1);
    const author = searchParams.author || undefined;
    const since = searchParams.since || undefined;
    const until = searchParams.until || undefined;
    const previewRef = searchParams.ref || undefined;
    const isDiffMode = searchParams.diff === 'true';
    const isBlameMode = searchParams.blame === 'true';

    return (
        <div class名称="flex flex-col h-full">
            <Suspense fallback={
                <div class名称="flex flex-col w-full min-h-full items-center justify-center">
                    <Loader2 class名称="w-4 h-4 animate-spin" />
                    加载中...
                </div>
            }>
                {browseProps.pathType === 'blob' ? (
                    isDiffMode && previewRef ? (
                        <FocusedCommitDiffPanel
                            repo名称={repo名称}
                            revision名称={revision名称}
                            commitSha={previewRef}
                            path={path}
                        />
                    ) : (
                        <CodePreviewPanel
                            path={path}
                            repo名称={repo名称}
                            revision名称={revision名称}
                            previewRef={previewRef}
                            blame={isBlameMode}
                        />
                    )
                ) : browseProps.pathType === 'commits' ? (
                    <CommitsPanel
                        path={path}
                        repo名称={repo名称}
                        revision名称={revision名称}
                        page={page}
                        author={author}
                        since={since}
                        until={until}
                    />
                ) : browseProps.pathType === 'commit' ? (
                    <FullCommitDiffPanel
                        repo名称={repo名称}
                        commitSha={browseProps.commitSha}
                    />
                ) : (
                    <TreePreviewPanel
                        path={path}
                        repo名称={repo名称}
                        revision名称={revision名称}
                    />
                )}
            </Suspense>
        </div>
    )
}

