'use client';

import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { BottomPanel } from "./components/bottomPanel";
import { AnimatedResizableHandle } from "@/components/ui/animatedResizableHandle";
import { BrowseStateProvider } from "./browseStateProvider";
import { FileTreePanel } from "./components/fileTreePanel";
import { TopBar } from "@/app/(app)/components/topBar";
import { useBrowseParams } from "./hooks/useBrowseParams";
import { File搜索CommandDialog } from "./components/file搜索CommandDialog";
import { 搜索Bar } from "../components/searchBar";
import escapeStringRegexp from "escape-string-regexp";
import { Session } from "next-auth";

interface LayoutProps {
    children: React.ReactNode;
    session: Session | null;
    is搜索AssistSupported: boolean;
}

export function LayoutClient({
    children,
    session,
    is搜索AssistSupported,
}: LayoutProps) {
    const { repo名称, revision名称, pathType } = useBrowseParams();
    return (
        <BrowseStateProvider>
            <div class名称="flex flex-col h-screen">
                <TopBar
                    session={session}
                >
                    <搜索Bar
                        size="sm"
                        defaults={{
                            query: `repo:^${escapeStringRegexp(repo名称)}$${revision名称 ? ` rev:${revision名称}` : ''} `,
                        }}
                        class名称="w-full"
                        is搜索AssistSupported={is搜索AssistSupported}
                    />
                </TopBar>
                <ResizablePanelGroup
                    direction="horizontal"
                >
                    <FileTreePanel order={1} />

                    <AnimatedResizableHandle />

                    <ResizablePanel
                        order={2}
                        minSize={10}
                        defaultSize={80}
                        id="code-preview-panel-container"
                    >
                        <ResizablePanelGroup
                            direction="vertical"
                        >
                            <ResizablePanel
                                order={1}
                                id="code-preview-panel"
                            >
                                {children}
                            </ResizablePanel>
                            {(pathType === 'blob' || pathType === 'tree') && (
                                <>
                                    <AnimatedResizableHandle />
                                    <BottomPanel
                                        order={2}
                                    />
                                </>
                            )}
                        </ResizablePanelGroup>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
            <File搜索CommandDialog />
        </BrowseStateProvider>
    );
}
