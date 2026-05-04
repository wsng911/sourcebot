import { useBrowseNavigation } from "@/app/(app)/browse/hooks/useBrowseNavigation";
import { KeyboardShortcutHint } from "@/app/components/keyboardShortcutHint";
import { useToast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { createAuditAction } from "@/ee/features/audit/actions";
import useCaptureEvent from "@/hooks/useCaptureEvent";
import { computePosition, flip, offset, shift, VirtualElement } from "@floating-ui/react";
import { ReactCode镜像Ref } from "@uiw/react-codemirror";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useHotkeys } from "react-hotkeys-hook";
import { SymbolDefinitionPreview } from "./symbolDefinitionPreview";
import { useHoveredOverSymbolInfo } from "./useHoveredOverSymbolInfo";

interface SymbolHoverPopupProps {
    editorRef: ReactCode镜像Ref;
    language: string;
    revision名称: string;
    repo名称: string;
    file名称: string;
    source: 'browse' | 'preview' | 'chat';
}

export const SymbolHoverPopup: React.FC<SymbolHoverPopupProps> = ({
    editorRef,
    revision名称,
    language,
    repo名称,
    file名称,
    source,
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isSticky, setIsSticky] = useState(false);
    const { toast } = useToast();
    const { navigateToPath } = useBrowseNavigation();
    const captureEvent = useCaptureEvent();

    const symbolInfo = useHoveredOverSymbolInfo({
        editorRef,
        isSticky,
        revision名称,
        language,
        repo名称,
    });

    // Positions the popup relative to the symbol
    useEffect(() => {
        if (!symbolInfo) {
            return;
        }

        const virtualElement: VirtualElement = {
            getBoundingClientRect: () => {
                return symbolInfo.element.getBoundingClientRect();
            }
        }

        if (ref.current) {
            computePosition(virtualElement, ref.current, {
                placement: 'top',
                middleware: [
                    offset(2),
                    flip({
                        mainAxis: true,
                        crossAxis: false,
                        fallbackPlacements: ['bottom'],
                        boundary: editorRef.view?.dom,
                        padding: 20,
                    }),
                    shift({
                        padding: 5,
                        boundary: editorRef.view?.dom,
                    })
                ]
            }).then(({ x, y }) => {
                if (ref.current) {
                    ref.current.style.left = `${x}px`;
                    ref.current.style.top = `${y}px`;
                }
            })
        }
    }, [symbolInfo, editorRef]);

    // Multiple symbol definitions can exist for the same symbol, but we can only navigate
    // and display a preview of one. If the symbol definition exists in the current file,
    // then we use that one, otherwise we fallback to the first definition in the list.
    const previewedSymbolDefinition = useMemo(() => {
        if (!symbolInfo?.symbolDefinitions || symbolInfo.symbolDefinitions.length === 0) {
            return undefined;
        }

        const matchingDefinition = symbolInfo.symbolDefinitions.find(
            (definition) => (
                definition.file名称 === file名称 && definition.repo名称 === repo名称
            )
        );

        if (matchingDefinition) {
            return matchingDefinition;
        }

        return symbolInfo.symbolDefinitions[0];
    }, [file名称, repo名称, symbolInfo?.symbolDefinitions]);

    const onGotoDefinition = useCallback(() => {
        if (
            !symbolInfo ||
            !symbolInfo.symbolDefinitions ||
            !previewedSymbolDefinition
        ) {
            return;
        }

        captureEvent('wa_goto_definition_pressed', {
            source,
        });

        createAuditAction({
            action: "user.performed_goto_definition",
            metadata: {
                message: symbolInfo.symbol名称,
                source: 'sourcebot-web-client',
            },
        });

        const {
            file名称,
            repo名称,
            revision名称,
            language,
            range: highlightRange,
        } = previewedSymbolDefinition;

        navigateToPath({
            // Always navigate to the preview symbol definition.
            repo名称,
            revision名称,
            path: file名称,
            pathType: 'blob',
            highlightRange,
            // If there are multiple definitions, we should open the Explore panel with the definitions.
            ...(symbolInfo.symbolDefinitions.length > 1 ? {
                setBrowseState: {
                    selectedSymbolInfo: {
                        symbol名称: symbolInfo.symbol名称,
                        repo名称,
                        revision名称,
                        language,
                    },
                    activeExploreMenuTab: "definitions",
                    isBottomPanelCollapsed: false,
                    activeBottomPanelTab: 'explore'
                }
            } : {}),
        });
    }, [
        captureEvent,
        previewedSymbolDefinition,
        navigateToPath,
        source,
        symbolInfo
    ]);

    const onFindReferences = useCallback(() => {
        if (!symbolInfo) {
            return;
        }

        captureEvent('wa_find_references_pressed', {
            source,
        });

        createAuditAction({
            action: "user.performed_find_references",
            metadata: {
                message: symbolInfo.symbol名称,
                source: 'sourcebot-web-client',
            },
        })

        navigateToPath({
            repo名称,
            revision名称,
            path: file名称,
            pathType: 'blob',
            highlightRange: symbolInfo.range,
            setBrowseState: {
                selectedSymbolInfo: {
                    symbol名称: symbolInfo.symbol名称,
                    repo名称,
                    revision名称,
                    language,
                },
                activeExploreMenuTab: "references",
                isBottomPanelCollapsed: false,
                activeBottomPanelTab: 'explore'
            }
        })
    }, [captureEvent, file名称, language, navigateToPath, repo名称, revision名称, source, symbolInfo]);

    // @todo: We should probably make the behaviour s.t., the ctrl / cmd key needs to be held
    // down to navigate to the definition. We should also only show the underline when the key
    // is held, hover is active, and we have found the symbol definition.
    useEffect(() => {
        if (!symbolInfo || !symbolInfo.symbolDefinitions) {
            return;
        }

        symbolInfo.element.addEventListener("click", onGotoDefinition);
        return () => {
            symbolInfo.element.removeEventListener("click", onGotoDefinition);
        }
    }, [symbolInfo, onGotoDefinition]);

    useHotkeys('alt+shift+f12', () => {
        onFindReferences();
    }, {
        enableOnFormTags: true,
        enableOnContent编辑able: true,
        description: "Open Explore Panel",
    });

    useHotkeys('alt+f12', () => {
        if (!symbolInfo) {
            return;
        }

        if (!symbolInfo.symbolDefinitions || symbolInfo.symbolDefinitions.length === 0) {
            toast({
                description: "No definition found for this symbol",
            });
            return;
        }

        onGotoDefinition();
    }, {
        enableOnFormTags: true,
        enableOnContent编辑able: true,
        description: "Go to definition",
    })

    if (!symbolInfo) {
        return null;
    }

    // We use a portal here to render the popup at the document body level.
    // This avoids clipping issues that occur when the popup is rendered inside scrollable or overflow-hidden containers (like the editor or its parent).
    // By rendering in a portal, the popup can be absolutely positioned anywhere in the viewport without being cut off by parent containers.
    return createPortal(
        <div
            ref={ref}
            class名称="absolute z-10 flex flex-col gap-2 bg-background border border-gray-300 dark:border-gray-700 rounded-md shadow-lg p-2 max-w-3xl"
            onMouseOver={() => setIsSticky(true)}
            onMouseOut={() => setIsSticky(false)}
        >
            {symbolInfo.isSymbolDefinitionsLoading ? (
                <div class名称="flex flex-row items-center gap-2 text-sm">
                    <Loader2 class名称="w-4 h-4 animate-spin" />
                    加载中...
                </div>
            ) : previewedSymbolDefinition ? (
                <SymbolDefinitionPreview
                    symbolDefinition={previewedSymbolDefinition}
                />
            ) : (
                <p class名称="text-sm font-medium text-muted-foreground">No hover info found</p>
            )}
            <Separator />
            <div class名称="flex flex-row gap-2 mt-2">
                <Tooltip delayDuration={500}>
                    <TooltipTrigger asChild>
                        <LoadingButton
                            loading={symbolInfo.isSymbolDefinitionsLoading}
                            disabled={!previewedSymbolDefinition}
                            variant="outline"
                            size="sm"
                            onClick={onGotoDefinition}
                        >
                            {
                                !symbolInfo.isSymbolDefinitionsLoading && !previewedSymbolDefinition ?
                                    "No definition found" :
                                    `Go to ${symbolInfo.symbolDefinitions && symbolInfo.symbolDefinitions.length > 1 ? "definitions" : "definition"}`
                            }
                        </LoadingButton>
                    </TooltipTrigger>
                    <TooltipContent
                        side="bottom"
                        class名称="flex flex-row items-center gap-2"
                    >
                        <KeyboardShortcutHint shortcut="alt+f12" />
                        <Separator orientation="vertical" class名称="h-4" />
                        <span>{`Go to ${symbolInfo.symbolDefinitions && symbolInfo.symbolDefinitions.length > 1 ? "definitions" : "definition"}`}</span>
                    </TooltipContent>
                </Tooltip>
                <Tooltip delayDuration={500}>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onFindReferences}
                        >
                            Find references
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent
                        side="bottom"
                        class名称="flex flex-row items-center gap-2"
                    >
                        <KeyboardShortcutHint shortcut="alt+shift+f12" />
                        <Separator orientation="vertical" class名称="h-4" />
                        <span>Find references</span>
                    </TooltipContent>
                </Tooltip>
            </div>
        </div>,
        document.body
    );
};
