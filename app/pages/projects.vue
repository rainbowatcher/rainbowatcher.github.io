<script setup lang="ts">
/**
 * 做什么：/projects 项目页：两列卡片展示维护中的开源项目，末尾补一张「更多仓库」卡片。
 * 状态与生命周期：项目数据来自 content/projects.md 的 frontmatter（useDocument("/projects")），
 * 页面加载后读取一次。
 * 取舍与不变量：不展示 star 数等易过期指标，只保留状态、简介与技术标签；
 * 归档与实验性仓库不进列表，由 content 里的人工筛选决定。
 * 边界：不生成项目详情页，卡片链接直达外部仓库。
 */
import type { ProjectItem } from "~/types/content"

const { data: doc } = await useAsyncData("projects-doc", () => useDocument("/projects")())

/** frontmatter 是不定形状的 JSON，这里把 projects 收成结构化列表，形状契约见 types/content.ts。 */
function toProjects(value: unknown): ProjectItem[] {
    return Array.isArray(value) ? (value as ProjectItem[]) : []
}

const projects = computed(() => toProjects(doc.value?.projects))
const description = computed(() => (typeof doc.value?.description === "string" ? doc.value.description : ""))

useHead({ title: `项目 · ${projects.value.length} 个 — Rainbow Watcher` })
</script>

<template>
    <div class="wrap view-enter">
        <PageHead
            eyebrow="Projects / Open source"
            title="项目"
            :meta="`${projects.length} REPOS`"
            :desc="description"
        />

        <div class="grid grid-cols-2 gap-18px pt-36px lt-md:grid-cols-1">
            <article
                v-for="project in projects"
                :key="project.name"
                class="flex min-h-220px flex-col rounded-card border border-line bg-surface p-25px transition-all hover:(border-lineStrong shadow-[var(--shadow-2)] -translate-y-2px) lt-md:min-h-0"
            >
                <div class="flex items-start justify-between gap-12px">
                    <span
                        class="grid h-40px w-40px place-items-center rounded-[11px] bg-accentSoft c-accent font-serif text-18px font-700"
                        aria-hidden="true"
                    >
                        {{ project.mark ?? project.name.slice(0, 2).toUpperCase() }}
                    </span>
                    <span
                        v-if="project.status"
                        class="inline-flex items-center gap-6px c-muted font-mono text-9px tracking-[0.06em] before:(h-5px w-5px rounded-full bg-accent content-[''])"
                    >
                        {{ project.status }}
                    </span>
                </div>

                <h2 class="mt-18px card-title">{{ project.name }}</h2>
                <p v-if="project.description" class="mt-7px c-muted text-12.5px leading-[1.7]">
                    {{ project.description }}
                </p>

                <div class="mt-auto flex items-end justify-between gap-12px pt-22px">
                    <div v-if="project.tags?.length" class="flex flex-wrap gap-5px">
                        <TagList :tags="project.tags" class="h-22px px-8px text-9.5px" />
                    </div>
                    <NuxtLink
                        class="inline-flex flex-none items-center gap-5px c-accent text-11.5px font-600 hover:underline hover:underline-offset-3"
                        :to="project.href"
                        external
                        target="_blank"
                        rel="noreferrer"
                    >
                        仓库
                        <i class="i-ph-arrow-up-right text-13px" />
                    </NuxtLink>
                </div>
            </article>

            <a
                class="flex flex-col items-start justify-center rounded-card border border-dashed border-lineStrong p-25px c-muted text-13px"
                href="https://github.com/rainbowatcher?tab=repositories"
                target="_blank"
                rel="noreferrer"
            >
                这里只放仍在维护的项目，归档与实验性仓库不列。
                <span class="mt-8px inline-flex items-center gap-6px c-accent font-600">
                    去 GitHub 看看
                    <i class="i-ph-arrow-up-right text-14px" />
                </span>
            </a>
        </div>
    </div>
</template>
