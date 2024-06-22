<script lang="ts" setup>
import type { NavItem } from "@nuxt/content"

type PageNavProps = {
    next?: Partial<NavItem>
    previous?: Partial<NavItem>
    usePermalink?: boolean
    useTitle?: boolean
}

const props = defineProps<PageNavProps>()
const { breakpoints } = useSiteState()

function getLink(item?: Partial<NavItem>) {
    (item as Event).preventDefault
    if (!item) return ""
    return props.usePermalink ? item.permalink : item._path
}

function handleClick(e: Event, url?: Partial<NavItem>) {
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
            <div v-if="useTitle" class="text-xs op-75 md:hidden">
                {{ $t("previousPage") }}
            </div>
            <NuxtLink class="lt-sm:bg-none" :to="getLink(previous)" prefetch>
                <span>{{ useTitle ? previous.title : $t("previousPage") }}</span>
            </NuxtLink>
        </div>
        <div
            v-if="next"
            class="b-border px8 py4 text-right transition-background-color md:(mla max-w-80 b-r) sm:(w-1/2 flex-1) lt-md:(cursor-pointer b rounded-lg hover:bg-neutral/10)"
            @click="handleClick($event, next)"
        >
            <div v-if="useTitle" class="text-xs op-75 md:hidden">
                {{ $t("nextPage") }}
            </div>
            <NuxtLink class="lt-sm:bg-none" :to="getLink(next)" prefetch>
                <span>{{ useTitle ? next.title : $t("nextPage") }}</span>
            </NuxtLink>
        </div>
    </div>
</template>
