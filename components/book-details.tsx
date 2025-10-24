import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Shield, Users, Coins, Lock } from "lucide-react"

export function BookDetails() {
  const features = [
    {
      title: "No Pre-Mines, No ICOs",
      description: "Learn why fair token distribution is essential for true decentralization",
      icon: Coins,
    },
    {
      title: "Censorship Resistance",
      description: "Understand the technical and social mechanisms that protect free speech",
      icon: Shield,
    },
    {
      title: "Network States",
      description: "Discover how digital communities can evolve into self-sovereign entities",
      icon: Users,
    },
    {
      title: "Regenerative Economies",
      description: "Design token systems that nurture lasting social value.",
      icon: Lock,
    },
  ]

  return (
    <section id="about" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16 space-y-4">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-xs sm:text-sm font-mono text-primary border border-primary/20 backdrop-blur-sm">
            What You'll Learn
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Build the Future of Communities
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed">
            This book provides a battle-tested framework for building and defending decentralized communities that truly
            serve their members.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                className="p-6 sm:p-8 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card/50 backdrop-blur-sm group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg sm:text-xl font-semibold">{feature.title}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        <Separator className="my-12 sm:my-16" />

        <div className="prose prose-lg dark:prose-invert max-w-4xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-bold mb-6">About This Book</h3>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Imagine a community that runs its own economy, speaks freely without censorship, and builds systems no government or corporation can control.
              <strong>The Digital Community Manifesto</strong> is your guide to making that vision real.
            </p>
            <p>
              This isn’t about hype coins or trading schemes. It’s about creating digital spaces that are free, transparent, and owned by the people who use them.
              Written by the builders behind one of the only truly decentralized social blockchains, this book reveals how communities can achieve real digital freedom and resilience.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
