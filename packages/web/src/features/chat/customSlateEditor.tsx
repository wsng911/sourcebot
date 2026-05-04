'use client';

import { Slate } from "slate-react";
import { useCustomSlate编辑or } from "./useCustomSlate编辑or";
import { CustomElement } from "./types";

interface CustomSlate编辑orProps {
    children: React.ReactNode;
}

const initialValue: CustomElement[] = [
    {
        type: 'paragraph',
        children: [{ text: '' }],
    },
];

export const CustomSlate编辑or = ({ children }: CustomSlate编辑orProps) => {
    const editor = useCustomSlate编辑or();

    return <Slate
        editor={editor}
        initialValue={initialValue}
    >
        {children}
    </Slate>;
}