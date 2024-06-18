<script lang="ts" setup>
import type { NavItem } from "@nuxt/content/types"

type PageNavProps = {
    next?: Partial<NavItem>
    previous?: Partial<NavItem>
    usePermalink?: boolean
    useTitle?: boolean
}

const props = defineProps<PageNavProps>()

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
        navigateTo(getLink(url), { external: true })
    }
}
</script>

<template>
    <div class="page-nav mt-auto flex justify-between py8 font-mb lt-sm:(mx6 flex-col gap-2) sm:(mx-[calc(5rem+3rem)] flex-row flex-nowrap)">
        <div v-if="previous" class="b-border px8 py4 transition-color sm:(max-w-80 b-l) lt-sm:(cursor-pointer b rounded-lg hover:bg-neutral/10)" @click="handleClick($event, previous)">
            <div class="text-xs op-75 sm:hidden">
                {{ $t("previousPage") }}
            </div>
            <NuxtLink class="lt-sm:bg-none" :to="getLink(previous)" prefetch @click="navigateTo(getLink(previous), { external: true })">
                <span>{{ useTitle ? previous.title : $t("previousPage") }}</span>
            </NuxtLink>
        </div>
        <div v-if="next" class="b-border px8 py4 text-right transition-background-color sm:(mla max-w-80 b-r) lt-sm:(cursor-pointer b rounded-lg hover:bg-neutral/10)" @click="handleClick($event, next)">
            <div class="text-xs op-75 sm:hidden">
                {{ $t("nextPage") }}
            </div>
            <NuxtLink class="lt-sm:bg-none" :to="getLink(next)" prefetch @click="navigateTo(getLink(next), { external: true })">
                <span>{{ useTitle ? next.title : $t("nextPage") }}</span>
            </NuxtLink>
        </div>
    </div>
</template>
