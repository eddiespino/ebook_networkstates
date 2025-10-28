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
  name: "The Digital Community Manifesto | Blockchain Hive",
  shortName: "DCM",
  description:
    "Explore digital rights, blockchain governance, and game theory on Hive blockchain. A manifesto for network states and decentralized communities.",
  url: "https://book.networkstates.online",
  ogImage: "https://book.networkstates.online/og.jpg",
  authors: [
    {
      name: "They Call Me Dan (@TheycallmeDan_)",
      twitter: "@TheycallmeDan_",
    },
    {
      name: "3speaktv (@3speaktv)",
      twitter: "@3speaktv",
    },
  ],
  creator: "@theycallmedan & @starkerz",
  keywords: [
    "blockchain hive",
    "hive blockchain",
    "blockchain governance",
    "network states",
    "digital rights",
    "governance",
    "game theory",
    "decentralization",
    "web3",
    "manifesto",
    "digital community",
    "cryptocurrency",
    "distributed ledger",
    "scalable blockchain",
  ],
  twitter: {
    card: "summary_large_image",
    site: "@TheycallmeDan_",
    creator: "@TheycallmeDan_",
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
