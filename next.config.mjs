/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Suprimir warnings de hidratación causados por extensiones del navegador
  reactStrictMode: true,
  // Optimización de headers para audio y assets
  async headers() {
    return [
      {
        source: "/audiobook/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Accept-Ranges",
            value: "bytes",
          },
        ],
      },
      {
        source: "/:path*.mp3",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Content-Type",
            value: "audio/mpeg",
          },
        ],
      },
      {
        source: "/:path*.pdf",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  // Redirecciones para evitar 404 si algún cliente intenta cargar el MP3 como ruta relativa
  // (por ejemplo, /audiobook/TheDigitalCommunityManifesto.MP3)
  async rewrites() {
    const audioUrl =
      process.env.NEXT_PUBLIC_AUDIO_URL ||
      "https://ebook.tcmd-spkcc.com/ebook/ebook.mp3";

    return [
      {
        source: "/audiobook/:path*.mp3",
        destination: audioUrl,
      },
      {
        source: "/audiobook/:path*.MP3",
        destination: audioUrl,
      },
    ];
  },
};

export default nextConfig;
