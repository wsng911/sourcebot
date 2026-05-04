'use client';

import { useToast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import useCaptureEvent from "@/hooks/useCaptureEvent";
import { createPathWithQueryParams } from "@/lib/utils";
import { autoPlacement, computePosition, offset, shift, VirtualElement } from "@floating-ui/react";
import { Link2Icon } from "@radix-ui/react-icons";
import { 编辑orView, SelectionRange } from "@uiw/react-codemirror";
import { useCallback, useEffect, useRef } from "react";
import { HIGHLIGHT_RANGE_QUERY_PARAM } from "../browse/hooks/utils";

interface ContextMenuProps {
    view: 编辑orView;
    selection: SelectionRange;
    repo名称: string;
    path: string;
    revision名称: string;
}

export const 编辑orContextMenu = ({
    view,
    selection,
    repo名称,
    path,
    revision名称,
}: ContextMenuProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const { toast } = useToast();
    const captureEvent = useCaptureEvent();
    useEffect(() => {
        if (selection.empty) {
            ref.current?.classList.add('hidden');
        } else {
            ref.current?.classList.remove('hidden');
        }
    }, [selection.empty]);


    useEffect(() => {
        if (selection.empty) {
            return;
        }

        const { from, to } = selection;
        const start = view.coordsAtPos(from);
        const end = view.coordsAtPos(to);
        if (!start || !end) {
            return;
        }

        const selectionElement: VirtualElement = {
            getBoundingClientRect: () => {

                const { top, left } = start;
                const { bottom, right } = end;

                return {
                    x: left,
                    y: top,
                    top,
                    bottom,
                    left,
                    right,
                    width: right - left,
                    height: bottom - top,
                }
            }
        }

        if (ref.current) {
            computePosition(selectionElement, ref.current, {
                middleware: [
                    offset(5),
                    autoPlacement({
                        boundary: view.dom,
                        padding: 5,
                        allowedPlacements: ['bottom'],
                    }),
                    shift({
                        padding: 5
                    })
                ],
            }).then(({ x, y }) => {
                if (ref.current) {
                    ref.current.style.left = `${x}px`;
                    ref.current.style.top = `${y}px`;
                }
            });
        }

    }, [selection, view]);

    const on复制LinkToSelection = useCallback(() => {
        const toLineAndColumn = (pos: number) => {
            const lineInfo = view.state.doc.lineAt(pos);
            return {
                line: lineInfo.number,
                column: pos - lineInfo.from + 1,
            }
        }

        const from = toLineAndColumn(selection.from);
        const to = toLineAndColumn(selection.to);

        const basePath = `${window.location.origin}/browse`;
        const url = createPathWithQueryParams(`${basePath}/${repo名称}@${revision名称}/-/blob/${path}`,
            [HIGHLIGHT_RANGE_QUERY_PARAM, `${from?.line}:${from?.column},${to?.line}:${to?.column}`],
        );

        navigator.clipboard.writeText(url);
        toast({
            description: "✅ Copied link to selection",
        });

        captureEvent('wa_share_link_created', {});

        // Reset the selection
        view.dispatch(
            {
                selection: {
                    anchor: selection.to,
                    head: selection.to,
                }     
            }
        )
    }, [selection.from, selection.to, repo名称, revision名称, path, toast, captureEvent, view]);

    return (
        <div
            ref={ref}
            class名称="absolute z-10 flex flex-col gap-2 bg-background border border-gray-300 dark:border-gray-700 rounded-md shadow-lg p-2"
        >
            <Button
                variant="ghost"
                size="sm"
                onClick={on复制LinkToSelection}
            >
                <Link2Icon class名称="h-4 w-4 mr-1" />
                分享 selection
            </Button>
        </div>
    )
}