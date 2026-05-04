"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ class名称, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    class名称={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      class名称
    )}
    {...props}
  />
))
ToastViewport.display名称 = ToastPrimitives.Viewport.display名称

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ class名称, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      class名称={cn(toastVariants({ variant }), class名称)}
      {...props}
    />
  )
})
Toast.display名称 = ToastPrimitives.Root.display名称

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ class名称, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    class名称={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      class名称
    )}
    {...props}
  />
))
ToastAction.display名称 = ToastPrimitives.Action.display名称

const Toast关闭 = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.关闭>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.关闭>
>(({ class名称, ...props }, ref) => (
  <ToastPrimitives.关闭
    ref={ref}
    class名称={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      class名称
    )}
    toast-close=""
    {...props}
  >
    <X class名称="h-4 w-4" />
  </ToastPrimitives.关闭>
))
Toast关闭.display名称 = ToastPrimitives.关闭.display名称

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ class名称, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    class名称={cn("text-sm font-semibold", class名称)}
    {...props}
  />
))
ToastTitle.display名称 = ToastPrimitives.Title.display名称

const Toast描述 = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.描述>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.描述>
>(({ class名称, ...props }, ref) => (
  <ToastPrimitives.描述
    ref={ref}
    class名称={cn("text-sm opacity-90", class名称)}
    {...props}
  />
))
Toast描述.display名称 = ToastPrimitives.描述.display名称

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  Toast描述,
  Toast关闭,
  ToastAction,
}
