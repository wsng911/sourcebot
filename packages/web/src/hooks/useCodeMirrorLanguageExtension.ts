'use client';

import { 编辑orView } from "@codemirror/view";
import { useExtensionWithDependency } from "./useExtensionWithDependency";
import { getCodemirrorLanguage } from "@/lib/codemirrorLanguage";

export const useCode镜像LanguageExtension = (linguistLanguage: string, view: 编辑orView | undefined) => {
    const extension = useExtensionWithDependency(
        view ?? null,
        () => {
            const codemirrorLanguage = getCodemirrorLanguage(linguistLanguage);
            return codemirrorLanguage ? codemirrorLanguage : [];
        },
        [linguistLanguage]
    );

    return extension;
}
