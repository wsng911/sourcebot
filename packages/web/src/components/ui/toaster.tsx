"use client"

import { useToast } from "@/components/hooks/use-toast"
import {
  Toast,
  Toast关闭,
  Toast描述,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div class名称="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <Toast描述>{description}</Toast描述>
              )}
            </div>
            {action}
            <Toast关闭 />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
