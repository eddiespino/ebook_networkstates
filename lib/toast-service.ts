/**
 * Servicio centralizado de toasts
 * Permite mostrar notificaciones desde cualquier lugar sin depender del contexto
 */

import { toast } from "@/components/ui/use-toast";

// Tipos para consistencia
export enum ToastType {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
  LOADING = "loading",
}

interface ToastMessage {
  title: string;
  description?: string;
  duration?: number;
  type: ToastType;
}

/**
 * Muestra un toast genérico
 */
function showToast({
  title,
  description,
  duration = 3000,
  type,
}: ToastMessage): void {
  // Mapear tipos de toast a variantes de UI
  const variantMap: Record<ToastType, "default" | "destructive"> = {
    [ToastType.SUCCESS]: "default",
    [ToastType.ERROR]: "destructive",
    [ToastType.WARNING]: "destructive",
    [ToastType.INFO]: "default",
    [ToastType.LOADING]: "default",
  };

  toast({
    title,
    description,
    duration,
    variant: variantMap[type],
  });
}

/**
 * Muestra un toast de éxito
 */
export function showSuccessToast(title: string, description?: string): void {
  showToast({ title, description, type: ToastType.SUCCESS, duration: 2000 });
}

/**
 * Muestra un toast de error
 */
export function showErrorToast(title: string, description?: string): void {
  showToast({ title, description, type: ToastType.ERROR, duration: 5000 });
}

/**
 * Muestra un toast de advertencia
 */
export function showWarningToast(title: string, description?: string): void {
  showToast({ title, description, type: ToastType.WARNING, duration: 4000 });
}

/**
 * Muestra un toast informativo
 */
export function showInfoToast(title: string, description?: string): void {
  showToast({ title, description, type: ToastType.INFO, duration: 3000 });
}

/**
 * Muestra un toast de carga/buffering
 */
export function showLoadingToast(title: string, description?: string): void {
  showToast({ title, description, type: ToastType.LOADING, duration: 0 });
}
