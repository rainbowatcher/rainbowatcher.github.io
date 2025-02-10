<script lang="ts" setup>
import type { ContentNavigationItem } from "@nuxt/content"

type PageNavProps = {
    next?: ContentNavigationItem
    previous?: ContentNavigationItem
    usePermalink?: boolean
    useTitle?: boolean
}

const props = defineProps<PageNavProps>()
const { breakpoints } = useSiteState()

function getLink(item?: ContentNavigationItem): string {
    (item as unknown as Event)?.preventDefault?.()
    if (!item) return ""
    return props.usePermalink ? item.permalink as string : item.path
}

function handleClick(e: Event, url?: ContentNavigationItem) {
    e.preventDefault()
    if (toValue(breakpoints.greater("sm"))) {
        return
    } else {
        navigateTo(getLink(url))
    }
}
</script>

<template>
    <div class="page-nav mt-auto flex justify-between py8 font-mb lt-sm:(mx6 flex-col gap-4) md:(mx-[calc(5rem+3rem)] flex-row flex-nowrap) sm:(mx-8 gap-2)">
        <div
            v-if="previous"
            class="b-border px8 py4 transition-color md:(max-w-80 b-l) sm:(w-1/2 flex-1) lt-md:(cursor-pointer b rounded-lg hover:bg-neutral/10)"
            @click="handleClick($event, previous)"
        >
            <div v-if="$props.useTitle" class="text-xs op-75 md:hidden">
                上一页
            </div>
            <NuxtLink class="lt-sm:bg-none" :to="getLink(previous)" prefetch>
                <span>{{ $props.useTitle ? previous.title : "上一页" }}</span>
            </NuxtLink>
        </div>
        <div
            v-if="next"
            class="b-border px8 py4 text-right transition-background-color md:(mla max-w-80 b-r) sm:(w-1/2 flex-1) lt-md:(cursor-pointer b rounded-lg hover:bg-neutral/10)"
            @click="handleClick($event, next)"
        >
            <div v-if="$props.useTitle" class="text-xs op-75 md:hidden">
                下一页
            </div>
            <NuxtLink class="lt-sm:bg-none" :to="getLink(next)" prefetch>
                <span>{{ $props.useTitle ? next.title : "下一页" }}</span>
            </NuxtLink>
        </div>
    </div>
</template>
