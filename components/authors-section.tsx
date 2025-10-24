'use client'

import { Card } from "@/components/ui/card"
import Image from "next/image"

interface Author {
    readonly name: string
    readonly handle: string
    readonly description: string
    readonly avatarUrl: string
    readonly role: string
    readonly twitterHandle: string
}

const authors: readonly Author[] = [
    {
        name: "Dan",
        handle: "@theycallmedan",
        role: "Blockchain Pioneer & Community Builder",
        description:
            "As a key contributor to the Hive Blockchain, Dan helped shape one of the world's most resilient and self-sustaining digital communities. Drawing from years of experience at the intersection of technology, governance, and community design, he explores how digital societies can evolve beyond traditional structures.",
        avatarUrl: "https://images.hive.blog/u/theycallmedan/avatar",
        twitterHandle: "theycallmedan",
    },
    {
        name: "Starkerz",
        handle: "@starkerz",
        role: "Blockchain Pioneer & Ecosystem Designer",
        description:
            "A pioneer in building open, community-driven blockchain ecosystems, Starkerz is a key contributor to the Hive Blockchain who helped shape one of the world's most resilient and self-sustaining digital communities. With years of experience at the intersection of technology, governance, and community design, they explore how digital societies can evolve beyond traditional structures.",
        avatarUrl: "https://images.hive.blog/u/starkerz/avatar",
        twitterHandle: "starkerz",
    },
]

export function AuthorsSection() {
    return (
        <section id="authors" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12 sm:mb-16 space-y-4">
                    <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-xs sm:text-sm font-mono text-primary border border-primary/20 backdrop-blur-sm">
                        Meet the Authors
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                        Pioneers of Decentralized Communities
                    </h2>
                    <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed">
                        @theycallmedan and @starkerz are pioneers in building open, community-driven blockchain ecosystems. As key
                        contributors to the Hive Blockchain, they helped shape one of the world's most resilient and
                        self-sustaining digital communities — a real-world example of decentralized innovation in action.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
                    {authors.map((author, index) => (
                        <Card
                            key={author.handle}
                            className="p-6 sm:p-8 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card/50 backdrop-blur-sm overflow-hidden group"
                        >
                            <div className="space-y-6">
                                {/* Avatar Section */}
                                <div className="flex items-start justify-between">
                                    <div className="space-y-3">
                                        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 group-hover:border-primary/50 transition-colors">
                                            <Image
                                                src={author.avatarUrl}
                                                alt={author.name}
                                                fill
                                                className="object-cover"
                                                sizes="64px"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-xl sm:text-2xl font-bold">{author.name}</h3>
                                            <p className="text-sm text-primary font-mono">{author.handle}</p>
                                            <p className="text-xs sm:text-sm text-muted-foreground mt-1">{author.role}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                                    {author.description}
                                </p>

                                {/* Divider */}
                                <div className="w-12 h-1 bg-linear-to-r from-primary to-transparent rounded-full" />

                                {/* Social Links */}
                                <div className="flex gap-3" suppressHydrationWarning>
                                    <a
                                        href={`https://hive.blog/@${author.handle.replace("@", "")}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`${author.name} on Hive`}
                                        className="p-2 rounded-lg bg-white hover:bg-gray-100 transition-colors group/link border border-gray-200"
                                        suppressHydrationWarning
                                    >
                                        <Image
                                            src="/hive.svg"
                                            alt="Hive"
                                            width={16}
                                            height={16}
                                            className="w-4 h-4"
                                        />
                                    </a>
                                    <a
                                        href={`https://x.com/${author.twitterHandle}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`${author.name} on X`}
                                        className="p-2 rounded-lg bg-white hover:bg-gray-100 transition-colors group/link border border-gray-200"
                                        suppressHydrationWarning
                                    >
                                        <Image
                                            src="/x.svg"
                                            alt="X"
                                            width={16}
                                            height={16}
                                            className="w-4 h-4"
                                        />
                                    </a>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Mission Statement */}
                <Card className="p-6 sm:p-8 border-primary/20 bg-primary/5 backdrop-blur-sm">
                    <div className="space-y-4">
                        <h3 className="text-xl sm:text-2xl font-bold">Their Mission</h3>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                            Drawing from years of experience at the intersection of technology, governance, and community design,
                            they explore how digital societies can evolve beyond traditional structures. Their mission is to inspire a
                            new generation of builders to create transparent, user-owned systems that unlock collaboration, creativity,
                            and innovation on a global scale.
                        </p>
                    </div>
                </Card>
            </div>
        </section>
    )
}
