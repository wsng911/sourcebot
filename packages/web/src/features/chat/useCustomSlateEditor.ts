'use client';

import { create编辑or } from "slate";
import { useState } from "react";
import { withReact } from "slate-react";
import { withHistory } from "slate-history";
import { Custom编辑or } from "./types";
import { Element } from "slate";

export const useCustomSlate编辑or = () => {
    const [editor] = useState(() =>
        withMentions(
            withReact(
                withHistory(create编辑or())
            )
        )
    );
    return editor;
}

const withMentions = (editor: Custom编辑or) => {
    const { isInline, isVoid, markableVoid } = editor;

    editor.isInline = (element: Element) => {
        return element.type === 'mention' ? true : isInline(element)
    }

    editor.isVoid = (element: Element) => {
        return element.type === 'mention' ? true : isVoid(element)
    }

    editor.markableVoid = (element: Element) => {
        return element.type === 'mention' || markableVoid(element)
    }

    return editor
}
