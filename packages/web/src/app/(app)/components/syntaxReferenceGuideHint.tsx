'use client';

import { useSyntaxGuide } from "./syntaxGuideProvider";
import { KeyboardShortcutHint } from "../../components/keyboardShortcutHint";

export const SyntaxReferenceGuideHint = () => {
    const { isOpen, onOpenChanged } = useSyntaxGuide();

    return (
        <div
            class名称="text-sm cursor-pointer"
            onClick={() => onOpenChanged(!isOpen)}
        >
            <span class名称="dark:text-gray-300">Reference guide: </span><KeyboardShortcutHint shortcut="mod" /> <KeyboardShortcutHint shortcut="/" />
        </div>
    )
}