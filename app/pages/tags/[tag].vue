<script setup lang="ts">
/**
 * 做什么：/tags/<tag> 页：列出该标签下的博客、知识、探索、经验与研究，并给出全部标签的切换入口。
 * 状态与生命周期：标签计数与五个集合来自 useTagStats；当前标签取自路由参数，随路由切换重算。
 * 取舍与不变量：五类内容共用同一套标签页，避免内容页的标签链接成为死路；
 * 分组顺序固定为博客 → 知识 → 探索 → 经验 → 研究，各组内按日期倒序。
 * 边界：不区分大小写之外的标签归一化，也不做分页。
 */
import { getRouteParamAsString } from "~/utils/route"

const route = useRoute("tags-tag")
const { experience, explore, hasTag, knowledge, posts, research, tags } = useTagStats()
const currentTag = computed(() => getRouteParamAsString(route, "tag")?.toLocaleLowerCase() ?? "")

function byDate<T extends { date?: string }>(list: T[]) {
    return [...list].sort((a, b) => new Date(b.date ?? 0).valueOf() - new Date(a.date ?? 0).valueOf())
}

const matchedPosts = computed(() => byDate(posts.value.filter(hasTag(currentTag.value))))
const matchedKnowledge = computed(() => byDate(knowledge.value.filter(hasTag(currentTag.value))))
const matchedExplore = computed(() => byDate(explore.value.filter(hasTag(currentTag.value))))
const matchedExperience = computed(() => byDate(experience.value.filter(hasTag(currentTag.value))))
const matchedResearch = computed(() => byDate(research.value.filter(hasTag(currentTag.value))))
const total = computed(
    () =>
        matchedPosts.value.length +
        matchedKnowledge.value.length +
        matchedExplore.value.length +
        matchedExperience.value.length +
        matchedResearch.value.length,
)

useHead({ title: `#${currentTag.value} · ${total.value} 条 — Rainbow Watcher` })
</script>

<template>
    <div class="wrap view-enter">
        <PageHead
            eyebrow="Tag / Cross collections"
            :title="`#${currentTag}`"
            :meta="`${total} ENTRIES`"
            desc="同一标签下的全部内容：博客、知识、探索、经验与研究放在一起看。"
        >
            <div class="mt-20px flex flex-wrap gap-7px">
                <TagList :tags="tags" :active="currentTag" class="h-28px px-11px text-11.5px" />
            </div>
        </PageHead>

        <section v-if="matchedPosts.length" class="mt-30px">
            <div class="flex items-baseline gap-12px border-t border-line pt-18px">
                <span class="c-accent font-mono text-10px tracking-[0.08em]">01</span>
                <h2 class="section-title">博客</h2>
                <span class="c-faint font-mono text-9.5px">{{ matchedPosts.length }} 篇</span>
            </div>
            <PostRow
                v-for="post in matchedPosts"
                :key="post.path"
                :date="post.date"
                :excerpt="post.description ?? post.subtitle"
                :tags="post.tags"
                :title="post.title ?? ''"
                :to="post.permalink ?? post.path"
            />
        </section>

        <section v-if="matchedKnowledge.length" class="mt-30px">
            <div class="flex items-baseline gap-12px border-t border-line pt-18px">
                <span class="c-accent font-mono text-10px tracking-[0.08em]">02</span>
                <h2 class="section-title">知识</h2>
                <span class="c-faint font-mono text-9.5px">{{ matchedKnowledge.length }} 条</span>
            </div>
            <PostRow
                v-for="item in matchedKnowledge"
                :key="item.path"
                :date="item.date"
                :excerpt="item.subtitle ?? item.description"
                :tags="item.tags"
                :title="item.title"
                :to="item.path"
            />
        </section>

        <section v-if="matchedExplore.length" class="mt-30px">
            <div class="flex items-baseline gap-12px border-t border-line pt-18px">
                <span class="c-accent font-mono text-10px tracking-[0.08em]">03</span>
                <h2 class="section-title">探索</h2>
                <span class="c-faint font-mono text-9.5px">{{ matchedExplore.length }} 篇</span>
            </div>
            <PostRow
                v-for="item in matchedExplore"
                :key="item.path"
                :date="item.date"
                :excerpt="item.description ?? item.subtitle"
                :tags="item.tags"
                :title="item.title"
                :to="item.path"
            />
        </section>

        <section v-if="matchedExperience.length" class="mt-30px">
            <div class="flex items-baseline gap-12px border-t border-line pt-18px">
                <span class="c-accent font-mono text-10px tracking-[0.08em]">04</span>
                <h2 class="section-title">经验</h2>
                <span class="c-faint font-mono text-9.5px">{{ matchedExperience.length }} 篇</span>
            </div>
            <PostRow
                v-for="item in matchedExperience"
                :key="item.path"
                :date="item.date"
                :excerpt="item.summary ?? item.description"
                :tags="item.tags"
                :title="item.title"
                :to="item.path"
            />
        </section>

        <section v-if="matchedResearch.length" class="mt-30px">
            <div class="flex items-baseline gap-12px border-t border-line pt-18px">
                <span class="c-accent font-mono text-10px tracking-[0.08em]">05</span>
                <h2 class="section-title">研究</h2>
                <span class="c-faint font-mono text-9.5px">{{ matchedResearch.length }} 篇</span>
            </div>
            <PostRow
                v-for="item in matchedResearch"
                :key="item.path"
                :date="item.date"
                :excerpt="item.summary ?? item.description ?? item.subtitle"
                :tags="item.tags"
                :title="item.title"
                :to="item.path"
            />
        </section>

        <p v-if="!total" class="py-40px c-muted">这个标签下还没有内容。</p>
    </div>
</template>
