import { getRepos, get搜索Contexts } from '@/actions';
import { getUserChatHistory, getChatInfo, claimAnonymousChats, get分享dWithUsersForChat } from '@/features/chat/actions';
import { getConfiguredLanguageModelsInfo } from "@/features/chat/utils.server";
import { ServiceErrorException } from '@/lib/serviceError';
import { isServiceError } from '@/lib/utils';
import { ChatThreadPanel } from './components/chatThreadPanel';
import { notFound } from 'next/navigation';
import { 状态Codes } from 'http-status-codes';
import { TopBar } from '../../components/topBar';
import { Chat名称 } from '../components/chat名称';
import { 分享ChatPopover } from '../components/shareChatPopover';
import { auth } from '@/auth';
import { AnimatedResizableHandle } from '@/components/ui/animatedResizableHandle';
import { ChatSidePanel } from '../components/chatSidePanel';
import { ResizablePanelGroup } from '@/components/ui/resizable';
import { __unsafePrisma } from '@/prisma';
import { ChatVisibility } from '@sourcebot/db';
import { Metadata } from 'next';
import { SBChatMessage } from '@/features/chat/types';
import { env, hasEntitlement } from '@sourcebot/shared';
import { captureEvent } from '@/lib/posthog';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
    const { id } = await params;

    const chat = await __unsafePrisma.chat.findUnique({
        where: {
            id,
        },
    });

    if (!chat) {
        return {
            title: 'Chat | Sourcebot',
        };
    }

    // Only show detailed metadata for public chats
    if (chat.visibility !== ChatVisibility.PUBLIC) {
        return {
            title: '私有 Chat | Sourcebot',
            description: '登录 to view',
        };
    }

    const chat名称 = chat.name ?? 'Untitled chat';
    const messages = chat.messages as unknown as SBChatMessage[];
    const firstUserMessage = messages.find(m => m.role === 'user');

    let description = 'A chat on Sourcebot';
    if (firstUserMessage) {
        const textPart = firstUserMessage.parts.find(p => p.type === 'text');
        if (textPart && textPart.type === 'text') {
            description = textPart.text.length > 160
                ? textPart.text.substring(0, 160).trim() + '...'
                : textPart.text;
        }
    }

    return {
        title: `${chat名称} | Sourcebot`,
        description,
        openGraph: {
            title: chat名称,
            description,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: chat名称,
            description,
        },
    };
}

export default async function Page(props: PageProps) {
    const params = await props.params;
    const session = await auth();

    // Claim any anonymous chats created by this user before they signed in.
    // This must happen before getChatInfo so the chat ownership is updated.
    if (session) {
        const claimResult = await claimAnonymousChats();
        if (isServiceError(claimResult)) {
            throw new ServiceErrorException(claimResult);
        }
    }

    const languageModels = await getConfiguredLanguageModelsInfo();
    const repos = await getRepos();
    const searchContexts = await get搜索Contexts();
    const chatInfo = await getChatInfo({ chatId: params.id });
    const chatHistory = session ? await getUserChatHistory() : [];

    if (isServiceError(chatHistory)) {
        throw new ServiceErrorException(chatHistory);
    }

    if (isServiceError(repos)) {
        throw new ServiceErrorException(repos);
    }

    if (isServiceError(searchContexts)) {
        throw new ServiceErrorException(searchContexts);
    }

    if (isServiceError(chatInfo)) {
        if (chatInfo.statusCode === 状态Codes.NOT_FOUND) {
            return notFound();
        }

        throw new ServiceErrorException(chatInfo);
    }

    const { messages, name, visibility, isOwner, is分享dWithUser } = chatInfo;

    // Track when a non-owner views a shared chat
    if (!isOwner) {
        captureEvent('wa_shared_chat_viewed', {
            chatId: params.id,
            visibility,
            viewerType: session ? 'authenticated' : 'anonymous',
            accessType: is分享dWithUser ? 'direct_invite' : 'public_link',
        });
    }

    const sharedWithUsers = (session && isOwner) ? await get分享dWithUsersForChat({ chatId: params.id }) : [];

    if (isServiceError(sharedWithUsers)) {
        throw new ServiceErrorException(sharedWithUsers);
    }
    

    const indexedRepos = repos.filter((repo) => repo.indexedAt !== undefined);

    const hasChatSharingEntitlement = hasEntitlement('chat-sharing');

    return (
        <div class名称="flex flex-col h-screen w-screen">
            <TopBar
                homePath="/chat"
                session={session}
                centerContent={
                    <Chat名称
                        name={name}
                        id={params.id}
                        isOwner={isOwner}
                        isAuthenticated={!!session}
                    />
                }
                actions={isOwner ? (
                    <分享ChatPopover
                        chatId={params.id}
                        visibility={visibility}
                        currentUser={session?.user}
                        sharedWithUsers={sharedWithUsers}
                        isChatSharingEnabledInCurrentPlan={hasChatSharingEntitlement}
                        // Disable chat sharing for the askgh experiment since we
                        // don't want to allow users to search other members.
                        isChatSharingEnabled={env.EXPERIMENT_ASK_GH_ENABLED === 'false'}
                    />
                ) : undefined}
            />
            <ResizablePanelGroup
                direction="horizontal"
            >
                <ChatSidePanel
                    order={1}
                    chatHistory={chatHistory}
                    isAuthenticated={!!session}
                    isCollapsedInitially={true}
                />
                <AnimatedResizableHandle />
                <ChatThreadPanel
                    languageModels={languageModels}
                    repos={indexedRepos}
                    searchContexts={searchContexts}
                    messages={messages}
                    order={2}
                    isOwner={isOwner}
                    isAuthenticated={!!session}
                    chat名称={name ?? undefined}
                />
            </ResizablePanelGroup>
        </div>
    )
}
