// hooks/use-crud-toast.ts
import { toast } from "@/hooks/use-toast"

export const useCrudToast = () => {
  const showSuccess = (message: string, title = "¡Éxito!") => {
    toast({
      variant: "success",
      title,
      description: message,
      duration: 3000,
    })
  }

  const showError = (message: string, title = "Error") => {
    toast({
      variant: "destructive",
      title,
      description: message,
      duration: 5000,
    })
  }

  const showRatingToast = (rating: number, placeName: string, isUpdate = false) => {
    toast({
      variant: "rating",
      title: isUpdate ? "Calificación actualizada" : "¡Gracias por calificar!",
      description: `Has calificado ${placeName} con ${rating} estrellas`,
      duration: 4000,
      position: "bottom-right"
    })
  }

  const showCommentToast = (action: "create" | "update" | "delete") => {
    const messages = {
      create: { title: "Comentario publicado", description: "Tu comentario ha sido publicado con éxito" },
      update: { title: "Comentario actualizado", description: "Tu comentario ha sido actualizado" },
      delete: { title: "Comentario eliminado", description: "Tu comentario ha sido eliminado" }
    }
    
    toast({
      variant: "comment",
      ...messages[action],
      duration: 3000,
      position: "top-right"
    })
  }

  const showLikeToast = (entity: "comment" | "photo", isLiked: boolean) => {
    const entities = {
      comment: { singular: "comentario", plural: "comentarios" },
      photo: { singular: "foto", plural: "fotos" }
    }
    
    toast({
      variant: "like",
      title: isLiked ? "¡Me gusta!" : "Like removido",
      description: isLiked 
        ? `Te gusta este ${entities[entity].singular}`
        : `Ya no te gusta este ${entities[entity].singular}`,
      duration: 2000,
      position: "bottom-right"
    })
  }

  const showPhotoToast = (action: "upload" | "delete") => {
    const messages = {
      upload: { title: "Foto subida", description: "Tu foto ha sido subida exitosamente" },
      delete: { title: "Foto eliminada", description: "Tu foto ha sido eliminada" }
    }
    
    toast({
      variant: "photo",
      ...messages[action],
      duration: 3000,
      position: "bottom-center"
    })
  }

  return {
    showSuccess,
    showError,
    showRatingToast,
    showCommentToast,
    showLikeToast,
    showPhotoToast
  }
}