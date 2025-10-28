// This file contains JSON-LD schemas for structured SEO
// Should be imported in app/layout.tsx

import { siteConfig } from "./site-config";

export const getBookSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Book",
  "@id": `${siteConfig.url}#book`,
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  image: siteConfig.ogImage,
  inLanguage: "en",
  keywords:
    "blockchain hive, hive blockchain, blockchain governance, network states, digital community",
  author: siteConfig.authors.map((author) => ({
    "@type": "Person",
    name: author.name,
  })),
  publisher: {
    "@type": "Organization",
    name: siteConfig.creator,
  },
  datePublished: "2024-01-01",
  potentialAction: {
    "@type": "ReadAction",
  },
});

export const getOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteConfig.url}#organization`,
  name: siteConfig.creator,
  url: siteConfig.url,
  description:
    "A community focused on blockchain governance, Hive blockchain, and network states.",
  sameAs: siteConfig.twitter.site
    ? [`https://twitter.com/${siteConfig.twitter.site}`]
    : [],
});

export const getWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteConfig.url}#website`,
  url: siteConfig.url,
  name: siteConfig.name,
  description: siteConfig.description,
  inLanguage: "en",
  keywords:
    "blockchain hive, hive blockchain, blockchain governance, network states",
  publisher: {
    "@id": `${siteConfig.url}#organization`,
  },
});

export const getAudiobookSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Audiobook",
  "@id": `${siteConfig.url}/audiobook#audiobook`,
  name: `${siteConfig.name} - Audiobook`,
  description:
    "Listen to the audiobook version of The Digital Community Manifesto with professional narration. Explore blockchain governance, Hive blockchain, and network states.",
  url: `${siteConfig.url}/audiobook`,
  image: siteConfig.ogImage,
  inLanguage: "en",
  keywords:
    "blockchain hive, audiobook, manifesto, network states, hive blockchain",
  author: siteConfig.authors.map((author) => ({
    "@type": "Person",
    name: author.name,
  })),
  readBy: {
    "@type": "Person",
    name: "Professional Narrator",
  },
});

export const getBreadcrumbSchema = (page: "home" | "audiobook" | "read") => {
  const breadcrumbs: Record<string, Array<{ name: string; url: string }>> = {
    home: [{ name: "Home", url: siteConfig.url }],
    audiobook: [
      { name: "Home", url: siteConfig.url },
      { name: "Audiobook", url: `${siteConfig.url}/audiobook` },
    ],
    read: [
      { name: "Home", url: siteConfig.url },
      { name: "Read", url: `${siteConfig.url}/read` },
    ],
  };

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs[page].map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
};

export const getWebPageSchema = (
  title: string,
  description: string,
  url: string
) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${url}#webpage`,
  url: url,
  name: title,
  description: description,
  isPartOf: {
    "@id": `${siteConfig.url}#website`,
  },
  publisher: {
    "@id": `${siteConfig.url}#organization`,
  },
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
});
