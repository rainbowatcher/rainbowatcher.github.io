import { defineCollection, defineContentConfig, z } from "@nuxt/content"

export default defineContentConfig({
    collections: {
        archives: defineCollection({
            source: "archives/**/*.md",
            type: "page",
        }),
        home: defineCollection({
            source: "home.md",
            type: "page",
        }),
        posts: defineCollection({
            schema: z.object({
                // body: z.object(),
                date: z.string(),
                permalink: z.string(),
                subtitle: z.string(),
                tags: z.array(z.string()),
                title: z.string(),
            }),
            source: "posts/**/*.md",
            type: "page",
        }),
        uses: defineCollection({
            source: "uses.md",
            type: "page",
        }),
    },
})
