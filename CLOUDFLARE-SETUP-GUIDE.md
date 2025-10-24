# Guía: Integración con Cloudflare R2 para Archivos de Audio

## 📋 Resumen

Este proyecto está configurado para servir archivos de audio desde **Cloudflare R2** (Object Storage), lo que permite:

- ✅ Servir archivos grandes sin limitaciones de GitHub
- ✅ CDN global para mejor rendimiento
- ✅ Ancho de banda gratuito entre Cloudflare y navegadores
- ✅ Escalabilidad sin costos excesivos

## 🚀 Pasos de Configuración

### Paso 1: Crear cuenta en Cloudflare R2

1. Ve a https://dash.cloudflare.com/
2. Inicia sesión o regístrate (es gratuito)
3. En el sidebar izquierdo, ve a **R2** (Object Storage)
4. Haz clic en **Create bucket**
5. Nombre del bucket: `ebook-manifiesto-audio`
6. Selecciona tu región (ej: North America - WNAM)
7. Haz clic en **Create bucket**

### Paso 2: Configurar Acceso Público

1. En el bucket que creaste, ve a **Settings**
2. Busca **Public access** y haz clic en **Allow access**
3. Confirma haciendo clic en **Allow access** en el diálogo
4. Verás una URL pública como: `https://ebook-manifiesto-audio.r2.dev`

### Paso 3: Obtener Credenciales de API (Opcional)

Solo necesitas esto si vas a subir archivos desde la aplicación.

1. Ve a https://dash.cloudflare.com/profile/api-tokens
2. Copia tu **Account ID** (lo necesitarás)
3. En **API tokens**, haz clic en **Create API Token**
4. Usa el template **Edit Cloudflare Workers** o crea uno personalizado
5. Asegúrate de que tenga permisos para: `Account.R2`
6. Guarda el token

### Paso 4: Subir el Archivo MP3

#### Opción A: Interfaz Web (Recomendado para principiantes)

1. Ve a tu bucket en R2
2. Haz clic en **Upload**
3. Selecciona el archivo: `public/audiobook/TheDigitalCommunityManifesto.MP3`
4. Espera a que se complete (puede tomar unos minutos)

#### Opción B: Wrangler CLI

```bash
# Instalar Wrangler
npm install -g @cloudflare/wrangler

# Configurar autenticación
wrangler login

# Subir archivo
wrangler r2 object put \
  ebook-manifiesto-audio/TheDigitalCommunityManifesto.MP3 \
  --file public/audiobook/TheDigitalCommunityManifesto.MP3 \
  --account-id YOUR_ACCOUNT_ID
```

### Paso 5: Configurar Variables de Entorno

1. Copia el archivo `.env.local.example` a `.env.local`:

   ```bash
   cp .env.local.example .env.local
   ```

2. Edita `.env.local` con tus datos:

   ```env
   NEXT_PUBLIC_AUDIO_URL=https://ebook-manifiesto-audio.r2.dev/TheDigitalCommunityManifesto.MP3
   NEXT_PUBLIC_R2_BUCKET=ebook-manifiesto-audio
   ```

3. Si vas a usar credenciales de API (para subir desde la app):
   ```env
   CLOUDFLARE_ACCOUNT_ID=your_account_id
   CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key_id
   CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_key
   ```

### Paso 6: Verificar la Configuración

```bash
# Iniciar el servidor de desarrollo
npm run dev
# o
pnpm dev

# Visita http://localhost:3000/audiobook
# El reproductor de audio debe cargar correctamente
```

## 📁 Estructura de Archivos Configurados

```
lib/
  cloudflare-config.ts    # Configuración de Cloudflare

.env.local              # Variables de entorno locales (en .gitignore)
.env.local.example      # Ejemplo de configuración

components/
  audio-player.tsx      # Componente que usa el audio de Cloudflare

hooks/
  useAudioPlayer.ts     # Hook que maneja la reproducción
```

## 🔒 Seguridad

- ✅ `.env.local` está en `.gitignore` - nunca se sube a GitHub
- ✅ `.env.local.example` muestra la estructura (sin valores reales)
- ✅ Las credenciales de API solo se usan en el servidor
- ✅ La URL pública del audio está disponible como variable de entorno

## 💰 Costos

| Concepto             | Precio                   |
| -------------------- | ------------------------ |
| Almacenamiento       | $0.015/GB/mes            |
| Salida de datos      | $0.02/GB (primeros 10TB) |
| Subida de datos      | Gratuito                 |
| Para un MP3 de 363MB | ~$5.45/mes               |

Nota: Cloudflare ofrece descuentos en volumen.

## 🐛 Solucionar Problemas

### El audio no carga

1. Verifica que la URL en `.env.local` sea correcta
2. Asegúrate de que el archivo esté en el bucket de R2
3. Verifica que el acceso público esté habilitado en el bucket
4. Abre la consola del navegador (F12) y mira los errores

### Error CORS

Cloudflare R2 debería manejar CORS correctamente, pero si tienes problemas:

1. Ve a tu bucket en R2
2. En **Settings**, busca **CORS**
3. Configura los orígenes permitidos:
   ```json
   [
     {
       "allowedOrigins": ["http://localhost:3000", "https://tudominio.com"],
       "allowedMethods": ["GET", "HEAD"],
       "allowedHeaders": ["Content-Type"]
     }
   ]
   ```

### Velocidad lenta de carga

- Cloudflare R2 tiene un CDN global - debería ser rápido
- Si es lento, comprueba tu conexión a internet
- Intenta descargar el archivo directamente desde el navegador

## 🔗 Recursos Útiles

- [Documentación de Cloudflare R2](https://developers.cloudflare.com/r2/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [Precios de Cloudflare R2](https://www.cloudflare.com/products/r2/pricing/)

## 📝 Notas

- El archivo MP3 está igualmente disponible en `public/audiobook/` para desarrollo local
- La URL de Cloudflare se usa en producción
- Puedes cambiar fácilmente entre local y producción editando `.env.local`
