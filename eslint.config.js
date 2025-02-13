import { defineConfig } from "@rainbowatcher/eslint-config"
import nuxt from "./.nuxt/eslint.config.mjs"

export default nuxt(defineConfig({
    css: true,
    gitignore: true,
    json: true,
    jsx: true,
    markdown: true,
    style: true,
    typescript: {
        typeAware: false,
    },
    unocss: true,
    vue: true,
    yaml: true,
}), {
    files: ["**/*.vue"],
    rules: {
        "vue/no-multiple-template-root": "off",
    },
}, {
    files: ["nuxt.config.ts"],
    rules: {
        "ts/naming-convention": "off",
    },
})
