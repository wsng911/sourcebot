import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva("grid gap-0.5 rounded-lg border px-2.5 py-2 text-left text-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4 w-full relative group/alert", {
  variants: {
    variant: {
      default: "bg-card text-card-foreground",
      destructive: "text-destructive bg-card *:data-[slot=alert-description]:text-destructive/90 *:[svg]:text-current",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

function Alert({
  class名称,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      class名称={cn(alertVariants({ variant }), class名称)}
      {...props}
    />
  )
}

function AlertTitle({ class名称, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      class名称={cn(
        "font-medium group-has-[>svg]/alert:col-start-2 [&_a]:hover:text-foreground [&_a]:underline [&_a]:underline-offset-3",
        class名称
      )}
      {...props}
    />
  )
}

function Alert描述({
  class名称,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      class名称={cn(
        "text-muted-foreground text-sm text-balance md:text-pretty group-has-[>svg]/alert:col-start-2 [&_p:not(:last-child)]:mb-4 [&_a]:hover:text-foreground [&_a]:underline [&_a]:underline-offset-3",
        class名称
      )}
      {...props}
    />
  )
}

function AlertAction({ class名称, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      class名称={cn("absolute top-2 right-2", class名称)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, Alert描述, AlertAction }
