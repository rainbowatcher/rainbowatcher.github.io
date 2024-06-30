<!-- ref: https://github.com/mermaid-js/mermaid/blob/develop/packages/mermaid/src/docs/.vitepress/theme/Mermaid.vue  -->
<script lang="ts" setup>
import mermaid from "mermaid"
import { onMounted, onUnmounted, ref } from "vue"
import type { MermaidConfig } from "mermaid"

const props = defineProps({
    graph: {
        required: true,
        type: String,
    },
    id: {
        required: true,
        type: String,
    },
})

const svg = ref("")
let mut: MutationObserver | undefined

onMounted(async () => {
    mut = new MutationObserver(() => renderChart())
    mut.observe(document.documentElement, { attributes: true })
    await renderChart()

    // refresh images on first render
    const hasImages = /<img([\S\s]+?)>/.exec(decodeURIComponent(props.graph))?.length || false
    if (hasImages) {
        setTimeout(() => {
            const imgElements = document.querySelectorAll("img")
            const imgs = [...imgElements]
            if (imgs.length > 0) {
                Promise.all(imgs.filter(img => !img.complete).map(img => new Promise((resolve) => {
                    img.addEventListener("load", () => img.addEventListener("error", resolve))
                }))).then(() => {
                    renderChart()
                })
            }
        }, 100)
    }
})

onUnmounted(() => mut?.disconnect())

async function render(id: string, code: string, config: MermaidConfig): Promise<string> {
    mermaid.initialize(config)
    const { svg } = await mermaid.render(id, code)
    return svg
}

async function renderChart() {
    // console.log(`rendering chart${props.id}${props.graph}`)
    const hasDarkClass = document.documentElement.classList.contains("dark")
    const mermaidConfig = {
        securityLevel: "loose",
        startOnLoad: false,
        theme: hasDarkClass ? "dark" : "default",
    }

    // console.log({ mermaidConfig })
    const svgCode = await render(props.id, decodeURIComponent(props.graph), mermaidConfig)
    // This is a hack to force v-html to re-render, otherwise the diagram disappears
    // when **switching themes** or **reloading the page**.
    // The cause is that the diagram is deleted during rendering (out of Vue's knowledge).
    // Because svgCode does NOT change, v-html does not re-render.
    // This is not required for all diagrams, but it is required for c4c, mindmap and zenuml.
    const salt = Math.random().toString(36)
        .slice(7)
    svg.value = `${svgCode} <span style="display: none">${salt}</span>`
}
</script>

<template>
    <div v-html="svg" />
</template>
