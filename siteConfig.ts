import type { NuxtConfig } from "nuxt/schema"

const title = "Rainbow Watcher"
const domain = "rainbowatcher.github.io"
const url = `https://${domain}/`
const ogImage = "/og.webp"
const licenseUrl = "https://creativecommons.org/licenses/by-nc-sa/4.0/"

export const algolia: NuxtConfig["algolia"] = {
    apiKey: "f757c625852758ee96aaf2268959166e",
    applicationId: "3BGNB9V5MC",
    docSearch: {
        indexName: "rainbowatcher",
    },
}

export const app: NuxtConfig["app"] = {
    head: {
        link: [
            { href: licenseUrl, rel: "license" },
        ],
        meta: [
            { content: ogImage, property: "og:image" },
        ],
    },
}

export const appConfig: NuxtConfig["appConfig"] = {
    // head,
}

export const site: NuxtConfig["site"] = {
    name: title,
    trailingSlash: false,
    url,
}
