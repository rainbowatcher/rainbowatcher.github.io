import type { NuxtConfig } from "nuxt/schema"
import type { UseHeadInput } from "unhead"
import type { MergeHead } from "zhead"

const title = "Rainbow Watcher's Portfolio"
const description = "Rainbow Watcher's Portfolio"
const domain = "rainbowatcher.github.io"
const url = `https://${domain}/`
const image = "/favicon.svg"

const head = {
    link: [
        {
            href: "/favicon-dark.svg",
            media: "(prefers-color-scheme: dark)",
            rel: "icon",
            type: "image/svg+xml",
        },
        {
            href: "/favicon.svg",
            media: "(prefers-color-scheme: light)",
            rel: "icon",
            type: "image/svg+xml",
        },
        {
            href: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
            rel: "license",
        },
    ],
    meta: [
        { content: "#00aba9", name: "msapplication-TileColor" },
        // facebook
        { content: "website", property: "og:type" },
        { content: title, property: "og:title" },
        { content: description, property: "og:description" },
        { content: url, property: "og:url" },
        { content: image, property: "og:image" },
        // twitter / x
        { content: "summary_large_image", name: "twitter:card" },
        { content: title, name: "twitter:title" },
        { content: description, name: "twitter:description" },
        { content: image, name: "twitter:image" },
        { content: url, property: "twitter:url" },
        { content: domain, property: "twitter:domain" },

        { content: description, name: "description" },
        { charset: "utf8" },
    ],
    title,
} satisfies UseHeadInput<MergeHead>


export const algolia: NuxtConfig["algolia"] = {
    apiKey: "f757c625852758ee96aaf2268959166e",
    applicationId: "3BGNB9V5MC",
    docSearch: {
        indexName: "rainbowatcher",
    },
}

export const appConfig: NuxtConfig["appConfig"] = {
    head,
}

export const site: NuxtConfig["site"] = {
    description: "Rainbow Watcher's Portfolio",
    name: "Rainbow Watcher's Portfolio",
    trailingSlash: false,
    url: "https://blog-rainbowatcher.vercel.app",
}
