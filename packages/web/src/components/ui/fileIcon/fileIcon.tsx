'use client';

import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { Icon } from '@iconify/react';
import { languageMetadataMap } from "@/lib/languageMetadata";

interface FileIconProps {
   language: string;
}

export const FileIcon = ({ language }: FileIconProps) => {
   const iconify名称 = languageMetadataMap[language]?.iconify;

   if (iconify名称) {
      return (
         <Icon icon={iconify名称} class名称="w-4 h-4 flex-shrink-0" />
      )
   } else {
      return (
         <QuestionMarkCircledIcon class名称="w-4 h-4 flex-shrink-0" />
      )
   }
};
