import type { NuxtConfig } from "nuxt/schema"
// import type { UseHeadInput } from "unhead"
// import type { MergeHead } from "zhead"

const title = "Rainbow Watcher"
// const description = "Portfolio for Rainbow Watcher"
const domain = "rainbowatcher.github.io"
const url = `https://${domain}/`
const ogImage = "/og.png"
// const siteIcon = "/favicon.svg"
// const darkSiteIcon = "/favicon-dark.svg"
// const licenseUrl = "https://creativecommons.org/licenses/by-nc-sa/4.0/"

// const head = {
//     link: [
//         {
//             href: darkSiteIcon,
//             media: "(prefers-color-scheme: dark)",
//             rel: "icon",
//             type: "image/svg+xml",
//         },
//         {
//             href: siteIcon,
//             media: "(prefers-color-scheme: light)",
//             rel: "icon",
//             type: "image/svg+xml",
//         },
//         {
//             href: licenseUrl,
//             rel: "license",
//         },
//     ],
//     meta: [
//         { content: "#00aba9", name: "msapplication-TileColor" },
//         { charset: "utf8" },
//     ],
//     title,
// } satisfies UseHeadInput<MergeHead>


export const algolia: NuxtConfig["algolia"] = {
    apiKey: "f757c625852758ee96aaf2268959166e",
    applicationId: "3BGNB9V5MC",
    docSearch: {
        indexName: "rainbowatcher",
    },
}

export const app: NuxtConfig["app"] = {
    head: {
        meta: [
            { content: ogImage, property: "og:image" },
            // { content: description, property: "description" },
        ],
        // title,
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
