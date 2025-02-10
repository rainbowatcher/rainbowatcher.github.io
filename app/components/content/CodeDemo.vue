<script setup lang="ts">
import { useMotionProperties, useSpring } from "@vueuse/motion"
import { cn, useToggle } from "#imports"

defineProps<{
    class?: string
}>()

const slots = useSlots()
const [loaded, toggleLoaded] = useToggle(false)
const floatControl = ref<HTMLDivElement>()
const shadowDomContainer = ref<HTMLDivElement>()
const codeSource = ref<HTMLDivElement>()
const height = ref(0)
const tabs = computed<Array<{ code: string; lang: string }>>(() => slots.default?.({}).map((slot: any) => {
    return {
        code: slot.props?.code,
        lang: slot.props?.language,
    }
}) || [])
const cssCode = computed(() => tabs.value.find(tab => tab.lang === "css")?.code)
const htmlCode = computed(() => tabs.value.find(tab => tab.lang === "html")?.code)
const { motionProperties: csProps } = useMotionProperties(codeSource)
const { motionProperties: fcProps } = useMotionProperties(floatControl)
// @ts-expect-error type miss match
const { set: setCs, stop: stopCs, values } = useSpring(csProps, { bounce: 0, duration: 500, velocity: 1 })
// @ts-expect-error type miss match
const { set: setFc, stop: stopFc } = useSpring(fcProps, { bounce: 0, duration: 500, velocity: 1 })
const isCollapsed = computed(() => (values as any).height === 0)

function toggleShowCode(show?: boolean) {
    if (!codeSource.value) return
    stopCs()
    stopFc()
    if (show === false || !isCollapsed.value) {
        setCs({ height: 0 })
        setFc({ opacity: 0 })
    } else {
        setCs({ height: height.value })
        setFc({ opacity: 1 })
    }
}

watchOnce(codeSource, () => {
    if (codeSource.value) {
        height.value = codeSource.value.clientHeight
        toggleShowCode(false)
    }
})
watchOnce(shadowDomContainer, () => {
    if (shadowDomContainer.value) {
        const shadowRoot = shadowDomContainer.value.attachShadow({ mode: "open" })
        const divEl = document.createElement("div")
        const styleEl = document.createElement("style")
        styleEl.textContent = cssCode.value ?? ""
        divEl.innerHTML = htmlCode.value ?? ""
        shadowRoot.append(divEl)
        shadowRoot.append(styleEl)
        toggleLoaded(true)
    }
})
</script>

<template>
    <div class="code-demo min-h-6rem w-full b b-border rounded-lg">
        <div v-show="!loaded" class="i-line-md-loading-twotone-loop absolute left-1/2 top-1/2 translate--1/2 p--2" />
        <div ref="shadowDomContainer" :class="cn('code-demo-preview bg-popover/20 p-4 rounded-t-lg', $props.class)" />
        <div
            class="code-demo-toolbar flex flex-(row nowrap) justify-between bg-card px-4 py-1"
            :class="{ 'rounded-b-lg': isCollapsed }"
        >
            <p>{{ "" }}</p>
            <ul
                class="flex flex-row gap-2 [&>li]:(h-8 flex cursor-pointer items-center rounded-lg px1.2 transition-background-color-300) [&>li:hover]:bg-neutral/20"
            >
                <li><i class="i-ph:codepen-logo" /></li>
                <li><i class="i-ph:code" @click="toggleShowCode()" /></li>
            </ul>
        </div>
        <div ref="codeSource" class="code-demo-source block max-h-sm overflow-auto">
            <div class="h-[calc(100%_-2rem)] sm:(p4 space-y-2) lt-sm:(px-6 divide-y divide-ring)">
                <slot />
            </div>
        </div>
        <div
            ref="floatControl"
            class="code-demo-float-control sticky bottom-0 left-0 right-0 z-10 float-left h-8 w-full flex cursor-pointer select-none items-center justify-center rounded-b-lg bg-card hover:c-card-foreground"
            tabindex="0" role="button" @click="toggleShowCode(false)"
        >
            <i class="i-ph:arrow-line-up text-sm" />
            <span class="ml-2 text-sm">关闭</span>
        </div>
    </div>
</template>
