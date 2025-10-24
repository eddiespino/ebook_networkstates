# Configuración de Cloudflare para servir archivos de audio

## Pasos para subir el MP3 a Cloudflare

### 1. Crear una cuenta en Cloudflare R2 (Object Storage)

- Ve a https://dash.cloudflare.com/
- Regístrate o inicia sesión
- En el panel, ve a **R2** (almacenamiento de objetos)
- Haz clic en **Create bucket**
- Nombra tu bucket (ej: `ebook-manifiesto-audio`)
- Copia el **Bucket name** y la **Region**

### 2. Obtener credenciales de API

- Ve a **Settings** en R2
- Haz clic en **API tokens** en la parte inferior
- Crea un nuevo **API token**
- Copia:
  - `Account ID`
  - `Access Key ID`
  - `Secret Access Key`

### 3. Subir el archivo MP3

Opción A: Usando la interfaz web de Cloudflare

- En el bucket de R2, haz clic en **Upload**
- Selecciona `public/audiobook/TheDigitalCommunityManifesto.MP3`
- Espera a que se complete la carga

Opción B: Usando Wrangler CLI (recomendado)

```bash
npm install -g wrangler

# Configurar credenciales
wrangler r2 list --account-id YOUR_ACCOUNT_ID

# Subir archivo
wrangler r2 object put ebook-manifiesto-audio/TheDigitalCommunityManifesto.MP3 --file public/audiobook/TheDigitalCommunityManifesto.MP3
```

### 4. Configurar acceso público al bucket

- En **R2 bucket settings**
- Ve a **Settings** → **Public access**
- Haz clic en **Allow access** para permitir lectura pública
- Copia la **Public URL**

### 5. Obtener la URL del archivo

La URL será algo como:

```
https://[bucket-name].r2.dev/TheDigitalCommunityManifesto.MP3
```

O con un dominio personalizado:

```
https://audio.tudominio.com/TheDigitalCommunityManifesto.MP3
```

## Variables de entorno

Crea un archivo `.env.local` con:

```env
NEXT_PUBLIC_AUDIO_URL=https://[bucket-name].r2.dev/TheDigitalCommunityManifesto.MP3
```

## Código de ejemplo en Next.js

```typescript
// lib/audio-config.ts
export const AUDIO_URL =
  process.env.NEXT_PUBLIC_AUDIO_URL ||
  "https://ebook-manifiesto-audio.r2.dev/TheDigitalCommunityManifesto.MP3";

// En tu componente de reproductor de audio
import { AUDIO_URL } from "@/lib/audio-config";

export function AudioPlayer() {
  return (
    <audio controls>
      <source src={AUDIO_URL} type="audio/mpeg" />
      Tu navegador no soporta el elemento de audio.
    </audio>
  );
}
```

## Ventajas de usar Cloudflare R2

✅ **CDN global**: tu archivo se sirve desde servidores cercanos al usuario
✅ **Almacenamiento económico**: precio competitivo
✅ **Ancho de banda gratuito**: entre Cloudflare y el navegador
✅ **Sin límites de archivo**: soporta archivos grandes
✅ **Integración con Cloudflare Workers**: para procesamiento

## Notas de seguridad

- Mantén tus credenciales en `.env.local` (no en git)
- El `.gitignore` ya ignora archivos `.env*`
- Considera usar **Access Rules** en Cloudflare si quieres restringir acceso

## Costos estimados

- Almacenamiento: $0.015 por GB/mes
- Para un MP3 de 363MB: ~$5.45/mes
- Salida de datos: $0.02 por GB (primeros 10TB)
