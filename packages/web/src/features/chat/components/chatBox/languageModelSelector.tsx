'use client';

import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { LanguageModelInfo } from "@/features/chat/types";
import { cn } from "@/lib/utils";
import {
    Bot,
    CheckIcon,
    ChevronDown,
} from "lucide-react";
import { useMemo, useState } from "react";
import { ModelProviderLogo } from "./modelProviderLogo";
import { getLanguageModelKey } from "../../utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { LanguageModelInfoCard } from "./languageModelInfoCard";

interface LanguageModelSelectorProps {
    languageModels: LanguageModelInfo[];
    selectedModel?: LanguageModelInfo;
    onSelectedModelChange: (model: LanguageModelInfo) => void;
    class名称?: string;
}

export const LanguageModelSelector = ({
    languageModels: _languageModels,
    selectedModel,
    onSelectedModelChange,
    class名称,
}: LanguageModelSelectorProps) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const handleInputKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (event.key === "Enter") {
            setIsPopoverOpen(true);
        }
    };

    const selectModel = (model: LanguageModelInfo) => {
        onSelectedModelChange(model);
        setIsPopoverOpen(false);
    };

    const handleTogglePopover = () => {
        setIsPopoverOpen((prev) => !prev);
    };

    // De-duplicate models
    const languageModels = useMemo(() => {
        return _languageModels.filter((model, selfIndex, selfArray) =>
            selfIndex === selfArray.findIndex((t) => getLanguageModelKey(t) === getLanguageModelKey(model))
        );
    }, [_languageModels]);

    return (
        <Popover
            open={isPopoverOpen}
            onOpenChange={setIsPopoverOpen}
        >
            <Tooltip>
                <PopoverTrigger asChild>
                    <TooltipTrigger asChild>
                        <Button
                            onClick={handleTogglePopover}
                            class名称={cn(
                                "flex p-1 rounded-md items-center justify-between bg-inherit h-6",
                                class名称
                            )}
                        >
                            <div class名称="flex items-center justify-between mx-auto max-w-64 overflow-hidden">
                                {selectedModel ? (
                                    <ModelProviderLogo
                                        provider={selectedModel.provider}
                                        class名称="mr-1"
                                    />
                                ) : (
                                    <Bot class名称="h-4 w-4 text-muted-foreground mr-1" />
                                )}
                                <span
                                    class名称={cn(
                                        "text-sm text-muted-foreground mx-1 text-ellipsis overflow-hidden whitespace-nowrap font-medium",
                                    )}
                                >
                                    {selectedModel ? (selectedModel.display名称 ?? selectedModel.model) : "Select model"}
                                </span>
                                <ChevronDown class名称="h-4 cursor-pointer text-muted-foreground" />
                            </div>
                        </Button>
                    </TooltipTrigger>
                </PopoverTrigger>
                <TooltipContent side="bottom" class名称="p-0 border-0 bg-transparent shadow-none">
                    <LanguageModelInfoCard />
                </TooltipContent>
                <PopoverContent
                    class名称="w-auto p-0"
                    align="start"
                    onEscapeKeyDown={() => setIsPopoverOpen(false)}
                >
                    <Command>
                        <CommandInput
                            placeholder="搜索 models..."
                            onKeyDown={handleInputKeyDown}
                        />
                        <CommandList>
                            <CommandEmpty>
                                <p>No models found.</p>
                            </CommandEmpty>
                            <CommandGroup>
                                {languageModels
                                    .map((model) => {
                                        const isSelected = selectedModel && getLanguageModelKey(selectedModel) === getLanguageModelKey(model);
                                        return (
                                            <CommandItem
                                                key={getLanguageModelKey(model)}
                                                onSelect={() => {
                                                    selectModel(model)
                                                }}
                                                class名称="cursor-pointer"
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
                                                <ModelProviderLogo
                                                    provider={model.provider}
                                                    class名称="mr-2"
                                                />
                                                <span>{model.display名称 ?? model.model}</span>
                                            </CommandItem>
                                        );
                                    })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Tooltip>
        </Popover>
    );
};
