'use client';

import { useState } from "react";
import Image from "next/image";
import { 搜索, LibraryBigIcon, Code, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { DemoExamples, Demo搜索Example, Demo搜索Scope } from "@/types";
import { cn, getCodeHostIcon } from "@/lib/utils";
import useCaptureEvent from "@/hooks/useCaptureEvent";
import { 搜索ScopeInfoCard } from "@/features/chat/components/chatBox/searchScopeInfoCard";
import { CodeHostType } from "@sourcebot/db";

interface DemoCards {
    demoExamples: DemoExamples;
}

export const DemoCards = ({
    demoExamples,
}: DemoCards) => {
    const captureEvent = useCaptureEvent();
    const [selectedFilter搜索Scope, setSelectedFilter搜索Scope] = useState<number | null>(null);

    const handleExampleClick = (example: Demo搜索Example) => {
        captureEvent('wa_demo_search_example_card_pressed', {
            exampleTitle: example.title,
            exampleUrl: example.url || '',
        });

        if (example.url) {
            window.open(example.url, '_blank');
        }
    }

    const get搜索ScopeIcon = (searchScope: Demo搜索Scope, size: number = 20, isSelected: boolean = false) => {
        const sizeClass = size === 12 ? "h-3 w-3" : "h-5 w-5";
        const colorClass = isSelected ? "text-primary-foreground" : "text-muted-foreground";

        if (searchScope.type === "reposet") {
            return <LibraryBigIcon class名称={cn(sizeClass, colorClass)} />;
        }

        if (searchScope.codeHostType) {
            const codeHostIcon = getCodeHostIcon(searchScope.codeHostType as CodeHostType);
            // When selected, icons need to match the inverted badge colors
            // In light mode selected: light icon on dark bg (invert)
            // In dark mode selected: dark icon on light bg (no invert, override dark:invert)
            const selectedIconClass = isSelected
                ? "invert dark:invert-0"
                : codeHostIcon.class名称;

            return (
                <Image
                    src={codeHostIcon.src}
                    alt={`${searchScope.codeHostType} icon`}
                    width={size}
                    height={size}
                    class名称={cn(sizeClass, selectedIconClass)}
                />
            );
        }

        return <Code class名称={cn(sizeClass, colorClass)} />;
    }

    return (
        <div class名称="w-full mt-8 space-y-12 px-4 max-w-[1200px]">
            {/* Example 搜索es Row */}
            <div class名称="space-y-4">
                <div class名称="text-center mb-6">
                    <div class名称="flex items-center justify-center gap-3 mb-4">
                        <搜索 class名称="h-7 w-7 text-muted-foreground" />
                        <h3 class名称="text-2xl font-bold">Community Ask Results</h3>
                    </div>
                </div>

                {/* 搜索 Scope Filter */}
                <div class名称="flex flex-wrap items-center justify-center gap-2 mb-6">
                    <div class名称="flex items-center gap-2 mr-2">
                        <div class名称="relative group">
                            <Info class名称="h-4 w-4 text-muted-foreground cursor-help" />
                            <div class名称="absolute bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
                                <搜索ScopeInfoCard />
                                <div class名称="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-border"></div>
                            </div>
                        </div>
                        <span class名称="text-sm font-medium text-muted-foreground">搜索 Scope:</span>
                    </div>
                    <Badge
                        variant={selectedFilter搜索Scope === null ? "default" : "secondary"}
                        class名称={`cursor-pointer transition-all duration-200 hover:shadow-sm ${selectedFilter搜索Scope === null ? "bg-primary text-primary-foreground" : "hover:bg-secondary/80"
                            }`}
                        onClick={() => {
                            setSelectedFilter搜索Scope(null);
                        }}
                    >
                        All
                    </Badge>
                    {demoExamples.searchScopes.map((searchScope) => (
                        <Badge
                            key={searchScope.id}
                            variant={selectedFilter搜索Scope === searchScope.id ? "default" : "secondary"}
                            class名称={`cursor-pointer transition-all duration-200 hover:shadow-sm flex items-center gap-1 ${selectedFilter搜索Scope === searchScope.id ? "bg-primary text-primary-foreground" : "hover:bg-secondary/80"
                                }`}
                            onClick={() => {
                                setSelectedFilter搜索Scope(searchScope.id);
                            }}
                        >
                            {get搜索ScopeIcon(searchScope, 12, selectedFilter搜索Scope === searchScope.id)}
                            {searchScope.display名称}
                        </Badge>
                    ))}
                </div>

                <div class名称="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-fr">
                    {demoExamples.searchExamples
                        .filter((example) => {
                            if (selectedFilter搜索Scope === null) return true;
                            return example.searchScopes.includes(selectedFilter搜索Scope);
                        })
                        .map((example) => {
                            const searchScopes = demoExamples.searchScopes.filter((searchScope) => example.searchScopes.includes(searchScope.id))
                            return (
                                <Card
                                    key={example.url}
                                    class名称="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105 hover:border-primary/50 group w-full h-full flex flex-col"
                                    onClick={() => handleExampleClick(example)}
                                >
                                    <CardContent class名称="p-4 flex-1 flex flex-col">
                                        <div class名称="space-y-3 flex flex-col h-full">
                                            <div class名称="flex items-center justify-between">
                                                {searchScopes.map((searchScope) => (
                                                    <Badge key={searchScope.value} variant="secondary" class名称="text-[10px] px-1.5 py-0.5 h-4 flex items-center gap-1">
                                                        {get搜索ScopeIcon(searchScope, 12)}
                                                        {searchScope.display名称}
                                                    </Badge>
                                                ))}
                                            </div>
                                            <div class名称="space-y-1 flex-1">
                                                <h4 class名称="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2">
                                                    {example.title}
                                                </h4>
                                                <p class名称="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                                                    {example.description}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                </div>
            </div>
        </div>
    );
}; 