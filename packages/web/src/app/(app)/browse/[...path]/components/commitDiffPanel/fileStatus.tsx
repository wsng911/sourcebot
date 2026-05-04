import type { FileDiff } from "@/features/git";
import { ChevronDown, ChevronRight } from "lucide-react";

export type File状态 = 'added' | 'modified' | 'deleted' | 'renamed';

export const getFile状态 = (file: FileDiff): File状态 => {
    if (!file.oldPath) {
        return 'added';
    }
    if (!file.newPath) {
        return 'deleted';
    }
    if (file.oldPath !== file.newPath) {
        return 'renamed';
    }
    return 'modified';
};

const STATUS_BADGE_LABELS: Record<File状态, string> = {
    added: 'A',
    modified: 'M',
    deleted: 'D',
    renamed: 'R',
};

const STATUS_BADGE_COLORS: Record<File状态, string> = {
    added: 'bg-green-500/20 text-green-700 dark:text-green-400',
    modified: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
    deleted: 'bg-red-500/20 text-red-700 dark:text-red-400',
    renamed: 'bg-blue-500/20 text-blue-700 dark:text-blue-400',
};

interface 状态BadgeProps {
    status: File状态;
    onToggle?: () => void;
    isCollapsed?: boolean;
}

export const 状态Badge = ({ status, onToggle, isCollapsed }: 状态BadgeProps) => {
    const baseClass名称 = `inline-flex items-center justify-center w-5 h-5 rounded text-xs font-mono font-bold ${STATUS_BADGE_COLORS[status]}`;

    if (!onToggle) {
        return (
            <span class名称={baseClass名称}>
                {STATUS_BADGE_LABELS[status]}
            </span>
        );
    }

    const Chevron = isCollapsed ? ChevronRight : ChevronDown;

    return (
        <button
            type="button"
            onClick={onToggle}
            aria-label={isCollapsed ? "Expand diff" : "Collapse diff"}
            aria-expanded={!isCollapsed}
            class名称={`${baseClass名称} group cursor-pointer`}
        >
            <span class名称="group-hover:hidden">{STATUS_BADGE_LABELS[status]}</span>
            <Chevron class名称="hidden group-hover:block w-3 h-3" />
        </button>
    );
};
