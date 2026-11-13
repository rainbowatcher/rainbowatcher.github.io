<script setup lang="ts">
/**
 * 做什么：移动端全屏抽屉菜单：品牌、编号导航、主题切换与 GitHub 入口。
 * 状态与生命周期：show 由父级 SiteMenu 传入；打开时锁滚动，Esc 或点击链接关闭。
 * 取舍与不变量：导航项与页头同源（useSiteNav），编号跨分组连续，故不会两处漂移；
 * 分组之间留出一段空行，读者能一眼分出「写」与「读」。
 * 边界：不做动画之外的交互逻辑，也不承载搜索（搜索入口在页头）。
 */
const show = defineModel<boolean>("show", { default: false })
const { isActive, navGroups, navItems } = useSiteNav()
const numbers = new Map(navItems.map((item, index) => [item.path, String(index + 1).padStart(2, "0")]))

watch(show, (value) => {
    if (import.meta.client) {
        document.documentElement.style.overflow = value ? "hidden" : ""
    }
})

function close() {
    show.value = false
}

useEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === "Escape") close()
})

onUnmounted(() => {
    if (import.meta.client) {
        document.documentElement.style.overflow = ""
    }
})
</script>

<template>
    <Teleport to="body">
        <Transition
            enter-active-class="animate-in-300 fade-in slide-in-from-top-3"
            leave-active-class="animate-out-300 fade-out slide-out-to-top-3"
        >
            <div v-if="show" class="fixed inset-0 z-98 flex flex-col bg-bg px-[var(--gutter)] pt-20px pb-28px">
                <div class="flex items-center justify-between border-b border-line pb-24px">
                    <NuxtLink to="/" class="brand inline-flex items-center gap-11px" @click="close">
                        <span class="brand-mark" aria-hidden="true" />
                        <span class="flex flex-col gap-1px leading-[1.15]">
                            <span class="font-serif text-16px font-700 tracking-[-0.01em]">Rainbow Watcher</span>
                            <span class="c-muted text-9px font-500 tracking-[0.32em] uppercase">看彩虹的人</span>
                        </span>
                    </NuxtLink>
                    <button class="icon-btn" type="button" aria-label="关闭菜单" @click="close">
                        <i class="i-ph-x text-18px" />
                    </button>
                </div>

                <nav class="mt-18px flex flex-col" aria-label="移动端导航">
                    <div
                        v-for="(group, groupIndex) in navGroups"
                        :key="groupIndex"
                        class="flex flex-col"
                        :class="{ 'mt-20px': groupIndex > 0 }"
                    >
                        <NuxtLink
                            v-for="item in group"
                            :key="item.path"
                            :to="item.path"
                            class="flex items-baseline justify-between border-b border-line py-18px px-2px font-serif text-30px font-600 tracking-[-0.01em] hover:c-accent"
                            :class="{ 'c-accent': isActive(item.path) }"
                            :aria-current="isActive(item.path) ? 'page' : undefined"
                            @click="close"
                        >
                            <span>{{ item.label }}</span>
                            <span class="c-faint font-mono text-10px tracking-[0.1em]">
                                {{ numbers.get(item.path) }}
                            </span>
                        </NuxtLink>
                    </div>
                </nav>

                <div class="mt-auto flex gap-10px pt-24px">
                    <ColorModeToggler block label="切换主题" />
                    <NuxtLink
                        class="btn-ghost flex-1"
                        to="https://github.com/rainbowatcher"
                        external
                        target="_blank"
                        aria-label="GitHub"
                    >
                        GitHub ↗
                    </NuxtLink>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>
