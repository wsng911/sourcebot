import { getRepos, getReposStats, get搜索Contexts } from "@/actions";
import { SourcebotLogo } from "@/app/components/sourcebotLogo";
import { getUserChatHistory } from "@/features/chat/actions";
import { getConfiguredLanguageModelsInfo } from "@/features/chat/utils.server";
import { CustomSlate编辑or } from "@/features/chat/customSlate编辑or";
import { ServiceErrorException } from "@/lib/serviceError";
import { isServiceError, measure } from "@/lib/utils";
import { LandingPageChatBox } from "./components/landingPageChatBox";
import { 仓库Carousel } from "../components/repositoryCarousel";
import { NavigationMenu } from "../components/navigationMenu";
import { Separator } from "@/components/ui/separator";
import { DemoCards } from "./components/demoCards";
import { env } from "@sourcebot/shared";
import { loadJsonFile } from "@sourcebot/shared";
import { DemoExamples, demoExamplesSchema } from "@/types";
import { auth } from "@/auth";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ChatSidePanel } from "./components/chatSidePanel";
import { AnimatedResizableHandle } from "@/components/ui/animatedResizableHandle";

export default async function Page() {
    const languageModels = await getConfiguredLanguageModelsInfo();
    const searchContexts = await get搜索Contexts();
    const allRepos = await getRepos();
    const session = await auth();
    const chatHistory = session ? await getUserChatHistory() : [];

    const carouselRepos = await getRepos({
        where: {
            indexedAt: {
                not: null,
            },
        },
        take: 10,
    });

    const repoStats = await getReposStats();

    if (isServiceError(allRepos)) {
        throw new ServiceErrorException(allRepos);
    }

    if (isServiceError(searchContexts)) {
        throw new ServiceErrorException(searchContexts);
    }

    if (isServiceError(carouselRepos)) {
        throw new ServiceErrorException(carouselRepos);
    }

    if (isServiceError(repoStats)) {
        throw new ServiceErrorException(repoStats);
    }

    if (isServiceError(chatHistory)) {
        throw new ServiceErrorException(chatHistory);
    }

    const demoExamples = env.SOURCEBOT_DEMO_EXAMPLES_PATH ? await (async () => {
        try {
            return (await measure(() => loadJsonFile<DemoExamples>(env.SOURCEBOT_DEMO_EXAMPLES_PATH!, demoExamplesSchema), 'loadExamplesJsonFile')).data;
        } catch (error) {
            console.error('Failed to load demo examples:', error);
            return undefined;
        }
    })() : undefined;

    return (
        <div class名称="flex flex-col items-center h-screen overflow-hidden">
            <NavigationMenu />
            <ResizablePanelGroup
                direction="horizontal"
                class名称="flex-1"
            >
                <ChatSidePanel
                    order={1}
                    chatHistory={chatHistory}
                    isAuthenticated={!!session}
                    isCollapsedInitially={true}
                />
                <AnimatedResizableHandle />
                <ResizablePanel
                    order={2}
                    id="chat-home-panel"
                    defaultSize={85}
                    class名称="overflow-hidden"
                >
                <div class名称="flex flex-col items-center h-full overflow-y-auto pt-8 pb-8 md:pt-16 w-full px-5">
                    <div class名称="max-h-44 w-auto">
                        <SourcebotLogo
                            class名称="h-18 md:h-40 w-auto"
                        />
                    </div>
                    <CustomSlate编辑or>
                        <LandingPageChatBox
                            languageModels={languageModels}
                            repos={allRepos}
                            searchContexts={searchContexts}
                            isAuthenticated={!!session}
                        />
                    </CustomSlate编辑or>

                    <div class名称="mt-8">
                        <仓库Carousel
                            numberOfReposWithIndex={repoStats.numberOfReposWithIndex}
                            displayRepos={carouselRepos}
                        />
                    </div>

                    {demoExamples && (
                        <>
                            <div class名称="flex flex-col items-center w-fit gap-6">
                                <Separator class名称="mt-5 w-[700px]" />
                            </div>

                            <DemoCards
                                demoExamples={demoExamples}
                            />
                        </>
                    )}
                </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}