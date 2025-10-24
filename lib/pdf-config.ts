/**
 * Configuración centralizada para el PDF del libro
 */

export const PDF_CONFIG = {
  /** Ruta del archivo PDF en la carpeta public */
  filePath: "/book.pdf",

  /** Nombre del archivo para descarga */
  downloadName: "The-Digital-Community-Manifesto.pdf",

  /** Título del libro */
  title: "The Digital Community Manifesto",

  /** Descripción del libro */
  description:
    "Digital Rights, Game Theory, and Governance of Scalable Blockchains for Use in Network States",
} as const;

/**
 * Obtiene la URL completa del PDF
 * @param baseUrl - URL base (opcional, para URLs absolutas)
 * @returns URL del PDF
 */
export function getPdfUrl(baseUrl?: string): string {
  if (baseUrl) {
    return `${baseUrl}${PDF_CONFIG.filePath}`;
  }
  return PDF_CONFIG.filePath;
}

/**
 * Descarga el PDF del libro
 */
export function downloadPdf(): void {
  const link = document.createElement("a");
  link.href = PDF_CONFIG.filePath;
  link.download = PDF_CONFIG.downloadName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Valida si el PDF existe
 * @returns Promise<boolean> - true si el PDF existe
 */
export async function validatePdfExists(): Promise<boolean> {
  try {
    const response = await fetch(PDF_CONFIG.filePath, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
}
