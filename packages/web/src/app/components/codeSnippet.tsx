import { cn } from "@/lib/utils"

export const CodeSnippet = ({ children, class名称, title, renderNewlines = false }: { children: React.ReactNode, class名称?: string, title?: string, renderNewlines?: boolean }) => {
    return (
        <code
            class名称={cn("bg-gray-100 dark:bg-gray-700 w-fit rounded-md px-2 py-0.5 font-medium font-mono", class名称)}
            title={title}
        >
            {renderNewlines ? <pre>{children}</pre> : children}
        </code>
    )
}