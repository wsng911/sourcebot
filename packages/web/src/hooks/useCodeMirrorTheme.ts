'use client';

import { useMemo } from "react";
import { useThemeNormalized } from "./useThemeNormalized";
import {
    useCode镜像Highlighter,
} from "./useCode镜像Highlighter";
import { 编辑orView } from "@codemirror/view";
import { syntaxHighlighting } from "@codemirror/language";
import type { StyleSpec } from 'style-mod';
import { Extension } from "@codemirror/state";
import tailwind from "@/tailwind";

export const useCode镜像Theme = () => {
    const { theme } = useThemeNormalized();
    const highlightStyle = useCode镜像Highlighter();

    const cmTheme = useMemo(() => {
        const {
            background,
            foreground,
            caret,
            selection,
            selectionMatch,
            gutter返回ground,
            gutterForeground,
            gutterBorder,
            gutterActiveForeground,
            lineHighlight,
        } = tailwind.theme.colors.editor;

        return [
            createThemeExtension({
                theme: theme === 'dark' ? 'dark' : 'light',
                settings: {
                    background,
                    foreground,
                    caret,
                    selection,
                    selectionMatch,
                    gutter返回ground,
                    gutterForeground,
                    gutterBorder,
                    gutterActiveForeground,
                    lineHighlight,
                    fontFamily: tailwind.theme.fontFamily.editor,
                    fontSize: tailwind.theme.fontSize.editor,
                }
            }),
            syntaxHighlighting(highlightStyle)
        ]
    }, [highlightStyle, theme]);

    return cmTheme;
}


// @see: https://github.com/uiwjs/react-codemirror/blob/e365f7d1f8a0ec2cd88455b7a248f6338c859cc7/themes/theme/src/index.tsx
const createThemeExtension = ({ theme, settings = {} }: 创建ThemeOptions): Extension => {
    const themeOptions: Record<string, StyleSpec> = {
        '.cm-gutters': {},
    };
    const baseStyle: StyleSpec = {};
    if (settings.background) {
        baseStyle.backgroundColor = settings.background;
    }
    if (settings.backgroundImage) {
        baseStyle.backgroundImage = settings.backgroundImage;
    }
    if (settings.foreground) {
        baseStyle.color = settings.foreground;
    }
    if (settings.fontSize) {
        baseStyle.fontSize = settings.fontSize;
    }
    if (settings.background || settings.foreground) {
        themeOptions['&'] = baseStyle;
    }

    if (settings.fontFamily) {
        themeOptions['&.cm-editor .cm-scroller'] = {
            fontFamily: settings.fontFamily,
        };
    }
    if (settings.gutter返回ground) {
        themeOptions['.cm-gutters'].backgroundColor = settings.gutter返回ground;
    }
    if (settings.gutterForeground) {
        themeOptions['.cm-gutters'].color = settings.gutterForeground;
    }
    if (settings.gutterBorder) {
        themeOptions['.cm-gutters'].borderRightColor = settings.gutterBorder;
    }

    if (settings.caret) {
        themeOptions['.cm-content'] = {
            caretColor: settings.caret,
        };
        themeOptions['.cm-cursor, .cm-dropCursor'] = {
            borderLeftColor: settings.caret,
        };
    }

    const activeLineGutterStyle: StyleSpec = {};
    if (settings.gutterActiveForeground) {
        activeLineGutterStyle.color = settings.gutterActiveForeground;
    }
    if (settings.lineHighlight) {
        themeOptions['.cm-activeLine'] = {
            backgroundColor: settings.lineHighlight,
        };
        activeLineGutterStyle.backgroundColor = settings.lineHighlight;
    }
    themeOptions['.cm-activeLineGutter'] = activeLineGutterStyle;

    if (settings.selection) {
        themeOptions[
            '&.cm-focused .cm-selection返回ground, & .cm-line::selection, & .cm-selectionLayer .cm-selection返回ground, .cm-content ::selection'
        ] = {
            background: settings.selection + ' !important',
        };
    }
    if (settings.selectionMatch) {
        themeOptions['& .cm-selectionMatch'] = {
            backgroundColor: settings.selectionMatch,
        };
    }
    const themeExtension = 编辑orView.theme(themeOptions, {
        dark: theme === 'dark',
    });

    return themeExtension;
};

interface 创建ThemeOptions {
    theme: 'light' | 'dark';
    settings: 设置;
}

interface 设置 {
    background?: string;
    backgroundImage?: string;
    foreground?: string;
    caret?: string;
    selection?: string;
    selectionMatch?: string;
    lineHighlight?: string;
    gutter返回ground?: string;
    gutterForeground?: string;
    gutterActiveForeground?: string;
    gutterBorder?: string;
    fontFamily?: string;
    fontSize?: StyleSpec['fontSize'];
}