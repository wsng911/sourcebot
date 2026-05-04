'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface TocItem {
    id: string;
    text: string;
    level: number;
    element: HTMLElement;
}

interface TableOfContentsProps {
    tocItems: TocItem[];
    activeId: string;
    class名称?: string;
}

export const TableOfContents = ({ tocItems, activeId, class名称 }: TableOfContentsProps) => {
    const scrollToHeading = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    };

    return (
        <nav class名称={cn('space-y-0.5', class名称)}>
            {tocItems.map((item) => (
                <Button
                    key={item.id}
                    variant="link"
                    size="sm"
                    onClick={() => scrollToHeading(item.id)}
                    class名称={cn(
                        'w-full justify-start text-left h-auto py-0.5 px-0 font-normal text-wrap hover:text-foreground underline-offset-2 text-xs',
                        {
                            'text-foreground': activeId === item.id,
                            'text-muted-foreground': activeId !== item.id,
                        }
                    )}
                    style={{
                        paddingLeft: `${(item.level - 1) * 8 + 0}px`
                    }}
                >
                    {item.text}
                </Button>
            ))}
        </nav>
    );
}; 