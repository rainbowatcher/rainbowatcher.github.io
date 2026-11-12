<script setup lang="ts">
/**
 * 做什么：博客时间流卡片：作者行、标题、摘要、可原地展开的正文、标签与打开入口。
 * 状态与生命周期：展开时才按需取正文（useDocument），收起保留已取到的文档，避免重复请求；
 * 展开状态是本地 UI 状态，不写路由，刷新后回到摘要态。
 * 取舍与不变量：正文用与详情页同一套 .prose 排版并加 is-embedded 去掉 h2 顶部细线，
 * 保证「原地读」与「进详情页」看到的正文一致。
 * 边界：不做关键词与主题筛选（见列表页），也不做分页。
 */
import type { ContentDocument, Post } from "~/types/content"

const props = defineProps<{ post: Post }>()

const expanded = ref(false)
const doc = ref<ContentDocument>()
const loading = ref(false)

async function toggle(open: boolean) {
    expanded.value = open
    if (!open || doc.value || loading.value) return
    loading.value = true
    try {
        doc.value = await useDocument(props.post.path)()
    } finally {
        loading.value = false
    }
}

const dateLabel = computed(() => props.post.date.replaceAll("-", "."))
const excerpt = computed(() => props.post.description ?? props.post.subtitle ?? "")
</script>

<template>
    <article class="border-b border-line py-22px" :class="{ 'is-expanded': expanded }">
        <header class="flex items-center gap-10px">
            <span
                class="grid h-40px w-40px flex-none place-items-center rounded-full bg-accentSoft c-accent font-serif text-17px font-700"
                aria-hidden="true"
            >
                虹
            </span>
            <span class="flex min-w-0 flex-col gap-1px">
                <strong class="text-[13.5px] leading-[1.4]">Rainbow Watcher</strong>
                <span class="c-muted font-mono text-10px leading-[1.4]">@rainbowatcher · {{ dateLabel }}</span>
            </span>
            <NuxtLink
                class="ml-auto c-faint font-mono text-14px hover:c-accent"
                :to="post.permalink ?? post.path"
                :aria-label="`打开《${post.title}》`"
                prefetch
            >
                ↗
            </NuxtLink>
        </header>

        <div class="ml-50px lt-sm:ml-0">
            <h2 class="mt-14px font-serif text-22px font-600 tracking-[-0.015em] leading-[1.35] lt-sm:text-20px">
                <NuxtLink class="hover:c-accent" :to="post.permalink ?? post.path" prefetch>{{ post.title }}</NuxtLink>
            </h2>

            <div v-if="!expanded" class="mt-7px c-ink2 text-[14.5px] leading-[1.8]">
                <span class="line-clamp-3">{{ excerpt }}</span>
                <button
                    class="ml-4px inline-flex cursor-pointer items-center gap-4px c-accent font-mono text-12px"
                    type="button"
                    @click="toggle(true)"
                >
                    展开
                </button>
            </div>

            <template v-else>
                <div v-if="loading" class="mt-7px c-muted text-13px">正在读取正文…</div>
                <div
                    v-else-if="doc"
                    class="prose is-embedded mt-16px border-t border-dashed border-line pt-16px text-15px"
                >
                    <MDCRenderer :body="(doc as any).body" :data="doc" />
                </div>
                <button
                    class="mt-18px block cursor-pointer c-accent font-mono text-10px hover:underline hover:underline-offset-3"
                    type="button"
                    @click="toggle(false)"
                >
                    收起全文
                </button>
            </template>

            <div v-if="post.tags?.length" class="mt-12px flex flex-wrap gap-6px">
                <TagList :tags="post.tags" />
            </div>
        </div>

        <footer class="ml-50px mt-14px flex items-center gap-14px c-faint font-mono text-10px lt-sm:ml-0">
            <span>{{ post.tags?.[0] ?? "笔记" }}</span>
            <NuxtLink class="ml-auto c-muted hover:c-accent" :to="post.permalink ?? post.path" prefetch>
                打开文章 <span aria-hidden="true">→</span>
            </NuxtLink>
        </footer>
    </article>
</template>
