import type { Metadata } from "next"
import { siteConfig } from "@/lib/site-config"
import { ReadClient } from "./read-client"

export const metadata: Metadata = {
  title: `Read Online | ${siteConfig.name}`,
  description:
    "Read 'The Digital Community Manifesto' online. Complete interactive web version exploring blockchain governance, Hive blockchain, and network states.",
  keywords: [
    "read online",
    "blockchain hive",
    "manifesto",
    "network states",
    "ebook",
    "hive blockchain",
    "blockchain governance",
  ],
  openGraph: {
    title: `Read Online | ${siteConfig.name}`,
    description:
      "Read the Digital Community Manifesto online. Explore blockchain governance and Hive ecosystem.",
    url: `${siteConfig.url}/read`,
    type: "website",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Book Cover",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Read Online | ${siteConfig.name}`,
    description:
      "Read the Digital Community Manifesto about blockchain and Hive governance online",
    images: [siteConfig.ogImage],
  },
  alternates: {
    canonical: `${siteConfig.url}/read`,
  },
}

export default function ReadPage() {
  return <ReadClient />
}
