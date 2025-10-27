"use client"

import { getBreadcrumbSchema, getAudiobookSchema } from "@/lib/json-ld-schema"

export function AudiobookSEO() {
    const jsonLdSchemas = [getBreadcrumbSchema("audiobook"), getAudiobookSchema()]

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(jsonLdSchemas),
            }}
        />
    )
}
