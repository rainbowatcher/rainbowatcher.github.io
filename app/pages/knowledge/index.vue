<script setup lang="ts">
/**
 * 做什么：/knowledge 索引页：按 frontmatter 的 section 分组列出知识条目。
 * 状态与生命周期：条目来自 manifest.knowledge（仅元数据）；分组顺序与详情页的前后篇顺序同源（utils/knowledge.ts）。
 * 取舍与不变量：索引完全由 frontmatter 的 section 生成，不维护手写目录；行式列表与博客列表共用 PostRow，
 * 保证同一套「日期—标题—主题—箭头」的阅读节奏。
 * 边界：不渲染正文（见 knowledge/[...knowledge].vue），也不做搜索与标签过滤。
 */
import { groupKnowledge } from "~/utils/knowledge"

const { data: knowledge } = await useAsyncData("knowledge-list", useKnowledge())
const groups = computed(() => groupKnowledge(knowledge.value ?? []))
const total = computed(() => knowledge.value?.length ?? 0)

useHead({ title: `知识 · ${total.value} 条 — Rainbow Watcher` })
</script>

<template>
    <div class="wrap view-enter">
        <PageHead
            eyebrow="Knowledge / Long-term"
            title="知识"
            :meta="`${total} ENTRIES`"
            desc="长期维护的知识条目：会随手补充与修订，按主题分区而不按时间排列。一次性的实地记录放在探索，成篇的唠叨在博客。"
        />

        <div v-if="groups.length" class="pt-8px">
            <section v-for="(group, index) in groups" :key="group.section" class="mt-30px">
                <div class="flex items-baseline gap-12px border-t border-line pt-18px">
                    <span class="c-accent font-mono text-10px tracking-[0.08em]">{{
                        String(index + 1).padStart(2, "0")
                    }}</span>
                    <h2 class="section-title">{{ group.section }}</h2>
                    <span class="c-faint font-mono text-9.5px tracking-[0.08em]">{{ group.items.length }} 条</span>
                    <NuxtLink
                        class="ml-auto inline-flex items-center gap-5px c-muted text-12px hover:c-accent"
                        :to="{ path: '/posts', query: { tag: group.section } }"
                        prefetch
                    >
                        相关文章
                        <i class="i-ph-arrow-up-right text-14px" />
                    </NuxtLink>
                </div>
                <div class="mt-8px">
                    <PostRow
                        v-for="item in group.items"
                        :key="item.path"
                        :date="item.date"
                        :excerpt="item.subtitle ?? item.description"
                        :tags="item.tags"
                        :title="item.title"
                        :to="item.path"
                    />
                </div>
            </section>
        </div>
        <p v-else class="py-40px c-muted">还没有知识条目。</p>
    </div>
</template>
