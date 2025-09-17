// components/ui/toast.tsx
import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X, CheckCircle, AlertCircle, Info, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Star, MessageCircle, Heart, Camera } from "lucide-react"


const ToastProvider = ToastPrimitives.Provider

// Configuración de posiciones
const toastPositions = {
  "top-right": "top-0 right-0",
  "top-left": "top-0 left-0", 
  "top-center": "top-0 left-1/2 transform -translate-x-1/2",
  "bottom-right": "bottom-0 right-0",
  "bottom-left": "bottom-0 left-0",
  "bottom-center": "bottom-0 left-1/2 transform -translate-x-1/2"
} as const

type ToastPosition = keyof typeof toastPositions

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport> & {
    position?: ToastPosition
  }
>(({ className, position = "top-right", ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed z-[100] flex max-h-screen w-full flex-col p-4 md:max-w-[420px]",
      toastPositions[position],
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

// Sistema de variantes extendido para diferentes operaciones CRUD
const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center space-x-4 overflow-hidden rounded-lg border p-4 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        // Variantes base
        default: "bg-white border-gray-200 text-gray-900",
        destructive: "bg-red-50 border-red-200 text-red-900",
        
        // Variantes para operaciones CRUD
        success: "bg-green-50 border-green-200 text-green-900",
        warning: "bg-amber-50 border-amber-200 text-amber-900",
        info: "bg-blue-50 border-blue-200 text-blue-900",
        
        // Variantes específicas para módulos
        rating: "bg-purple-50 border-purple-200 text-purple-900",
        comment: "bg-indigo-50 border-indigo-200 text-indigo-900",
        like: "bg-pink-50 border-pink-200 text-pink-900",
        photo: "bg-cyan-50 border-cyan-200 text-cyan-900"
      },
      size: {
        default: "p-4",
        sm: "p-3",
        lg: "p-6"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    },
  }
)

// Iconos para cada variante
const variantIcons = {
  default: null,
  destructive: <XCircle className="h-5 w-5 text-red-500" />,
  success: <CheckCircle className="h-5 w-5 text-green-500" />,
  warning: <AlertCircle className="h-5 w-5 text-amber-500" />,
  info: <Info className="h-5 w-5 text-blue-500" />,
rating: <Star className="h-5 w-5 text-purple-500" />, //Necesitarás import Star
  comment: <MessageCircle className="h-5 w-5 text-indigo-500" />, //Necesitarás import MessageCircle
  like: <Heart className="h-5 w-5 text-pink-500" />, //Necesitarás import Heart
  photo: <Camera className="h-5 w-5 text-cyan-500" /> //Necesitarás import Camera
}

interface ToastProps extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root>,
  VariantProps<typeof toastVariants> {
  icon?: React.ReactNode
  showIcon?: boolean
}

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  ToastProps
>(({ className, variant, size, icon, showIcon = true, children, ...props }, ref) => {
  const displayIcon = showIcon ? (icon || variantIcons[variant || "default"]) : null

  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant, size }), className)}
      {...props}
    >
      {displayIcon && (
        <div className="flex-shrink-0">
          {displayIcon}
        </div>
      )}
      <div className="flex-1">
        {children}
      </div>
    </ToastPrimitives.Root>
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 opacity-0 transition-opacity hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

export {
  type ToastProps,
  type ToastPosition,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}