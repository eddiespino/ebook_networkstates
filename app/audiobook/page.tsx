import type { Metadata } from "next"
import { siteConfig } from "@/lib/site-config"
import { AudiobookClient } from "./audiobook-client"

export const metadata: Metadata = {
    title: `Audiobook | ${siteConfig.name}`,
    description:
        "Listen to the audiobook of 'The Digital Community Manifesto.' Immersive audio experience with professional narration and 25 chapters on blockchain governance and network states.",
    keywords: [
        "audiobook",
        "blockchain hive",
        "manifesto",
        "network states",
        "web3",
        "crpyto",
        "hive blockchain",
        "governance",
    ],
    openGraph: {
        title: `Audiobook | ${siteConfig.name}`,
        description:
            "Listen to the Digital Community Manifesto audiobook. 25 chapters on blockchain governance, Hive, and network states.",
        url: `${siteConfig.url}/audiobook`,
        type: "website",
        images: [
            {
                url: siteConfig.ogImage,
                width: 1200,
                height: 630,
                alt: "Audiobook Cover",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: `Audiobook | ${siteConfig.name}`,
        description:
            "Listen to the Digital Community Manifesto audiobook about blockchain and Hive governance",
        images: [siteConfig.ogImage],
    },
    alternates: {
        canonical: `${siteConfig.url}/audiobook`,
    },
}

export default function AudiobookPage() {
    return <AudiobookClient />
}
