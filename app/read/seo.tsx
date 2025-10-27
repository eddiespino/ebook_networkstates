"use client"

import { getBreadcrumbSchema } from "@/lib/json-ld-schema"

export function ReadSEO() {
    const jsonLdSchemas = [getBreadcrumbSchema("read")]

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(jsonLdSchemas),
            }}
        />
    )
}
