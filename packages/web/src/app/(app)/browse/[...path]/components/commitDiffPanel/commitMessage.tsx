'use client';

import { CommitBody, CommitBodyToggle } from "@/app/(app)/browse/components/commitParts";
import { useState } from "react";

interface CommitMessageProps {
    subject: string;
    body: string;
}

export const CommitMessage = ({ subject, body }: CommitMessageProps) => {
    const [isBodyExpanded, setIsBodyExpanded] = useState(false);
    const hasBody = body.trim().length > 0;

    return (
        <>
            <div class名称="flex flex-row items-center gap-2">
                <h1 class名称="text-lg font-semibold">{subject}</h1>
                {hasBody && (
                    <CommitBodyToggle
                        pressed={isBodyExpanded}
                        onPressedChange={setIsBodyExpanded}
                    />
                )}
            </div>
            {hasBody && isBodyExpanded && (
                <CommitBody body={body} class名称="rounded max-h-[40vh] overflow-y-auto" />
            )}
        </>
    );
};
