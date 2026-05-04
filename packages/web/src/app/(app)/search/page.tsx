import { env } from "@sourcebot/shared";
import { 搜索LandingPage } from "./components/searchLandingPage";
import { 搜索ResultsPage } from "./components/searchResultsPage";
import { auth } from "@/auth";
import { getConfiguredLanguageModelsInfo } from "@/features/chat/utils.server";

interface 搜索PageProps {
    searchParams: Promise<{
        query?: string;
        isRegexEnabled?: "true" | "false";
        isCaseSensitivityEnabled?: "true" | "false";
    }>;
}

export default async function 搜索Page(props: 搜索PageProps) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query;
    const isRegexEnabled = searchParams?.isRegexEnabled === "true";
    const isCaseSensitivityEnabled = searchParams?.isCaseSensitivityEnabled === "true";

    const session = await auth();
    const languageModels = await getConfiguredLanguageModelsInfo();
    const is搜索AssistSupported = languageModels.length > 0;

    if (query === undefined || query.length === 0) {
        return <搜索LandingPage is搜索AssistSupported={is搜索AssistSupported} />
    }

    return (
        <搜索ResultsPage
            searchQuery={query}
            defaultMaxMatchCount={env.DEFAULT_MAX_MATCH_COUNT}
            isRegexEnabled={isRegexEnabled}
            isCaseSensitivityEnabled={isCaseSensitivityEnabled}
            session={session}
            is搜索AssistSupported={is搜索AssistSupported}
        />
    )
}
