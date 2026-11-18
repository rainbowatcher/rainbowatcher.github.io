<script setup lang="ts">
/**
 * 做什么：博客时间流卡片：日期行、标题、两行摘要、可原地展开的全文与标签。
 * 状态与生命周期：点击摘要或「展开」后按需取正文（useDocument），收起保留已取到的文档，
 * 避免重复请求；展开状态是本地 UI 状态，不写路由，刷新后回到摘要态。
 * 取舍与不变量：摘要来自构建期生成的纯文本 excerpt（构建模块截 160 字），
 * 列表态钳制两行，保证时间流一屏多读几篇；全文用与详情页同一套 .prose 排版并加
 * is-embedded 去掉 h2 顶部细线，保证「原地读」与「进详情页」看到的正文一致。
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
const to = computed(() => props.post.permalink ?? props.post.path)
const excerpt = computed(() => props.post.excerpt ?? props.post.description ?? props.post.subtitle ?? "")
</script>

<template>
    <article class="border-b border-line py-20px" :class="{ 'is-expanded': expanded }">
        <header class="flex items-center gap-10px">
            <time class="c-muted font-mono text-10px leading-[1.4]" :datetime="post.date">{{ dateLabel }}</time>
            <NuxtLink
                class="ml-auto flex items-center gap-4px c-faint transition-colors hover:c-accent"
                :to="to"
                :aria-label="`打开《${post.title}》`"
                title="打开文章"
                prefetch
            >
                <i class="i-ph-arrow-up-right text-14px" />
            </NuxtLink>
        </header>

        <div>
            <h2 class="mt-12px font-serif text-22px font-600 tracking-[-0.015em] leading-[1.35] lt-sm:text-20px">
                <NuxtLink class="hover:c-accent" :to="to" prefetch>{{ post.title }}</NuxtLink>
            </h2>

            <div v-if="!expanded" class="mt-6px flex items-end gap-14px">
                <button
                    class="min-w-0 flex-1 cursor-pointer text-left c-ink2 text-[14px] leading-[1.8] line-clamp-2 transition-colors hover:c-ink"
                    type="button"
                    :aria-label="`展开《${post.title}》全文`"
                    @click="toggle(true)"
                >
                    {{ excerpt }}
                </button>
                <button
                    class="flex-none cursor-pointer pb-2px c-accent font-mono text-11px transition-colors hover:c-accentStrong"
                    type="button"
                    @click="toggle(true)"
                >
                    展开
                </button>
            </div>

            <template v-else>
                <div v-if="loading" class="mt-6px c-muted text-13px">正在读取正文…</div>
                <div
                    v-else-if="doc"
                    class="prose is-embedded mt-14px border-t border-dashed border-line pt-16px text-15px"
                >
                    <MDCRenderer :body="(doc as any).body" :data="doc" />
                </div>
                <button
                    class="mt-16px block cursor-pointer c-accent font-mono text-10px hover:underline hover:underline-offset-3"
                    type="button"
                    @click="toggle(false)"
                >
                    收起全文
                </button>
            </template>

            <div v-if="post.tags?.length" class="mt-10px flex flex-wrap gap-6px">
                <TagList :tags="post.tags" />
            </div>
        </div>
    </article>
</template>
