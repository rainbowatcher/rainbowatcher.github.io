import process from "node:process"
import { app, appConfig, docSearch, site } from "./siteConfig"

export default defineNuxtConfig({
    $development: {
        // Nuxt collects anonymous telemetry data
        // telemetry: true,
        vite: {
            build: {
                minify: false,
            },
        },
    },

    $production: {
        nitro: {
            future: { nativeSWR: true },
            prerender: {
                autoSubfolderIndex: true,
                // crawlLinks: true,
                routes: ["/", "/sitemap.xml"],
            },
        },
        routeRules: {
            "/**": { isr: true },
        },
        sourcemap: true,
        ssr: true,
    },

    app,
    appConfig,
    colorMode: { classSuffix: "" },
    components: {
        dirs: [
            {
                global: true,
                // ProseCodeInline is deliberately NOT registered globally: the
                // @nuxt/content baseline rendered it as a literal unresolved
                // element on the home page, and we preserve that byte-for-byte.
                // Article pages pass it explicitly via MDCRenderer's `components`
                // prop (matching the baseline's styled inline code there).
                ignore: ["**/ProseCodeInline.vue"],
                path: "~/components",
                pathPrefix: false,
            },
        ],
    },

    // 顺序即优先级：自写的元素重置在最前，UnoCSS 工具类随后，站点全局样式最后。
    // uno.css 只在这里引入一次：再开 @unocss/nuxt 的 autoImport 就等于引入两次，
    // UnoCSS 只取第一处，层叠顺序不再由本数组决定。
    css: ["~/styles/reset.css", "uno.css", "~/styles/index.css"],
    devtools: { enabled: false },

    experimental: {
        componentIslands: true,
        defaults: {
            useAsyncData: {
                deep: false,
            },
        },
        noVueServer: true,
        payloadExtraction: "client",
        renderJsonPayloads: false,
    },

    features: {
        // 样式走 /_nuxt/entry.*.css 外链：内联样式会让 Nuxt 把未接入的 uno.css
        // 当作可内联目标去探测，UnoCSS 因此误报「重复引入」，且每页都重发一遍 CSS。
        inlineStyles: false,
    },

    fonts: {
        providers: {
            bunny: false,
            fontshare: false,
            google: false,
            googleicons: false,
        },
    },

    linkChecker: {
        enabled: false,
    },

    mdc: {
        components: {
            map: {
                a: "ProseA",
                blockquote: "ProseBlockquote",
                code: "ProseCodeInline",
                em: "ProseEm",
                h1: "ProseH1",
                h2: "ProseH2",
                h3: "ProseH3",
                h4: "ProseH4",
                h5: "ProseH5",
                h6: "ProseH6",
                hr: "ProseHr",
                img: "ProseImg",
                li: "ProseLi",
                ol: "ProseOl",
                p: "ProseP",
                pre: "ProsePre",
                script: "ProseScript",
                // span: "ProseSpan",
                strong: "ProseStrong",
                // sub: "ProseSub",
                // sup: "ProseSup",
                table: "ProseTable",
                tbody: "ProseTbody",
                td: "ProseTd",
                th: "ProseTh",
                thead: "ProseThead",
                tr: "ProseTr",
                ul: "ProseUl",
            },
            prose: false,
        },
        headings: {
            anchorLinks: true,
        },
        highlight: {
            highlighter: "shiki",
            langs: [
                "astro",
                "batch",
                "c",
                "cpp",
                "csharp",
                "css",
                "diff",
                "go",
                "html",
                "http",
                "ini",
                "java",
                "javascript",
                "json",
                "jsx",
                "kotlin",
                "latex",
                "lua",
                "markdown",
                "mermaid",
                "md",
                "nginx",
                "python",
                "ruby",
                "rust",
                "shell",
                "sql",
                "svelte",
                "tex",
                "toml",
                "tsx",
                "typescript",
                "vue",
                "xml",
                "yaml",
                "zig",
                "zsh",
            ],
            noApiRoute: true,
            // 明暗两种模式都用深色代码块：这是原型的设计选择，代码块外壳与整页配色解耦
            theme: {
                dark: "vitesse-dark",
                default: "vitesse-dark",
            },
        },
        rehypePlugins: {
            "rehype-external-links": { options: { target: "_blank" } },
            "rehype-katex": {
                options: { output: "html", strict: "warn" },
            },
        },
        remarkPlugins: {
            "remark-flexible-containers": {},
            "remark-gfm": { options: { singleTilde: false } },
            "remark-math": {},
        },
    },

    modules: [
        "@nuxtjs/seo",
        "@nuxtjs/color-mode",
        "@nuxtjs/mdc",
        "@nuxt/image",
        "@nuxt/fonts",
        "@vueuse/nuxt",
        "@vueuse/motion/nuxt",
        "@unocss/nuxt",
    ],

    nitro: {
        hooks: {
            "prerender:generate"(route: any) {
                if (route.fileName?.endsWith(".html") && route.contents) {
                    route.contents = route.contents.replaceAll(/(?:src|href|srcset)="\/_ipx[^"]+"/g, (r: string) =>
                        r.replaceAll("//", "/"),
                    )
                }

                if (route.error) {
                    console.error(route.route, route.error, route)
                    // eslint-disable-next-line unicorn/no-process-exit
                    process.exit(1)
                }
            },
        },
    },

    // because i'm using permalink for my posts, and og-image not support custom route path yet
    ogImage: { enabled: false },

    postcss: {
        plugins: {
            "@unocss/postcss": {},
        },
    },

    router: {
        options: {
            scrollBehaviorType: "smooth",
        },
    },

    runtimeConfig: {
        public: { docSearch },
    },

    site,

    unocss: {
        // uno.css 的位置由上面的 css 数组决定，autoImport 再注入一份就是重复引入
        autoImport: false,
        // 与 features.inlineStyles 保持一致，否则模块会反向把它改回 true
        disableNuxtInlineStyle: true,
    },

    compatibilityDate: "2025-02-05",

    vite: {
        build: {
            // mermaid 图表库只在含图表的文章里按需加载，单个 chunk 本身就超过 500 kB，
            // 阈值按实测的 1.5 MB 放宽到 1.6 MB；应用自身代码远低于此值。
            chunkSizeWarningLimit: 1600,
        },
    },
})
