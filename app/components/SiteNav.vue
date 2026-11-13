<script setup lang="ts">
/**
 * 做什么：站点主导航：页头横向导航条。
 * 状态与生命周期：导航项来自 useSiteNav（与移动端抽屉同源），高亮随路由变化。
 * 取舍与不变量：当前分区用强调底色 + 强调字色标出，并写 aria-current="page"；
 * 分组之间用一竖线隔开，让「写」与「读」在视觉上不连成一条。
 * 边界：不负责菜单的显隐与浮层（见 SiteMenu / SiteMenuContent）。
 */
const { isActive, navGroups } = useSiteNav()

function linkClass(path: string) {
    const base = "block rounded-ctrl px-12px py-7px text-14px font-500 leading-1 transition-colors"
    return isActive(path) ? `${base} bg-accentSoft c-accent font-650` : `${base} c-ink2 hover:(bg-surface2 c-ink)`
}
</script>

<template>
    <nav aria-label="主导航" class="flex flex-row items-center gap-2px">
        <template v-for="(group, groupIndex) in navGroups" :key="groupIndex">
            <span v-if="groupIndex > 0" class="mx-5px h-13px w-px flex-none bg-line" aria-hidden="true" />
            <NuxtLink
                v-for="item in group"
                :key="item.path"
                :to="item.path"
                :class="linkClass(item.path)"
                :aria-current="isActive(item.path) ? 'page' : undefined"
                prefetch
            >
                {{ item.label }}
            </NuxtLink>
        </template>
    </nav>
</template>
