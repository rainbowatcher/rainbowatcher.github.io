<script setup lang="ts">
/**
 * 做什么：站点主导航：页头横向导航条。
 * 状态与生命周期：导航项来自 useSiteNav（与移动端抽屉同源），高亮随路由变化。
 * 取舍与不变量：当前分区用强调底色 + 强调字色标出，并写 aria-current="page"。
 * 边界：不负责菜单的显隐与浮层（见 SiteMenu / SiteMenuContent）。
 */
const { isActive, navItems } = useSiteNav()

function linkClass(path: string) {
    const base = "block rounded-ctrl px-12px py-7px text-14px font-500 leading-1 transition-colors"
    return isActive(path) ? `${base} bg-accentSoft c-accent font-650` : `${base} c-ink2 hover:(bg-surface2 c-ink)`
}
</script>

<template>
    <nav aria-label="主导航">
        <NuxtLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            :class="linkClass(item.path)"
            :aria-current="isActive(item.path) ? 'page' : undefined"
            prefetch
        >
            {{ item.label }}
        </NuxtLink>
    </nav>
</template>
