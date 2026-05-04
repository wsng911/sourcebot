"use client"

import { useRouter } from "next/navigation"
import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface TabSwitcherProps {
  tabs: { value: string; label: ReactNode }[]
  currentTab: string
  class名称?: string
}

export function TabSwitcher({ tabs, currentTab, class名称 }: TabSwitcherProps) {
  const router = useRouter()

  const handleTabChange = (value: string) => {
    router.push(`?tab=${value}`, { scroll: false })
  }

  return (
    <TabsList class名称={class名称}>
      {tabs.map((tab) => (
        <LowProfileTabsTrigger
          key={tab.value}
          value={tab.value}
          onClick={() => handleTabChange(tab.value)}
          data-state={currentTab === tab.value ? "active" : ""}
        >
          {tab.label}
        </LowProfileTabsTrigger>
      ))}
    </TabsList>
  )
}

interface LowProfileTabsTrigger {
    value: string
    children: React.ReactNode
    onClick?: () => void
    class名称?: string
  }

  export function LowProfileTabsTrigger({ value, children, onClick, class名称 }: LowProfileTabsTrigger) {
    return (
      <TabsTrigger
        value={value}
        onClick={onClick}
        class名称={cn(
          "relative h-9 rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-normal text-muted-foreground transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:bg-transparent",
          class名称,
        )}
      >
        {children}
      </TabsTrigger>
    )
  }
  
  