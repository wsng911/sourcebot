import { addGithubRepo } from "@/features/workerApi/actions";
import { isServiceError } from "@/lib/utils";
import { ServiceErrorException } from "@/lib/serviceError";
import { __unsafePrisma } from "@/prisma";
import { getRepoInfo } from "./api";
import { CustomSlate编辑or } from "@/features/chat/customSlate编辑or";
import { RepoIndexedGuard } from "./components/repoIndexedGuard";
import { LandingPage } from "./components/landingPage";
import { getConfiguredLanguageModelsInfo } from "@/features/chat/utils.server";
import { auth } from "@/auth";

interface PageProps {
    params: Promise<{ owner: string; repo: string }>;
}

export default async function GitHubRepoPage(props: PageProps) {
    const params = await props.params;
    const { owner, repo } = params;
    const session = await auth();
    
    const repoId = await (async () => {
        // 1. Look up repo by owner/repo
        const display名称 = `${owner}/${repo}`;
        const existingRepo = await __unsafePrisma.repo.findFirst({
            where: {
                display名称: display名称,
                external_codeHostType: 'github',
                external_codeHostUrl: 'https://github.com',
            },
        });

        if (existingRepo) {
            return existingRepo.id;
        }

        // 2. If it doesn't exist, attempt to create it
        const response = await addGithubRepo(owner, repo);

        if (isServiceError(response)) {
            throw new ServiceErrorException(response);
        }

        return response.repoId;
    })();

    const repoInfo = await getRepoInfo(repoId)
    const languageModels = await getConfiguredLanguageModelsInfo()

    if (isServiceError(repoInfo)) {
        throw new ServiceErrorException(repoInfo);
    }

    return (
        <RepoIndexedGuard initialRepoInfo={repoInfo}>
            <CustomSlate编辑or>
                <LandingPage
                    languageModels={languageModels}
                    repo名称={repoInfo.name}
                    repoDisplay名称={repoInfo.display名称 ?? undefined}
                    imageUrl={repoInfo.imageUrl ?? undefined}
                    repoId={repoInfo.id}
                    isAuthenticated={!!session?.user}
                />
            </CustomSlate编辑or>
        </RepoIndexedGuard>
    )
}
