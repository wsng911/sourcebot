import { SourcebotLogo } from "@/app/components/sourcebotLogo"
import { NavigationMenu } from "../../components/navigationMenu"
import { 仓库Carousel } from "../../components/repositoryCarousel"
import { Separator } from "@/components/ui/separator"
import { SyntaxReferenceGuideHint } from "../../components/syntaxReferenceGuideHint"
import Link from "next/link"
import { 搜索Bar } from "../../components/searchBar"
import { 搜索ModeSelector } from "../../components/searchModeSelector"
import { getRepos, getReposStats } from "@/actions"
import { ServiceErrorException } from "@/lib/serviceError"
import { isServiceError } from "@/lib/utils"

export interface 搜索LandingPageProps {
    is搜索AssistSupported: boolean;
}

export const 搜索LandingPage = async ({
    is搜索AssistSupported,
}: 搜索LandingPageProps) => {
    const carouselRepos = await getRepos({
        where: {
            indexedAt: {
                not: null,
            },
        },
        take: 10,
    });

    const repoStats = await getReposStats();

    if (isServiceError(carouselRepos)) throw new ServiceErrorException(carouselRepos);
    if (isServiceError(repoStats)) throw new ServiceErrorException(repoStats);

    return (
        <div class名称="flex flex-col items-center overflow-hidden min-h-screen">
            <NavigationMenu />

            <div class名称="flex flex-col justify-center items-center mt-8 mb-8 md:mt-16 w-full px-5">
                <div class名称="max-h-44 w-auto">
                    <SourcebotLogo
                        class名称="h-18 md:h-40 w-auto"
                    />
                </div>
                <div class名称="mt-4 w-full max-w-[800px] border rounded-md shadow-sm">
                    <搜索Bar
                        autoFocus={true}
                        class名称="border-none pt-0.5 pb-0"
                        is搜索AssistSupported={is搜索AssistSupported}
                    />
                    <Separator />
                    <div class名称="w-full flex flex-row items-center bg-accent rounded-b-md px-2">
                        <搜索ModeSelector
                            searchMode="precise"
                            class名称="ml-auto"
                        />
                    </div>
                </div>

                <div class名称="mt-8">
                    <仓库Carousel
                        numberOfReposWithIndex={repoStats.numberOfReposWithIndex}
                        displayRepos={carouselRepos}
                    />
                </div>

                <div class名称="flex flex-col items-center w-fit gap-6">
                    <Separator class名称="mt-5" />
                    <span class名称="font-semibold">How to search</span>
                    <div class名称="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <HowToSection
                            title="搜索 in files or paths"
                        >
                            <QueryExample>
                                <Query query="test todo">test todo</Query> <QueryExplanation>(both test and todo)</QueryExplanation>
                            </QueryExample>
                            <QueryExample>
                                <Query query="test or todo">test <Highlight>or</Highlight> todo</Query> <QueryExplanation>(either test or todo)</QueryExplanation>
                            </QueryExample>
                            <QueryExample>
                                <Query query={`"exit boot"`}>{`"exit boot"`}</Query> <QueryExplanation>(exact match)</QueryExplanation>
                            </QueryExample>
                            <QueryExample>
                                <Query query="TODO" isCaseSensitivityEnabled={true}>TODO</Query> <QueryExplanation>(case sensitive)</QueryExplanation>
                            </QueryExample>
                        </HowToSection>
                        <HowToSection
                            title="Filter results"
                        >
                            <QueryExample>
                                <Query query="file:README setup"><Highlight>file:</Highlight>README setup</Query> <QueryExplanation>(by filename)</QueryExplanation>
                            </QueryExample>
                            <QueryExample>
                                <Query query="repo:torvalds/linux test"><Highlight>repo:</Highlight>torvalds/linux test</Query> <QueryExplanation>(by repo)</QueryExplanation>
                            </QueryExample>
                            <QueryExample>
                                <Query query="lang:TypeScript"><Highlight>lang:</Highlight>TypeScript</Query> <QueryExplanation>(by language)</QueryExplanation>
                            </QueryExample>
                            <QueryExample>
                                <Query query="rev:HEAD"><Highlight>rev:</Highlight>HEAD</Query> <QueryExplanation>(by branch or tag)</QueryExplanation>
                            </QueryExample>
                        </HowToSection>
                        <HowToSection
                            title="Advanced"
                        >
                            <QueryExample>
                                <Query query="file:\.py$"><Highlight>file:</Highlight>{`\\.py$`}</Query> <QueryExplanation>{`(files that end in ".py")`}</QueryExplanation>
                            </QueryExample>
                            <QueryExample>
                                <Query query="sym:main"><Highlight>sym:</Highlight>main</Query> <QueryExplanation>{`(symbols named "main")`}</QueryExplanation>
                            </QueryExample>
                            <QueryExample>
                                <Query query="todo -lang:c">todo <Highlight>-lang:c</Highlight></Query> <QueryExplanation>(negate filter)</QueryExplanation>
                            </QueryExample>
                            <QueryExample>
                                <Query query="content:README"><Highlight>content:</Highlight>README</Query> <QueryExplanation>(search content only)</QueryExplanation>
                            </QueryExample>
                        </HowToSection>
                    </div>
                    <SyntaxReferenceGuideHint />
                </div>
            </div>
        </div>
    )
}

const HowToSection = ({ title, children }: { title: string, children: React.ReactNode }) => {
    return (
        <div class名称="flex flex-col gap-1">
            <span class名称="dark:text-gray-300 text-sm mb-2 underline">{title}</span>
            {children}
        </div>
    )

}

const Highlight = ({ children }: { children: React.ReactNode }) => {
    return (
        <span class名称="text-highlight">
            {children}
        </span>
    )
}

const QueryExample = ({ children }: { children: React.ReactNode }) => {
    return (
        <span class名称="text-sm font-mono">
            {children}
        </span>
    )
}

const QueryExplanation = ({ children }: { children: React.ReactNode }) => {
    return (
        <span class名称="text-gray-500 dark:text-gray-400 ml-3">
            {children}
        </span>
    )
}

const Query = ({ query, children, isCaseSensitivityEnabled = false }: { query: string, children: React.ReactNode, isCaseSensitivityEnabled?: boolean }) => {
    return (
        <Link
            href={`/search?query=${query}${isCaseSensitivityEnabled ? "&isCaseSensitivityEnabled=true" : ""}`}
            class名称="cursor-pointer hover:underline"
        >
            {children}
        </Link>
    )
}