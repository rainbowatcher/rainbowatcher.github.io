<script setup lang="ts">
/**
 * 做什么：站点页头：品牌标记、主导航、搜索、主题切换、GitHub 与移动端菜单入口。
 * 状态与生命周期：滚动超过 8px 时给页头挂 is-scrolled（玻璃层变实、显下边框）。
 * 取舍与不变量：导航项只在 SiteNav 里定义一次；搜索触发器外观由 DocSearch 皮肤提供。
 * 边界：不负责移动端菜单的内容（见 SiteMenuContent）与顶部进度条（见 ReadingProgress）。
 */
const { y } = useWindowScroll()
const scrolled = computed(() => y.value > 8)
</script>

<template>
    <header
        class="site-header sticky z-90 top-0 border-b border-b-transparent transition-colors"
        :class="{ 'is-scrolled': scrolled }"
        role="banner"
    >
        <div class="wrap h-[var(--header-h)] flex items-center gap-36px lt-sm:gap-12px">
            <NuxtLink
                to="/"
                class="brand inline-flex items-center gap-11px flex-none"
                aria-label="Rainbow Watcher 首页"
            >
                <span class="brand-mark" aria-hidden="true" />
                <span class="flex flex-col gap-1px leading-[1.15]">
                    <span class="font-serif text-16px font-700 tracking-[-0.01em]">Rainbow Watcher</span>
                    <span class="c-muted text-9px font-500 tracking-[0.32em] uppercase lt-sm:hidden">看彩虹的人</span>
                </span>
            </NuxtLink>

            <SiteNav class="ml-6px flex flex-row items-center gap-2px lt-lg:hidden" />

            <div class="ml-auto flex items-center gap-6px">
                <SearchBar />
                <ColorModeToggler />
                <NuxtLink
                    class="icon-btn lt-md:hidden"
                    to="https://github.com/rainbowatcher"
                    external
                    target="_blank"
                    aria-label="GitHub"
                    title="GitHub"
                >
                    <i class="i-ph-github-logo text-18px" />
                </NuxtLink>
                <SiteMenu />
            </div>
        </div>
    </header>
</template>
