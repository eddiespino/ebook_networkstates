/**
 * EJEMPLOS: Sistema Centralizado de Toasts
 *
 * Este archivo muestra todos los casos de uso del servicio de toasts
 * sin necesidad de contexto React
 */

import {
  showSuccessToast,
  showErrorToast,
  showWarningToast,
  showInfoToast,
  showLoadingToast,
} from "@/lib/toast-service";

/**
 * ✅ CASO 1: Notificación de Éxito
 * Usa en: Guardado exitoso, acción completada, etc.
 */
export function exampleSuccess(): void {
  showSuccessToast(
    "Guardado exitosamente",
    "Los cambios se han guardado en la base de datos"
  );
}

/**
 * ❌ CASO 2: Notificación de Error
 * Usa en: Fallos en carga de recursos, errores de API, etc.
 */
export function exampleError(): void {
  showErrorToast(
    "Error al cargar el PDF",
    "Verifica tu conexión a internet o intenta más tarde"
  );
}

/**
 * ⚠️ CASO 3: Notificación de Advertencia
 * Usa en: Acciones que requieren atención, procesos estallados, etc.
 */
export function exampleWarning(): void {
  showWarningToast(
    "Buffering en progreso",
    "Descargando contenido de audio..."
  );
}

/**
 * ℹ️ CASO 4: Notificación Informativa
 * Usa en: Información general, cambios de estado, etc.
 */
export function exampleInfo(): void {
  showInfoToast("Progreso de lectura", "Has alcanzado el 50% del libro");
}

/**
 * 🔄 CASO 5: Notificación de Carga (sin tiempo límite)
 * Usa en: Procesos que tardan tiempo, carga de documentos, etc.
 */
export function exampleLoading(): void {
  showLoadingToast(
    "Procesando...",
    "Por favor espera mientras se carga el contenido"
  );
}

/**
 * ============================================
 * CASOS DE USO EN CONTEXTO REAL
 * ============================================
 */

/**
 * Caso: Manejo de Error en Hook de Audio
 */
export function audioPlayerErrorExample(): void {
  const handleAudioError = (error: Event): void => {
    console.error("Error playing audio:", error);
    showErrorToast(
      "Error de reproducción",
      "No pudimos cargar el archivo de audio"
    );
  };

  // Usar en evento de error del audio element
  // audio.addEventListener('error', handleAudioError);
}

/**
 * Caso: Detección de Buffering
 */
export function audioBufferingExample(): void {
  const handleAudioStalled = (): void => {
    console.warn("Audio stalled - buffering");
    showWarningToast("Buffering...", "Descargando contenido de audio");
  };

  // Usar en evento de stalled del audio element
  // audio.addEventListener('stalled', handleAudioStalled);
}

/**
 * Caso: Error en Carga de PDF
 */
export function pdfLoadErrorExample(): void {
  const handlePdfError = (error: Error): void => {
    console.error("PDF load error:", error.message);
    showErrorToast(
      "Error al cargar el PDF",
      `${error.message || "Verifica tu conexión a internet"}`
    );
  };

  // Usar en onLoadError del componente Document
  // <Document onLoadError={handlePdfError} />
}

/**
 * Caso: Validación de Formulario
 */
export function formValidationExample(isValid: boolean): void {
  if (!isValid) {
    showErrorToast(
      "Formulario inválido",
      "Por favor completa todos los campos requeridos"
    );
  } else {
    showSuccessToast(
      "Validación exitosa",
      "El formulario está listo para enviar"
    );
  }
}

/**
 * Caso: Descarga de Archivo
 */
export function downloadFileExample(fileName: string): void {
  showInfoToast("Descargando archivo...", `${fileName} está siendo descargado`);

  // Simular descarga completada después de 2 segundos
  setTimeout(() => {
    showSuccessToast(
      "Descarga completada",
      `${fileName} se ha descargado exitosamente`
    );
  }, 2000);
}

/**
 * Caso: Operación de Larga Duración
 */
export async function longOperationExample(): Promise<void> {
  showLoadingToast(
    "Procesando...",
    "Esta operación puede tardar unos momentos"
  );

  try {
    // Simular operación asincrónica
    await new Promise((resolve) => setTimeout(resolve, 3000));

    showSuccessToast(
      "Procesamiento completado",
      "La operación finalizó correctamente"
    );
  } catch (error) {
    showErrorToast(
      "Error en la operación",
      "Ocurrió un error durante el procesamiento"
    );
  }
}

/**
 * Caso: Cambio de Preferencias
 */
export function settingsChangeExample(setting: string, value: string): void {
  showInfoToast("Preferencia actualizada", `${setting} ahora es: ${value}`);

  // Guardar en backend
  setTimeout(() => {
    showSuccessToast(
      "Guardado en el servidor",
      "Tus cambios se han sincronizado"
    );
  }, 1000);
}

/**
 * ============================================
 * PATRONES AVANZADOS
 * ============================================
 */

/**
 * Patrón: Validación con Reintento
 */
export async function validationWithRetryExample(
  retries: number = 3
): Promise<boolean> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      showInfoToast(
        `Intento ${attempt} de ${retries}`,
        "Validando información..."
      );

      // Simular validación
      const success = Math.random() > 0.3;
      if (success) {
        showSuccessToast(
          "Validación exitosa",
          "Datos verificados correctamente"
        );
        return true;
      }
    } catch {
      if (attempt === retries) {
        showErrorToast(
          "Fallo en la validación",
          `No se pudo validar después de ${retries} intentos`
        );
        return false;
      }
    }

    // Esperar antes de reintentar
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return false;
}

/**
 * Patrón: Cadena de Operaciones
 */
export async function operationChainExample(): Promise<void> {
  try {
    // Paso 1
    showLoadingToast("Paso 1/3", "Descargando datos...");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Paso 2
    showInfoToast("Paso 2/3", "Procesando datos...");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Paso 3
    showInfoToast("Paso 3/3", "Guardando cambios...");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    showSuccessToast(
      "Completado",
      "Todos los pasos se ejecutaron correctamente"
    );
  } catch (error) {
    showErrorToast(
      "Operación cancelada",
      "Ocurrió un error durante el proceso"
    );
  }
}
