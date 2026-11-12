<script lang="ts" setup>
/**
 * 做什么：/notes 索引页，把知识库条目按 section 分组列出（分组顺序见 utils/notes.ts）。
 * 状态与生命周期：数据来自 manifest.notes（仅元数据），渲染时按 route 读取一次。
 * 取舍与不变量：索引完全由 frontmatter 的 section 生成，不维护任何手写目录页；
 * 条目链接走 path（/notes/<slug>），改 date 不会断链。
 * 边界：不渲染正文（见 [...note].vue），不做搜索与标签过滤。
 */
import { groupNotes } from "~/utils/notes"

const { data: notes } = await useAsyncData("notes-list", useNotes())
const groups = computed(() => groupNotes(notes.value ?? []))
useShowup(".show-up", 25)
</script>

<template>
    <section class="font-mb">
        <div class="min-w-0 lt-sm:px-6 md:(ml-[calc(5rem+3rem)] w-5xl) sm:(ml-[calc(5rem+2rem)] max-w-3xl)">
            <header class="mb-8">
                <h1 class="mb-2 text-3xl font-600 font-mb">笔记</h1>
                <p class="text-sm c-muted leading-6">
                    长期维护的知识条目：会随手补充与修订，按主题分区而不按时间排列。文章在
                    <NuxtLink to="/posts" class="underline"> 博客 </NuxtLink>，一次性探索记录在
                    <NuxtLink to="/research" class="underline"> 研究 </NuxtLink>。
                </p>
            </header>
            <div v-if="groups.length" class="space-y-10">
                <section v-for="group in groups" :key="group.section" class="note-group">
                    <h2 class="mb-3 flex flex-(row nowrap) items-baseline gap-x-3 text-sm c-muted font-sans op-75">
                        <span>{{ group.section }}</span>
                        <span class="text-xs op-60">{{ group.items.length }} 条</span>
                    </h2>
                    <div class="space-y-3">
                        <div v-for="item in group.items" :key="item.path" class="show-up relative">
                            <NuxtLink class="text-lg font-400" :href="item.path" role="link" prefetch>
                                {{ item.title }}
                            </NuxtLink>
                            <p v-if="item.subtitle" class="text-sm c-muted leading-6">
                                {{ item.subtitle }}
                            </p>
                            <div class="flex flex-(row nowrap) gap-x-4">
                                <TagList :tags="item.tags" />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <p v-else class="c-muted">还没有笔记。</p>
        </div>
    </section>
</template>
