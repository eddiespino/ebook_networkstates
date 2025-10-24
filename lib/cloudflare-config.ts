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

const AUDIO_FILE_NAME = "ebook.MP3";
const BUCKET_NAME =
  process.env.NEXT_PUBLIC_R2_BUCKET || "ebook-manifiesto-audio";
const CDN_BASE_URL = `https://${BUCKET_NAME}.r2.dev`;

/**
 * Devuelve true si la URL es absoluta (http/https)
 */
const isAbsoluteHttpUrl = (value: string): boolean =>
  /^https?:\/\//i.test(value);

/**
 * Normaliza la URL del audio para evitar rutas relativas que dependan de la ruta actual
 * - Si es absoluta (http/https): se usa tal cual
 * - Si es relativa (con o sin "/"): se asume como nombre de archivo en el CDN de R2
 * - Si está vacía: usa el nombre de archivo por defecto en el CDN
 */
const normalizeAudioUrl = (value?: string | null): string => {
  const raw = (value ?? "").trim();
  if (raw && isAbsoluteHttpUrl(raw)) return raw;

  // Quitar leading slash si viene como "/archivo.mp3"
  const clean = raw.replace(/^\/+/, "");
  const file = clean.length > 0 ? clean : AUDIO_FILE_NAME;
  return `${CDN_BASE_URL}/${file}`;
};

const AUDIO_URL = normalizeAudioUrl(process.env.NEXT_PUBLIC_AUDIO_URL);

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
