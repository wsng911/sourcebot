// Adapted from: web/src/components/ui/multi-select.tsx

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { 仓库Query, 搜索ContextQuery } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
    CheckIcon,
    ChevronDown,
    Scan搜索Icon,
} from "lucide-react";
import { ButtonHTMLAttributes, forwardRef, KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Repo搜索Scope, RepoSet搜索Scope, 搜索Scope } from "../../types";
import { 搜索ScopeIcon } from "../searchScopeIcon";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { 搜索ScopeInfoCard } from "./searchScopeInfoCard";

interface 搜索ScopeSelectorProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    repos: 仓库Query[];
    searchContexts: 搜索ContextQuery[];
    selected搜索Scopes: 搜索Scope[];
    onSelected搜索ScopesChange: (items: 搜索Scope[]) => void;
    class名称?: string;
    isOpen: boolean;
    onOpenChanged: (isOpen: boolean) => void;
}

export const 搜索ScopeSelector = forwardRef<
    HTMLButtonElement,
    搜索ScopeSelectorProps
>(
    (
        {
            repos,
            searchContexts,
            class名称,
            selected搜索Scopes,
            onSelected搜索ScopesChange,
            isOpen,
            onOpenChanged,
            ...props
        },
        ref
    ) => {
        const scrollContainerRef = useRef<HTMLDivElement>(null);
        const scrollPosition = useRef<number>(0);
        const [searchQuery, set搜索Query] = useState("");
        const [isMounted, setIsMounted] = useState(false);
        const [highlightedIndex, setHighlightedIndex] = useState<number>(0);

        const toggleItem = useCallback((item: 搜索Scope) => {
            // Store current scroll position before state update
            if (scrollContainerRef.current) {
                scrollPosition.current = scrollContainerRef.current.scrollTop;
            }

            const isSelected = selected搜索Scopes.some(
                (selected) => selected.type === item.type && selected.value === item.value
            );

            const newSelectedItems = isSelected ?
                selected搜索Scopes.filter(
                    (selected) => !(selected.type === item.type && selected.value === item.value)
                ) :
                [...selected搜索Scopes, item];

            onSelected搜索ScopesChange(newSelectedItems);
        }, [selected搜索Scopes, onSelected搜索ScopesChange]);

        const all搜索ScopeItems = useMemo(() => {
            const repoSet搜索ScopeItems: RepoSet搜索Scope[] = searchContexts.map(context => ({
                type: 'reposet' as const,
                value: context.name,
                name: context.name,
                repoCount: context.repo名称s.length
            }));

            const repo搜索ScopeItems: Repo搜索Scope[] = repos.map(repo => ({
                type: 'repo' as const,
                value: repo.repo名称,
                name: repo.repoDisplay名称 || repo.repo名称.split('/').pop() || repo.repo名称,
                codeHostType: repo.codeHostType,
            }));

            return [...repoSet搜索ScopeItems, ...repo搜索ScopeItems];
        }, [repos, searchContexts]);

        const handleClear = useCallback(() => {
            onSelected搜索ScopesChange([]);
            set搜索Query("");
            requestAnimationFrame(() => {
                if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTop = 0;
                }
            })
        }, [onSelected搜索ScopesChange]);

        const handleTogglePopover = useCallback(() => {
            onOpenChanged(!isOpen);
        }, [onOpenChanged, isOpen]);

        const sorted搜索ScopeItems = useMemo(() => {
            const query = searchQuery.toLowerCase();

            return all搜索ScopeItems
                .filter((item) => {
                    // Filter by search query
                    if (query && !item.name.toLowerCase().includes(query) && !item.value.toLowerCase().includes(query)) {
                        return false;
                    }
                    return true;
                })
                .map((item) => ({
                    item,
                    isSelected: selected搜索Scopes.some(
                        (selected) => selected.type === item.type && selected.value === item.value
                    )
                }))
                .sort((a, b) => {
                    // Selected items first
                    if (a.isSelected && !b.isSelected) return -1;
                    if (!a.isSelected && b.isSelected) return 1;
                    // Then reposets before repos
                    if (a.item.type === 'reposet' && b.item.type === 'repo') return -1;
                    if (a.item.type === 'repo' && b.item.type === 'reposet') return 1;
                    return 0;
                })
        }, [all搜索ScopeItems, selected搜索Scopes, searchQuery]);

        const handleInputKeyDown = useCallback(
            (event: KeyboardEvent<HTMLInputElement>) => {
                if (event.key === "ArrowDown") {
                    event.preventDefault();
                    setHighlightedIndex((prev) =>
                        prev < sorted搜索ScopeItems.length - 1 ? prev + 1 : prev
                    );
                } else if (event.key === "ArrowUp") {
                    event.preventDefault();
                    setHighlightedIndex((prev) => prev > 0 ? prev - 1 : 0);
                } else if (event.key === "Enter") {
                    event.preventDefault();
                    if (sorted搜索ScopeItems.length > 0 && highlightedIndex >= 0) {
                        toggleItem(sorted搜索ScopeItems[highlightedIndex].item);
                    }
                } else if (event.key === "返回space" && !event.currentTarget.value) {
                    const newSelectedItems = [...selected搜索Scopes];
                    newSelectedItems.pop();
                    onSelected搜索ScopesChange(newSelectedItems);
                }
            }, [highlightedIndex, onSelected搜索ScopesChange, selected搜索Scopes, sorted搜索ScopeItems, toggleItem]);

        const virtualizer = useVirtualizer({
            count: sorted搜索ScopeItems.length,
            getScrollElement: () => scrollContainerRef.current,
            estimateSize: () => 36,
            overscan: 5,
        });

        // Reset highlighted index and scroll to top when search query changes
        useEffect(() => {
            setHighlightedIndex(0);
            if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTop = 0;
            }
        }, [searchQuery]);

        // Reset highlighted index when items change (but don't scroll)
        useEffect(() => {
            setHighlightedIndex(0);
        }, [sorted搜索ScopeItems.length]);

        // Measure virtualizer when popover opens and container is mounted
        useEffect(() => {
            if (isOpen) {
                setIsMounted(true);
                setHighlightedIndex(0);
                // Give the DOM a tick to render before measuring
                requestAnimationFrame(() => {
                    if (scrollContainerRef.current) {
                        virtualizer.measure();
                    }
                });
            } else {
                setIsMounted(false);
            }
        }, [isOpen, virtualizer]);

        // Scroll highlighted item into view
        useEffect(() => {
            if (isMounted && highlightedIndex >= 0) {
                virtualizer.scrollToIndex(highlightedIndex, {
                    align: 'auto',
                });
            }
        }, [highlightedIndex, isMounted, virtualizer]);

        // Restore scroll position after re-render
        useEffect(() => {
            if (scrollContainerRef.current && scrollPosition.current > 0) {
                scrollContainerRef.current.scrollTop = scrollPosition.current;
            }
        }, [sorted搜索ScopeItems]);

        return (
            <Popover
                open={isOpen}
                onOpenChange={onOpenChanged}
            >
                <Tooltip>
                    <PopoverTrigger asChild>
                        <TooltipTrigger asChild>
                            <Button
                                ref={ref}
                                {...props}
                                onClick={handleTogglePopover}
                                class名称={cn(
                                    "flex p-1 rounded-md items-center justify-between bg-inherit h-6",
                                    class名称
                                )}
                            >
                                <div class名称="flex items-center justify-between w-full mx-auto">
                                    <Scan搜索Icon class名称="h-4 w-4 text-muted-foreground mr-1" />
                                    <span
                                        class名称={cn("text-sm text-muted-foreground mx-1 font-medium")}
                                    >
                                        {
                                            selected搜索Scopes.length === 0 ? `All repositories` :
                                                selected搜索Scopes.length === 1 ? selected搜索Scopes[0].name :
                                                    `${selected搜索Scopes.length} selected`
                                        }
                                    </span>
                                    <ChevronDown class名称="h-4 cursor-pointer text-muted-foreground" />
                                </div>
                            </Button>
                        </TooltipTrigger>
                    </PopoverTrigger>
                    <TooltipContent side="bottom" class名称="p-0 border-0 bg-transparent shadow-none">
                        <搜索ScopeInfoCard />
                    </TooltipContent>
                    <PopoverContent
                        class名称="w-[400px] p-0"
                        align="start"
                        onEscapeKeyDown={() => onOpenChanged(false)}
                    >
                        <div class名称="flex flex-col">
                            <div class名称="flex items-center border-b px-3">
                                <Input
                                    placeholder="搜索 scopes..."
                                    value={searchQuery}
                                    onChange={(e) => set搜索Query(e.target.value)}
                                    onKeyDown={handleInputKeyDown}
                                    class名称="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-11"
                                />
                            </div>
                            <div
                                ref={scrollContainerRef}
                                class名称="max-h-[300px] overflow-auto"
                            >
                                {sorted搜索ScopeItems.length === 0 ? (
                                    <div class名称="py-6 text-center text-sm text-muted-foreground">
                                        No results found.
                                    </div>
                                ) : (
                                    <div class名称="p-1">
                                        <div
                                            style={{
                                                height: `${virtualizer.getTotalSize()}px`,
                                                width: '100%',
                                                position: 'relative',
                                            }}
                                        >
                                            {isMounted && virtualizer.getVirtualItems().map((virtualItem) => {
                                                const { item, isSelected } = sorted搜索ScopeItems[virtualItem.index];
                                                const isHighlighted = virtualItem.index === highlightedIndex;
                                                return (
                                                    <div
                                                        key={`${item.type}-${item.value}`}
                                                        onClick={() => toggleItem(item)}
                                                        onMouseEnter={() => setHighlightedIndex(virtualItem.index)}
                                                        class名称={cn(
                                                            "cursor-pointer absolute top-0 left-0 w-full flex items-center px-2 py-1.5 text-sm rounded-sm",
                                                            isHighlighted ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"
                                                        )}
                                                        style={{
                                                            transform: `translateY(${virtualItem.start}px)`,
                                                        }}
                                                    >
                                                        <div
                                                            class名称={cn(
                                                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                                isSelected
                                                                    ? "bg-primary text-primary-foreground"
                                                                    : "opacity-50 [&_svg]:invisible"
                                                            )}
                                                        >
                                                            <CheckIcon class名称="h-4 w-4" />
                                                        </div>
                                                        <div class名称="flex flex-row items-center gap-2 w-full overflow-hidden">
                                                            <搜索ScopeIcon searchScope={item} />
                                                            <p class名称="font-medium truncate-start">{item.name}</p>
                                                            {item.type === 'reposet' && (
                                                                <Badge
                                                                    variant="default"
                                                                    class名称="text-[10px] px-1.5 py-0 h-4 bg-primary text-primary-foreground"
                                                                >
                                                                    {item.repoCount} repo{item.repoCount === 1 ? '' : 's'}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {selected搜索Scopes.length > 0 && (
                                <>
                                    <Separator />
                                    <div
                                        onClick={handleClear}
                                        class名称="flex items-center justify-center px-2 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                                    >
                                        Clear
                                    </div>
                                </>
                            )}
                        </div>
                    </PopoverContent>
                </Tooltip>
            </Popover>
        );
    }
);

搜索ScopeSelector.display名称 = "搜索ScopeSelector";