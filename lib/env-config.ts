/**
 * Environment Configuration
 * Type-safe access to environment variables
 */

export interface EnvConfig {
  readonly siteUrl: string;
  readonly audioUrl: string;
  readonly r2Bucket: string;
  readonly isDevelopment: boolean;
  readonly isProduction: boolean;
}

const getSiteUrl = (): string => {
  // En producción, usar el dominio configurado
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // En desarrollo, usar localhost
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  // Default a producción
  return "https://book.networkstates.online";
};

export const env: EnvConfig = {
  siteUrl: getSiteUrl(),
  audioUrl:
    process.env.NEXT_PUBLIC_AUDIO_URL ||
    "https://ebook.tcmd-spkcc.com/ebook/ebook.mp3",
  r2Bucket: process.env.NEXT_PUBLIC_R2_BUCKET || "ebook-manifiesto-audio",
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
} as const;

/**
 * Validate that required environment variables are set
 */
export const validateEnv = (): void => {
  if (!env.audioUrl) {
    console.warn("⚠️ NEXT_PUBLIC_AUDIO_URL is not set");
  }

  console.log("✓ Environment configured:", {
    siteUrl: env.siteUrl,
    environment: env.isProduction ? "production" : "development",
  });
};
