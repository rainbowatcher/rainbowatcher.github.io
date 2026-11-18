<script setup lang="ts">
/**
 * 做什么：文章类页面的统一骨架：文章头 + 正文与右侧目录两栏 + 文末相邻导航。
 * 状态与生命周期：目录状态由 useArticleToc 在此持有一次，再分发给右栏与窄屏折叠目录；
 * 正文渲染后采集标题，故窄屏目录在无标题（如纯列表页内容）时自动不渲染。
 * 取舍与不变量：博客、知识、探索、经验共用同一套排版，差异只通过 kicker、banner 与
 * 返回入口传入，避免四份模板各自漂移；正文宽度在宽屏为「容器 - 168px 目录安全边距」。
 * 边界：不取数据、不决定前后篇顺序（由各页面的集合顺序给出）。
 */
import ProseCodeInline from "~/components/content/ProseCodeInline.vue"
import type { ContentDocument } from "~/types/content"
import { readingMinutes } from "~/utils/reading"

const props = defineProps<{
    back: { label: string; to: string }
    banner?: { lead: string; text: string }
    doc: ContentDocument
    fallbackLabel: string
    fallbackTo: string
    kicker?: string
    next?: { title: string; to: string }
    previous?: { title: string; to: string }
}>()

const { activeId, headings, scrollTo } = useArticleToc("#articleBody")
const minutes = computed(() => readingMinutes(props.doc.body))
const tags = computed(() => props.doc.tags ?? [])
</script>

<template>
    <div class="wrap view-enter">
        <ArticleHead
            :back-label="back.label"
            :back-to="back.to"
            :banner="banner"
            :date="doc.date"
            :kicker="kicker"
            :minutes="minutes"
            :subtitle="doc.subtitle"
            :tags="tags"
            :title="doc.title ?? ''"
        />

        <div class="relative pt-[clamp(16px,2.5vw,28px)]">
            <article class="min-w-0 lg:max-w-[calc(100%-168px)]">
                <ArticleTocMobile :active-id="activeId" :headings="headings" @select="scrollTo" />
                <div id="articleBody" class="prose">
                    <MDCRenderer :body="(doc as any).body" :data="doc" :components="{ code: ProseCodeInline }" />
                </div>
            </article>

            <ArticleTocRail :active-id="activeId" :headings="headings" @select="scrollTo" />
        </div>

        <PrevNext :fallback-label="fallbackLabel" :fallback-to="fallbackTo" :next="next" :previous="previous" />
    </div>
</template>
