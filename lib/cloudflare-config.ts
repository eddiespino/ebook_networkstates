// lib/cloudflare-config.ts
/**
 * Configuración de Cloudflare R2 para servir archivos de audio
 *
 * Variables de entorno necesarias en .env.local:
 * - NEXT_PUBLIC_AUDIO_URL: URL pública del archivo MP3 en Cloudflare R2
 */

export interface CloudflareConfig {
  readonly audioUrl: string;
  readonly audioFileName: string;
  readonly audioType: "audio/mpeg" | "audio/wav" | "audio/ogg";
  readonly cdnBaseUrl: string;
}

const AUDIO_FILE_NAME = "TheDigitalCommunityManifesto.MP3";
const BUCKET_NAME =
  process.env.NEXT_PUBLIC_R2_BUCKET || "ebook-manifiesto-audio";
const CDN_BASE_URL = `https://${BUCKET_NAME}.r2.dev`;
const AUDIO_URL =
  process.env.NEXT_PUBLIC_AUDIO_URL || `${CDN_BASE_URL}/${AUDIO_FILE_NAME}`;

export const cloudflareConfig: CloudflareConfig = {
  audioUrl: AUDIO_URL,
  audioFileName: AUDIO_FILE_NAME,
  audioType: "audio/mpeg",
  cdnBaseUrl: CDN_BASE_URL,
};

/**
 * Obtiene la URL del archivo de audio desde Cloudflare R2
 */
export const getAudioUrl = (): string => cloudflareConfig.audioUrl;

/**
 * Obtiene la URL completa del archivo dentro del bucket de R2
 */
export const getCloudflareAudioUrl = (
  fileName: string = AUDIO_FILE_NAME
): string => {
  return `${cloudflareConfig.cdnBaseUrl}/${fileName}`;
};

/**
 * Valida que la URL de audio sea accesible
 */
export const validateAudioUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch (error) {
    console.error("Error validating audio URL:", error);
    return false;
  }
};
