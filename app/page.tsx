import type { Metadata } from "next"
import { siteConfig } from "@/lib/site-config"
import { BookHero } from "@/components/book-hero"
import { BookReader } from "@/components/book-reader"
import { BookDetails } from "@/components/book-details"
import { AuthorsSection } from "@/components/authors-section"

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  openGraph: {
    type: "website",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <BookHero />
      <BookDetails />
      <AuthorsSection />
      <BookReader />
    </main>
  )
}
