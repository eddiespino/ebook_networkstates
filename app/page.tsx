import { BookHero } from "@/components/book-hero"
import { BookReader } from "@/components/book-reader"
import { BookDetails } from "@/components/book-details"
import { AuthorsSection } from "@/components/authors-section"

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
