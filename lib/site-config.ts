/**
 * Site Configuration
 * Central configuration for site-wide settings, URLs, and metadata
 */

export interface SiteConfig {
  readonly name: string;
  readonly shortName: string;
  readonly description: string;
  readonly url: string;
  readonly ogImage: string;
  readonly authors: ReadonlyArray<{
    readonly name: string;
    readonly twitter?: string;
  }>;
  readonly creator: string;
  readonly keywords: readonly string[];
  readonly twitter: {
    readonly card: string;
    readonly site?: string;
    readonly creator: string;
  };
}

export const siteConfig: SiteConfig = {
  name: "The Digital Community Manifesto",
  shortName: "DCM",
  description:
    "Digital Rights, Game Theory, and Governance of Scalable Blockchains for Use in Network States",
  url: "https://book.networkstates.online",
  ogImage: "https://book.networkstates.online/book-cover.jpg",
  authors: [
    {
      name: "NoSpirit (@theycallmedan)",
      twitter: "@theycallmedan",
    },
    {
      name: "Starkerz (@starkerz)",
      twitter: "@starkerz",
    },
  ],
  creator: "@theycallmedan & @starkerz",
  keywords: [
    "blockchain",
    "network states",
    "digital rights",
    "governance",
    "game theory",
    "decentralization",
    "web3",
    "manifesto",
    "digital community",
    "hive",
    "cryptocurrency",
  ],
  twitter: {
    card: "summary_large_image",
    site: "@theycallmedan",
    creator: "@theycallmedan",
  },
} as const;

/**
 * Get absolute URL for a given path
 */
export const getAbsoluteUrl = (path: string = ""): string => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${cleanPath}`;
};

/**
 * Get Open Graph image URL
 */
export const getOgImageUrl = (image?: string): string => {
  return image ? getAbsoluteUrl(image) : siteConfig.ogImage;
};
