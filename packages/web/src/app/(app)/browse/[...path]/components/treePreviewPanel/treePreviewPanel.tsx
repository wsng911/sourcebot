
import { Separator } from "@/components/ui/separator";
import { getRepoInfoBy名称 } from "@/actions";
import { PathHeader } from "@/app/(app)/components/pathHeader";
import { getFolderContents } from "@/features/git/getFolderContentsApi";
import { isServiceError } from "@/lib/utils";
import { PureTreePreviewPanel } from "./pureTreePreviewPanel";

interface TreePreviewPanelProps {
    path: string;
    repo名称: string;
    revision名称?: string;
}

export const TreePreviewPanel = async ({ path, repo名称, revision名称 }: TreePreviewPanelProps) => {
    const [repoInfoResponse, folderContentsResponse] = await Promise.all([
        getRepoInfoBy名称(repo名称),
        getFolderContents({
            repo名称,
            revision名称: revision名称 ?? 'HEAD',
            path,
        })
    ]);

    if (isServiceError(folderContentsResponse) || isServiceError(repoInfoResponse)) {
        return <div>Error loading tree preview</div>
    }

    return (
        <>
            <div class名称="flex flex-row py-1 px-2 items-center justify-between">
                <PathHeader
                    path={path}
                    repo={{
                        name: repo名称,
                        codeHostType: repoInfoResponse.codeHostType,
                        display名称: repoInfoResponse.display名称,
                        externalWebUrl: repoInfoResponse.externalWebUrl,
                    }}
                    pathType="tree"
                    isFileIconVisible={false}
                    revision名称={revision名称}
                />
            </div>
            <Separator />
            <PureTreePreviewPanel items={folderContentsResponse} />
        </>
    )
}