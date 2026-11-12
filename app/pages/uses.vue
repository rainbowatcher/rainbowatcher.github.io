<script setup lang="ts">
/**
 * 做什么：/uses 在用页：左侧分区索引 + 右侧分区卡片，条目按「名称与说明 · 右对齐标签」成行。
 * 状态与生命周期：分区数据来自 content/uses.md 的 frontmatter（useDocument("/uses")），
 * 页面加载后读取一次；索引为页内锚点，不参与路由。
 * 取舍与不变量：条目结构（分区 id/title/note + items 的 name/desc/side/href）是内容契约，
 * 由 frontmatter 提供，因此新增工具只改 markdown，不改页面；窄屏索引降级为横向标签。
 * 边界：不渲染 markdown 正文，也不做筛选与排序。
 */
import type { UsesSection } from "~/types/content"

const { data: doc } = await useAsyncData("uses-doc", () => useDocument("/uses")())

/** frontmatter 是不定形状的 JSON，这里把 sections 收成结构化列表，形状契约见 types/content.ts。 */
function toSections(value: unknown): UsesSection[] {
    return Array.isArray(value) ? (value as UsesSection[]) : []
}

const sections = computed(() => toSections(doc.value?.sections))

useHead({ title: "在用 — Rainbow Watcher" })
</script>

<template>
    <div class="wrap view-enter">
        <PageHead
            eyebrow="Uses / Setup"
            title="在用"
            :meta="`${sections.length} SECTIONS`"
            desc="只列长期使用的工具，试用两周以内的不收入。链接指向官网或开源仓库，不含推广参数。"
        />

        <div class="grid grid-cols-[180px_minmax(0,1fr)] gap-[clamp(32px,6vw,72px)] pt-38px lt-lg:grid-cols-1">
            <nav
                class="sticky top-[calc(var(--header-h)+24px)] flex flex-col gap-3px self-start lt-lg:(static flex-row flex-wrap gap-6px pb-4px)"
                aria-label="分区索引"
            >
                <span class="mb-8px c-faint font-mono text-9px tracking-[0.14em] uppercase lt-lg:hidden">Sections</span>
                <a
                    v-for="section in sections"
                    :key="section.id"
                    class="py-5px c-muted text-12.5px hover:c-accent lt-lg:(rounded-full border border-line px-10px py-6px text-11px)"
                    :href="`#${section.id}`"
                >
                    {{ section.title }}
                </a>
            </nav>

            <div class="flex flex-col gap-42px">
                <section
                    v-for="section in sections"
                    :id="section.id"
                    :key="section.id"
                    class="scroll-mt-[calc(var(--header-h)+24px)]"
                >
                    <h2 class="mb-12px flex items-baseline gap-12px font-serif text-25px font-600 tracking-[-0.015em]">
                        {{ section.title }}
                        <span v-if="section.note" class="c-faint font-mono text-9px font-400 tracking-[0.1em]">{{
                            section.note
                        }}</span>
                    </h2>
                    <div class="rounded-media border border-line bg-surface px-20px py-2px">
                        <div
                            v-for="item in section.items"
                            :key="item.name"
                            class="flex items-baseline justify-between gap-24px border-t border-line py-13px first:border-t-0 lt-md:(flex-col gap-2px)"
                        >
                            <div class="min-w-0">
                                <NuxtLink
                                    v-if="item.href"
                                    class="text-14px font-600 hover:c-accent"
                                    :to="item.href"
                                    external
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {{ item.name }}
                                </NuxtLink>
                                <span v-else class="text-14px font-600">{{ item.name }}</span>
                                <p v-if="item.desc" class="mt-1px c-muted text-11.5px">{{ item.desc }}</p>
                            </div>
                            <span v-if="item.side" class="flex-none c-faint font-mono text-10px">{{ item.side }}</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>
