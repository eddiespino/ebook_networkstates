"use client"

import dynamic from "next/dynamic"
import { getPdfUrl } from "@/lib/pdf-config"

const PDFReaderClient = dynamic(() => import("@/components/pdf-reader-client").then((mod) => mod.PDFReaderClient), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Loading PDF Reader...</p>
      </div>
    </div>
  ),
})

export default function ReadPage() {
  const pdfUrl = getPdfUrl()

  return <PDFReaderClient pdfUrl={pdfUrl} />
}
