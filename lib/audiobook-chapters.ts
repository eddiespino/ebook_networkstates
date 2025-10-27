/**
 * Audiobook Chapters Configuration
 * Datos estructurados de los capítulos del audiolibro
 */

export interface AudioChapter {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly audioUrl: string;
  readonly coverImage: string; // Ruta a la imagen de portada horizontal del capítulo en /public/chapters/ (16:9 ratio) - formato: chapterX.jpg
}

export interface AudiobookData {
  readonly title: string;
  readonly author: string;
  readonly coverImage: string;
  readonly chapters: ReadonlyArray<AudioChapter>;
}

/**
 * Configuración completa del audiolibro
 * Cada capítulo tiene su propio archivo de audio segmentado
 * Las portadas son horizontales (16:9 ratio recomendado)
 */
export const audiobookData: AudiobookData = {
  title: "The Digital Community Manifesto",
  author: "@theycallmedan & @starkerz",
  coverImage: "/book-cover.jpg",
  chapters: [
    {
      id: 1,
      title: "Pre-Word",
      description:
        "The legacy economic system only responds to legitimate parallel competition that treats people better.",
      audioUrl: "https://ebookcdn.tcmd-spkcc.com/chapter1.mp3",
      coverImage: "/chapters/chapter1.jpg",
    },
    {
      id: 2,
      title: "Vision and Implications of Decentralisation for Network States",
      description:
        "A peaceful way to opt out of oppressive legacy economic systems.",
      audioUrl: "https://ebookcdn.tcmd-spkcc.com/chapter2.mp3",
      coverImage: "/chapters/chapter2.jpg",
    },
    {
      id: 3,
      title: "The Underlying Principles",
      description:
        "When it comes to digital freedom, principles matter most, economy is counter-intuitive second.",
      audioUrl: "https://ebookcdn.tcmd-spkcc.com/chapter3.mp3",
      coverImage: "/chapters/chapter3.jpg",
    },
    {
      id: 4,
      title: "The Perfect Storm",
      description:
        "How unique circumstances and freak events led to true decentralization.",
      audioUrl: "https://ebookcdn.tcmd-spkcc.com/chapter4.mp3",
      coverImage: "/chapters/chapter4.jpg",
    },
    {
      id: 5,
      title: "Game Theory of Network Attacks",
      description:
        "Understanding the strategic dynamics of attacks on decentralized networks.",
      audioUrl: "https://ebookcdn.tcmd-spkcc.com/chapter5.mp3",
      coverImage: "/chapters/chapter5.jpg",
    },
    {
      id: 6,
      title: "Attack Vectors",
      description:
        "Identifying potential vulnerabilities and points of failure in blockchain systems.",
      audioUrl: "https://ebookcdn.tcmd-spkcc.com/chapter6.mp3",
      coverImage: "/chapters/chapter6.jpg",
    },
    {
      id: 7,
      title: "Defense Mechanisms",
      description:
        "Strategies and techniques to protect against network attacks and maintain integrity.",
      audioUrl: "https://ebookcdn.tcmd-spkcc.com/chapter7.mp3",
      coverImage: "/chapters/chapter7.jpg",
    },
    {
      id: 8,
      title: "Social Consensus",
      description:
        "The power of community agreement in maintaining decentralized governance.",
      audioUrl: "https://ebookcdn.tcmd-spkcc.com/chapter8.mp3",
      coverImage: "/chapters/chapter8.jpg",
    },
    {
      id: 9,
      title: "Technical Stack for Censorship Resistance",
      description:
        "Building the infrastructure necessary for true freedom of expression.",
      audioUrl: "https://ebookcdn.tcmd-spkcc.com/chapter9.mp3",
      coverImage: "/chapters/chapter9.jpg",
    },
    {
      id: 10,
      title: "Proof of Work vs Delegated Proof of Stake",
      description:
        "Comparing consensus mechanisms and their implications for decentralization.",
      audioUrl: "https://ebookcdn.tcmd-spkcc.com/chapter10.mp3",
      coverImage: "/chapters/chapter10.jpg",
    },
    {
      id: 11,
      title: "The Role of Witnesses",
      description:
        "How block producers maintain network security and community trust.",
      audioUrl: "https://ebookcdn.tcmd-spkcc.com/chapter11.mp3",
      coverImage: "/chapters/chapter11.jpg",
    },
    {
      id: 12,
      title: "Governance Without Central Authority",
      description:
        "Creating effective decision-making processes in decentralized systems.",
      audioUrl: "https://ebookcdn.tcmd-spkcc.com/chapter12.mp3",
      coverImage: "/chapters/chapter12.jpg",
    },
    {
      id: 13,
      title: "Economic Incentives",
      description:
        "Aligning individual interests with network health through tokenomics.",
      audioUrl: "https://ebookcdn.tcmd-spkcc.com/chapter13.mp3",
      coverImage: "/chapters/chapter13.jpg",
    },
    {
      id: 14,
      title: "The Steem Takeover Attempt",
      description:
        "Lessons learned from one of blockchain's most significant governance battles.",
      audioUrl: "https://ebookcdn.tcmd-spkcc.com/chapter14.mp3",
      coverImage: "/chapters/chapter14.jpg",
    },
    {
      id: 15,
      title: "The Birth of Hive",
      description:
        "How community resilience led to the creation of a truly decentralized blockchain.",
      audioUrl: "https://ebookcdn.tcmd-spkcc.com/chapter15.mp3",
      coverImage: "/chapters/chapter15.jpg",
    },
    {
      id: 16,
      title: "Community Resilience",
      description:
        "Building social structures that can withstand external pressures and attacks.",
      audioUrl: "https://ebookcdn.tcmd-spkcc.com/chapter16.mp3",
      coverImage: "/chapters/chapter16.jpg",
    },
    {
      id: 17,
      title: "Digital Rights and Freedom",
      description:
        "Protecting individual liberties in the age of blockchain technology.",
      audioUrl: "https://ebookcdn.tcmd-spkcc.com/chapter17.mp3",
      coverImage: "/chapters/chapter17.jpg",
    },
    {
      id: 18,
      title: "Building Network States",
      description:
        "Practical steps for creating autonomous digital communities and governance.",
      audioUrl: "https://ebookcdn.tcmd-spkcc.com/chapter18.mp3",
      coverImage: "/chapters/chapter18.jpg",
    },
    {
      id: 19,
      title: "The Role of DHF (Decentralized Hive Fund)",
      description:
        "Community-driven funding for development and growth initiatives.",
      audioUrl: "https://ebookcdn.tcmd-spkcc.com/chapter19.mp3",
      coverImage: "/chapters/chapter19.jpg",
    },
    {
      id: 20,
      title: "Layer 2 Solutions and Scalability",
      description:
        "Expanding network capacity while maintaining decentralization principles.",
      audioUrl: "https://ebookcdn.tcmd-spkcc.com/chapter20.mp3",
      coverImage: "/chapters/chapter20.jpg",
    },
    {
      id: 21,
      title: "The Future of Decentralized Social Media",
      description:
        "How blockchain technology is reshaping online communication and content creation.",
      audioUrl: "https://ebookcdn.tcmd-spkcc.com/chapter21.mp3",
      coverImage: "/chapters/chapter21.jpg",
    },
    {
      id: 22,
      title: "Practical Implementation Guide",
      description:
        "Step-by-step approach to building and maintaining decentralized systems.",
      audioUrl: "https://ebookcdn.tcmd-spkcc.com/chapter22.mp3",
      coverImage: "/chapters/chapter22.jpg",
    },
    {
      id: 23,
      title: "Common Pitfalls and How to Avoid Them",
      description:
        "Learning from mistakes to build stronger decentralized communities.",
      audioUrl: "https://ebookcdn.tcmd-spkcc.com/chapter23.mp3",
      coverImage: "/chapters/chapter23.jpg",
    },
    {
      id: 24,
      title: "Conclusion and Call to Action",
      description:
        "Taking the principles forward and building the decentralized future together.",
      audioUrl: "https://ebookcdn.tcmd-spkcc.com/chapter24.mp3",
      coverImage: "/chapters/chapter24.jpg",
    },
    {
      id: 25,
      title: "Epilogue: The Path Forward",
      description:
        "Final reflections on the journey towards true decentralization and digital sovereignty.",
      audioUrl: "https://ebookcdn.tcmd-spkcc.com/chapter25.mp3",
      coverImage: "/chapters/chapter25.jpg",
    },
  ],
} as const;

/**
 * Obtener un capítulo específico por ID
 */
export const getChapterById = (id: number): AudioChapter | undefined => {
  return audiobookData.chapters.find((chapter) => chapter.id === id);
};

/**
 * Obtener el siguiente capítulo
 */
export const getNextChapter = (currentId: number): AudioChapter | undefined => {
  const currentIndex = audiobookData.chapters.findIndex(
    (chapter) => chapter.id === currentId
  );
  if (
    currentIndex === -1 ||
    currentIndex === audiobookData.chapters.length - 1
  ) {
    return undefined;
  }
  return audiobookData.chapters[currentIndex + 1];
};

/**
 * Obtener el capítulo anterior
 */
export const getPreviousChapter = (
  currentId: number
): AudioChapter | undefined => {
  const currentIndex = audiobookData.chapters.findIndex(
    (chapter) => chapter.id === currentId
  );
  if (currentIndex === -1 || currentIndex === 0) {
    return undefined;
  }
  return audiobookData.chapters[currentIndex - 1];
};
