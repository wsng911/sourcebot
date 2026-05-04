'use client';

import { useExtractTOCItems } from "../../useTOCItems";
import { TableOfContents } from "./tableOfContents";
import { Button } from "@/components/ui/button";
import { TableOfContentsIcon, ThumbsDown, ThumbsUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { MarkdownRenderer } from "./markdownRenderer";
import { forwardRef, memo, useCallback, useImperativeHandle, useRef, useState } from "react";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { 复制IconButton } from "@/app/(app)/components/copyIconButton";
import { useToast } from "@/components/hooks/use-toast";
import { convertLLMOutputToPortableMarkdown } from "../../utils";
import { submitFeedback } from "../../actions";
import { isServiceError } from "@/lib/utils";
import useCaptureEvent from "@/hooks/useCaptureEvent";
import { LangfuseWeb } from "langfuse";
import { env } from "@sourcebot/shared/client";
import isEqual from "fast-deep-equal/react";

interface AnswerCardProps {
    answerText: string;
    messageId: string;
    chatId: string;
    traceId?: string;
}

const langfuseWeb = env.NEXT_PUBLIC_LANGFUSE_PUBLIC_KEY ? new LangfuseWeb({
    publicKey: env.NEXT_PUBLIC_LANGFUSE_PUBLIC_KEY,
    baseUrl: env.NEXT_PUBLIC_LANGFUSE_BASE_URL,
}) : null;

const AnswerCardComponent = forwardRef<HTMLDivElement, AnswerCardProps>(({
    answerText,
    messageId,
    chatId,
    traceId,
}, forwardedRef) => {
    const markdownRendererRef = useRef<HTMLDivElement>(null);
    // eslint-disable-next-line react-hooks/refs -- ref.current is passed to a custom hook, not used directly in render output
    const { tocItems, activeId } = useExtractTOCItems({ target: markdownRendererRef.current });
    const [isTOCButtonToggled, setIsTOCButtonToggled] = useState(false);
    const { toast } = useToast();
    const [is提交tingFeedback, setIs提交tingFeedback] = useState(false);
    const [feedback, setFeedback] = useState<'like' | 'dislike' | undefined>(undefined);
    const captureEvent = useCaptureEvent();

    useImperativeHandle(
        forwardedRef,
        () => markdownRendererRef.current as HTMLDivElement
    );

    const on复制Answer = useCallback(() => {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        const markdownText = convertLLMOutputToPortableMarkdown(answerText, baseUrl);
        navigator.clipboard.writeText(markdownText);
        toast({
            description: "✅ Copied to clipboard",
        });
        captureEvent('wa_chat_copy_answer_pressed', { chatId });
        return true;
    }, [answerText, chatId, captureEvent, toast]);

    const onFeedback = useCallback(async (feedbackType: 'like' | 'dislike') => {
        setIs提交tingFeedback(true);

        const response = await submitFeedback({
            chatId,
            messageId,
            feedbackType
        });

        if (isServiceError(response)) {
            toast({
                description: `❌ Failed to submit feedback: ${response.message}`,
                variant: "destructive"
            });
        } else {
            toast({
                description: `✅ Feedback submitted`,
            });
            setFeedback(feedbackType);
            captureEvent('wa_chat_feedback_submitted', {
                feedback: feedbackType,
                chatId,
                messageId,
            });

            langfuseWeb?.score({
                traceId: traceId,
                name: 'user_feedback',
                value: feedbackType === 'like' ? 1 : 0,
            })
        }

        setIs提交tingFeedback(false);
    }, [chatId, messageId, toast, captureEvent, traceId]);

    return (
        <div class名称="flex flex-row w-full relative scroll-mt-16">
            {(isTOCButtonToggled && tocItems.length > 0) && (
                <TableOfContents
                    tocItems={tocItems}
                    activeId={activeId}
                    class名称="sticky top-0 h-fit max-w-44 py-2 mr-1.5"
                />
            )}
            <div class名称="flex flex-col w-full bg-[#fcfcfc] dark:bg-[#0e1320] px-4 py-2 rounded-lg shadow-sm">
                <div class名称="flex flex-col z-10 bg-inherit py-2 sticky top-0">
                    <div class名称="flex items-center justify-between mb-2">
                        <p class名称="font-semibold text-muted-foreground">Answer</p>
                        <div class名称="flex items-center gap-2">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <复制IconButton
                                        on复制={on复制Answer}
                                        class名称="h-6 w-6 text-muted-foreground"
                                    />
                                </TooltipTrigger>
                                <TooltipContent
                                    side="bottom"
                                >
                                    复制 answer
                                </TooltipContent>
                            </Tooltip>
                            {tocItems.length > 0 && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Toggle
                                            class名称="h-6 w-6 px-3 min-w-6 text-muted-foreground"
                                            pressed={isTOCButtonToggled}
                                            onPressedChange={(next) => {
                                                setIsTOCButtonToggled(next);
                                                captureEvent('wa_chat_toc_toggled', { chatId, isExpanded: next });
                                            }}
                                        >
                                            <TableOfContentsIcon class名称="h-3 w-3" />
                                        </Toggle>
                                    </TooltipTrigger>
                                    <TooltipContent
                                        side="bottom"
                                    >
                                        Toggle table of contents
                                    </TooltipContent>
                                </Tooltip>
                            )}
                        </div>
                    </div>
                    <Separator />
                </div>
                <MarkdownRenderer
                    ref={markdownRendererRef}
                    content={answerText}
                    // scroll-mt offsets the scroll position for headings to take account
                    // of the sticky "answer" header.
                    class名称="prose prose-sm max-w-none prose-headings:scroll-mt-14"
                />
                <Separator class名称="my-2" />
                <div class名称="flex gap-2">
                    <Button
                        variant={feedback === 'like' ? "default" : "ghost"}
                        size="sm"
                        class名称="h-8 px-2"
                        onClick={() => onFeedback('like')}
                        disabled={is提交tingFeedback || feedback !== undefined}
                    >
                        <ThumbsUp class名称="h-4 w-4" />
                    </Button>
                    <Button
                        variant={feedback === 'dislike' ? "default" : "ghost"}
                        size="sm"
                        class名称="h-8 px-2"
                        onClick={() => onFeedback('dislike')}
                        disabled={is提交tingFeedback || feedback !== undefined}
                    >
                        <ThumbsDown class名称="h-4 w-4" />
                    </Button>
                </div>
            </div>

        </div>
    )
})

AnswerCardComponent.display名称 = 'AnswerCard';

export const AnswerCard = memo(AnswerCardComponent, isEqual);