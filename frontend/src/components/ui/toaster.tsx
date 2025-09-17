// components/ui/toaster.tsx
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  type ToastPosition
} from "@/components/ui/toast"

interface ToasterProps {
  position?: ToastPosition
  duration?: number
}

export function Toaster({ 
  position = "top-right", 
  duration = 5000 
}: ToasterProps) {
  const { toasts } = useToast()

  return (
    <ToastProvider duration={duration}>   {/* 👈 ahora sí se usa */}
      {toasts.map(function ({ 
        id, 
        title, 
        description, 
        action, 
        variant, 
        size, 
        icon, 
        showIcon,
        className,
        ...props 
      }) {
        return (
          <Toast 
            key={id} 
            variant={variant}
            size={size}
            icon={icon}
            showIcon={showIcon}
            className={className}
            {...props}
          >
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport position={position} />
    </ToastProvider>
  )
}


// Toasters preconfigurados para diferentes contextos
export function RatingToaster() {
  return <Toaster position="bottom-right" />
}

export function CommentToaster() {
  return <Toaster position="top-right" />
}

export function PhotoToaster() {
  return <Toaster position="bottom-center" />
}