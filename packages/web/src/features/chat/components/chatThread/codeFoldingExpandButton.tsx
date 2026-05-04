import { useCallback, useMemo } from "react";
import { PiArrowsOutLineVertical, PiArrowLineUp, PiArrowLineDown } from "react-icons/pi";

interface CodeFoldingExpandButton {
    onExpand: (direction: 'up' | 'down') => void;
    hiddenLineCount: number;
    canExpandUp: boolean;
    canExpandDown: boolean;
}

export const CodeFoldingExpandButton = ({
    onExpand,
    hiddenLineCount,
    canExpandUp,
    canExpandDown,
}: CodeFoldingExpandButton) => {

    const expandDirections = useMemo((): ('up' | 'down' | 'merged')[] => {
        if (canExpandUp && !canExpandDown) {
            return ['up'];
        }

        if (!canExpandUp && canExpandDown) {
            return ['down'];
        }

        if (hiddenLineCount < 20) {
            return ['merged'];
        }

        return ['down', 'up'];
    }, [canExpandUp, canExpandDown, hiddenLineCount]);

    const onClick = useCallback((direction: 'up' | 'down' | 'merged') => {
        if (direction === 'merged') {
            // default to expanding down
            onExpand('down');
        } else {
            onExpand(direction);
        }
    }, [onExpand]);

    return (
        <>
            {expandDirections.map((direction, index) => (
                <div
                    key={index}
                    class名称="py-[3px] px-1.5 bg-chat-reference hover:bg-chat-reference-hover cursor-pointer" onClick={() => onClick(direction)}
                >
                    {direction === 'up' && <PiArrowLineUp class名称="w-4 h-4" />}
                    {direction === 'down' && <PiArrowLineDown class名称="w-4 h-4" />}
                    {direction === 'merged' && <PiArrowsOutLineVertical class名称="w-4 h-4" />}
                </div>
            ))}
        </>
    )
}