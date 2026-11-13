<script setup lang="ts">
/**
 * 做什么：站点页脚：品牌简介、浏览与关于两组链接、构建信息，以及底部版权条。
 * 状态与生命周期：构建时间读自构建期写入的 build-info.json；年份在渲染时取当前年。
 * 取舍与不变量：页脚是站点地图的兜底入口，导航项与页头同源，不在这里另抄一份；
 * 「浏览」收阅读类分组，「关于」收末组（在用 / 项目），故分组调整不必改本文件；
 * 构建列写明技术栈与许可，便于查版本来源。
 * 边界：不承载导航交互与搜索，也不做「对比度自检」这类原型自用工具。
 */
import buildInfo from "~/assets/build-info.json"
import { NAV_GROUPS } from "~/composables/useSiteNav"

const year = new Date().getFullYear()
const buildDate = buildInfo.time.slice(0, 10).replaceAll("-", ".")
const browseItems = NAV_GROUPS.slice(0, -1).flat()
const aboutItems = NAV_GROUPS.at(-1) ?? []
</script>

<template>
    <footer class="mt-[clamp(64px,9vw,120px)] border-t border-line bg-surface" role="contentinfo">
        <div
            class="wrap grid grid-cols-[minmax(240px,1.7fr)_repeat(3,minmax(120px,0.65fr))] gap-48px py-56px pb-44px lt-lg:grid-cols-[1.4fr_1fr_1fr] lt-md:(grid-cols-2 gap-32px)"
        >
            <div class="lt-md:col-span-2">
                <NuxtLink to="/" class="brand mb-16px inline-flex items-center gap-11px" aria-label="回到首页">
                    <span class="brand-mark" aria-hidden="true" />
                    <span class="flex flex-col gap-1px leading-[1.15]">
                        <span class="font-serif text-16px font-700 tracking-[-0.01em]">Rainbow Watcher</span>
                        <span class="c-muted text-9px font-500 tracking-[0.32em] uppercase">看彩虹的人</span>
                    </span>
                </NuxtLink>
                <p class="c-muted text-13px leading-[1.8]">
                    写代码，也记录写代码之外的事。<br />
                    保持好奇，偶尔更新。
                </p>
            </div>

            <nav class="flex flex-col items-start gap-9px" aria-label="页脚导航">
                <h2 class="mb-5px c-faint font-mono text-10px font-600 tracking-[0.16em] uppercase">浏览</h2>
                <NuxtLink
                    v-for="item in browseItems"
                    :key="item.path"
                    :to="item.path"
                    class="c-ink2 text-13px hover:c-accent"
                    prefetch
                >
                    {{ item.label }}
                </NuxtLink>
            </nav>

            <div class="flex flex-col items-start gap-9px">
                <h2 class="mb-5px c-faint font-mono text-10px font-600 tracking-[0.16em] uppercase">关于</h2>
                <NuxtLink
                    v-for="item in aboutItems"
                    :key="item.path"
                    :to="item.path"
                    class="c-ink2 text-13px hover:c-accent"
                    prefetch
                >
                    {{ item.label }}
                </NuxtLink>
                <NuxtLink
                    class="c-ink2 text-13px hover:c-accent"
                    to="https://github.com/rainbowatcher"
                    external
                    target="_blank"
                    rel="noreferrer"
                >
                    GitHub ↗
                </NuxtLink>
                <NuxtLink
                    class="c-ink2 text-13px hover:c-accent"
                    to="https://x.com/_rainbowatcher"
                    external
                    target="_blank"
                    rel="noreferrer"
                >
                    X / Twitter ↗
                </NuxtLink>
            </div>

            <div class="flex flex-col items-start gap-9px lt-lg:hidden">
                <h2 class="mb-5px c-faint font-mono text-10px font-600 tracking-[0.16em] uppercase">构建</h2>
                <span class="c-muted font-mono text-11px">Nuxt · UnoCSS · MDC</span>
                <span class="c-muted font-mono text-11px">BUILD {{ buildDate }}</span>
                <NuxtLink
                    class="c-muted font-mono text-11px hover:c-accent"
                    to="https://creativecommons.org/licenses/by-nc-sa/4.0/"
                    external
                    target="_blank"
                    rel="license noreferrer"
                >
                    CC BY-NC-SA 4.0
                </NuxtLink>
            </div>
        </div>

        <div
            class="wrap flex flex-wrap items-center gap-10px border-t border-line py-16px pb-22px c-faint text-11px lt-md:gap-y-6px"
        >
            <span>© 2022–{{ year }} Rainbow Watcher</span>
            <span class="op-60" aria-hidden="true">·</span>
            <span>用文字和代码搭起来的小站</span>
        </div>
    </footer>
</template>
