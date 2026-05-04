"use client"

import { setAgentic搜索TutorialDismissedCookie } from "@/actions"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { ModelProviderLogo } from "@/features/chat/components/chatBox/modelProviderLogo"
import { cn } from "@/lib/utils"
import mentionsDemo from "@/public/ask_sb_tutorial_at_mentions.png"
import citationsDemo from "@/public/ask_sb_tutorial_citations.png"
import searchScopeDemo from "@/public/ask_sb_tutorial_search_scope.png"
import logoDarkSmall from "@/public/sb_logo_dark_small.png"
import { useQuery } from "@tanstack/react-query"
import {
    ArrowLeftRightIcon,
    AtSignIcon,
    BookMarkedIcon,
    BookTextIcon,
    ChevronLeft,
    ChevronRight,
    CircleCheckIcon,
    FileIcon,
    FolderIcon,
    GitCommitHorizontalIcon,
    LibraryBigIcon,
    Scan搜索Icon,
    StarIcon,
    TicketIcon,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCallback, useState } from "react"




// Star button component that fetches GitHub star count
const GitHubStarButton = () => {
    const { data: starCount, isLoading, isError } = useQuery({
        queryKey: ['github-stars', 'sourcebot-dev/sourcebot'],
        queryFn: async () => {
            const response = await fetch('https://api.github.com/repos/sourcebot-dev/sourcebot')
            if (!response.ok) {
                throw new Error('Failed to fetch star count')
            }
            const data = await response.json()
            return data.stargazers_count as number;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    })

    const formatStarCount = (count: number) => {
        if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}k`
        }
        return count.toString()
    }

    return (
        <Button
            variant="secondary"
            size="lg"
            class名称="flex items-center gap-2"
            onClick={() => window.open('https://github.com/sourcebot-dev/sourcebot', '_blank')}
        >
            <StarIcon class名称="w-4 h-4" />
            <span class名称="font-medium">
                {
                    !isLoading && !isError && starCount ? `Star (${formatStarCount(starCount)})` : 'Star'
                }
            </span>
        </Button>
    )
}


const tutorialSteps = [
    {
        leftContent: (
            <div class名称="flex flex-col h-full p-8 justify-between gap-4">
                <div class名称="flex flex-col gap-6">
                    <h2 class名称="text-5xl font-bold leading-tight">
                        Ask Source<span class名称="text-[#851EE6]">bot.</span>
                    </h2>
                    <p class名称="text-lg">
                        Ask questions about your <span class名称="font-bold">entire codebase</span> in natural language.
                        Get back responses grounded in code with <span class名称="font-bold">inline citations</span>.
                    </p>
                    <p class名称="text-md text-muted-foreground">
                        Ask Sourcebot is an agentic search tool that can answer questions about your codebase by searching, reading files, navigating references, and more. Supports any <Link href="https://docs.sourcebot.dev/docs/configuration/language-model-providers" class名称="underline">compatible LLM.</Link>
                    </p>
                </div>
                <div class名称="space-y-3 mx-auto flex flex-wrap justify-center gap-4">
                    <div class名称="flex flex-wrap items-center gap-4">
                        <ModelProviderLogo provider="anthropic" />
                        <ModelProviderLogo provider="openai" />
                        <ModelProviderLogo provider="google-generative-ai" />
                        <ModelProviderLogo provider="amazon-bedrock" />
                        <ModelProviderLogo provider="azure" />
                        <ModelProviderLogo provider="deepseek" />
                        <ModelProviderLogo provider="mistral" />
                        <ModelProviderLogo provider="openrouter" />
                        <ModelProviderLogo provider="xai" />
                    </div>
                </div>
            </div>
        ),
        rightContent: (
            <video
                src="https://www.dropbox.com/scl/fi/htbvyj0u7qjr0j78tyqiq/ask_tutorial_hero.mp4?rlkey=1e2a69njwtzt632pwqky9fen9&st=juaf8qq6&raw=1"
                autoPlay
                loop
                muted
                playsInline
                class名称="w-full h-full object-cover"
            />
        ),
    },
    {
        leftContent: (
            <div class名称="flex flex-col h-full p-8 space-y-6">
                <h2 class名称="text-3xl font-bold leading-tight flex items-center gap-2">
                    <Scan搜索Icon class名称="inline-block h-8 w-8 text-primary" />
                    搜索 Scopes
                </h2>
                <p class名称="text-lg">
                    {`When asking Sourcebot a question, you can select one or more scopes to focus the search.`}
                </p>

                <div class名称="flex flex-col mb-2 text-muted-foreground">
                    <p class名称="mb-4">There are two types of search scopes:</p>
                    <div class名称="flex gap-2 mb-2">
                        <BookMarkedIcon class名称="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                        <span><strong>仓库</strong>: A single repository.</span>
                    </div>
                    <div class名称="flex gap-2">
                        <LibraryBigIcon class名称="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                        <span><strong>Reposet</strong>: A collection of repositories (<Link href="https://docs.sourcebot.dev/docs/features/search/search-contexts" class名称="underline">configuration docs</Link>).</span>
                    </div>
                </div>
            </div>
        ),
        rightContent: (
            <Image
                src={searchScopeDemo}
                alt="搜索 scope demo"
                class名称="w-full h-full object-cover"
            />
        ),
    },
    {
        leftContent: (
            <div class名称="flex flex-col h-full p-8 space-y-6">
                <h2 class名称="text-3xl font-bold leading-tight flex items-center gap-2">
                    <AtSignIcon class名称="inline-block h-8 w-8 text-primary" />
                    Mentions
                </h2>
                <p class名称="text-lg">
                    @ mention specific <FileIcon class名称="inline-block h-4 w-4 mb-1 ml-0.5" /> files to add them to the {`model's`} context. Suggestions will be scoped to the selected search scopes.
                </p>

                <div class名称="flex flex-col">
                    <p class名称="mb-3 text-muted-foreground"><strong>Coming soon</strong></p>
                    <div class名称="space-y-2 text-muted-foreground">
                        <div class名称="flex gap-2">
                            <FolderIcon class名称="h-4 w-4 flex-shrink-0 mt-1" />
                            <span><strong>Directories</strong>: Include entire folders as context</span>
                        </div>
                        <div class名称="flex gap-2">
                            <GitCommitHorizontalIcon class名称="h-4 w-4 flex-shrink-0 mt-1" />
                            <span><strong>Commits</strong>: Reference specific git commits</span>
                        </div>
                        <div class名称="flex gap-2">
                            <BookTextIcon class名称="h-4 w-4 flex-shrink-0 mt-1" />
                            <span><strong>Docs</strong>: Link to external docs and wikis</span>
                        </div>
                        <div class名称="flex gap-2">
                            <TicketIcon class名称="h-4 w-4 flex-shrink-0 mt-1" />
                            <span><strong>Issues</strong>: GitHub issues, Jira tickets, and more</span>
                        </div>
                    </div>
                </div>
            </div>
        ),
        rightContent: (
            <Image
                src={mentionsDemo}
                alt="Mentions demo"
                class名称="w-full h-full object-cover"
            />
        ),
    },
    {
        leftContent: (
            <div class名称="flex flex-col h-full p-8 space-y-6">
                <h2 class名称="text-3xl font-bold leading-tight flex items-center gap-2">
                    <ArrowLeftRightIcon class名称="inline-block h-8 w-8 text-primary" />
                    Inline Citations
                </h2>
                <p class名称="text-lg">
                    {`Sourcebot searches your codebase and provides responses with clickable citations that link directly to relevant sections of code.`}
                </p>
            </div>
        ),
        rightContent: (
            <Image
                src={citationsDemo}
                alt="Citations demo"
                class名称="w-full h-full object-cover"
            />
        ),
    },
    {
        leftContent: (
            <div class名称="flex flex-col h-full p-8 space-y-6">
                <h2 class名称="text-3xl font-bold leading-tight flex items-center gap-2">
                    <CircleCheckIcon class名称="inline-block h-8 w-8 text-primary" />
                    You&apos;re all set!
                </h2>
                <p class名称="text-lg">
                    You can now ask Sourcebot any question about your codebase. Checkout the <Link href="https://docs.sourcebot.dev/docs/features/ask/overview" class名称="underline">docs</Link> for more information.
                </p>
                <p class名称="text-lg">
                    <span class名称="font-bold">Hit a bug?</span> Open up <Link href="https://github.com/sourcebot-dev/sourcebot/issues" class名称="underline">an issue</Link>.
                </p>
                <p class名称="text-lg">
                    <span class名称="font-bold">Feature request?</span> Open a <Link href="https://github.com/sourcebot-dev/sourcebot/discussions" class名称="underline">discussion</Link>.
                </p>
                <p class名称="text-lg">
                    <span class名称="font-bold">Anything else?</span> <Link href="https://www.sourcebot.dev/contact" class名称="underline">Contact us</Link>.
                </p>
            </div>
        ),
        rightContent: (
            <div class名称="flex flex-col h-full justify-center items-center gap-6 bg-[#020817]">
                <Image
                    src={logoDarkSmall}
                    width={150}
                    height={150}
                    alt={"Sourcebot logo"}
                    priority={true}
                />
                <GitHubStarButton />
            </div>
        ),
    },
]

interface TutorialDialogProps {
    isOpen: boolean;
}

export const TutorialDialog = ({ isOpen: _isOpen }: TutorialDialogProps) => {
    const [isOpen, setIsOpen] = useState(_isOpen);
    const on关闭 = useCallback(() => {
        setIsOpen(false);
        setAgentic搜索TutorialDismissedCookie(true);
    }, []);

    const [currentStep, setCurrentStep] = useState(0)

    const nextStep = () => {
        if (currentStep < tutorialSteps.length - 1) {
            setCurrentStep(currentStep + 1)
        }
    }

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    const isLastStep = currentStep === tutorialSteps.length - 1
    const isFirstStep = currentStep === 0
    const currentStepData = tutorialSteps[currentStep];

    return (
        <Dialog open={isOpen} onOpenChange={on关闭}>
            <DialogContent
                class名称="sm:max-w-[900px] p-0 flex flex-col h-[525px] overflow-hidden rounded-xl border-none bg-transparent"
                closeButtonClass名称="text-white"
            >
                <DialogTitle class名称="sr-only">Ask Sourcebot tutorial</DialogTitle>
                <div class名称="relative flex h-full">
                    {/* Left Column (Text Content & Navigation) */}
                    <div class名称="flex-1 flex flex-col justify-between bg-background">
                        <div class名称="p-4 flex-1 overflow-y-auto">
                            {currentStepData.leftContent}
                        </div>

                        {/* Fixed bottom navigation for left column */}
                        <div class名称="border-t p-6 flex items-center justify-between">
                            {/* Left side: Previous button container */}
                            <div class名称="w-36 flex justify-start">
                                <Button
                                    variant="ghost"
                                    onClick={prevStep}
                                    class名称={cn(
                                        "flex items-center gap-2",
                                        isFirstStep && "opacity-0 pointer-events-none"
                                    )}
                                >
                                    <ChevronLeft class名称="w-4 h-4" />
                                    Previous
                                </Button>
                            </div>

                            {/* Center: Progress dots */}
                            <div class名称="flex gap-2">
                                {tutorialSteps.map((_, index) => (
                                    <div
                                        key={index}
                                        class名称={cn(
                                            "w-2 h-2 rounded-full transition-colors",
                                            index === currentStep ? "bg-primary" : "bg-muted"
                                        )}
                                    />
                                ))}
                            </div>

                            {/* Right side: Next/Start/Get Started button container */}
                            <div class名称="w-36 flex justify-end">
                                {isLastStep ? (
                                    <Button onClick={on关闭}>
                                        Get Started
                                    </Button>
                                ) : (
                                    <Button onClick={nextStep}>
                                        Next
                                        <ChevronRight class名称="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Image/Visual Content) */}
                    <div class名称="flex-1 flex flex-col justify-between bg-[#020817]">
                        <div class名称="flex-1 overflow-y-auto">{currentStepData.rightContent}</div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

