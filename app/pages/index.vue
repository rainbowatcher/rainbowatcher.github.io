<script setup lang="ts">
/**
 * 做什么：首页：自我介绍、站点速览、最近更新、按主题浏览与联系区。
 * 状态与生命周期：文案取自 content/home.md 的 frontmatter（home-doc），计数与主题云来自
 * 内容集合（usePosts / useTagStats）；SSR 取一次，客户端导航复用同一份缓存。
 * 取舍与不变量：首屏只有一个主行动（开始阅读），社交入口降为次级按钮；
 * 统计口径为「已发布内容总数 / 主题总数 / 年跨度」，与知识库各分区口径一致。
 * 边界：不渲染 home.md 的正文（该文件已改为首页数据源），也不做筛选与分页。
 */
import { NAV_ITEMS } from "~/composables/useSiteNav"

const { documents, posts, tags } = useTagStats()
const { data: home } = await useAsyncData("home-doc", () => useDocument("/")())

function text(value: unknown, fallback = "") {
    return typeof value === "string" && value ? value : fallback
}

const hero = computed(() => ({
    contactText: text(home.value?.contactText, "文章之外，代码都放在 GitHub。如果你也在做类似的事，欢迎来打个招呼。"),
    contactTitle: text(home.value?.contactTitle, "偶尔写点东西，不常打扰。"),
    eyebrow: text(home.value?.eyebrow, "Personal log"),
    lede: text(
        home.value?.lede,
        "开发者，开源维护者。写 TypeScript、Rust、Python、Go，也折腾终端、网络和这个博客本身。",
    ),
    title: text(home.value?.title, "看彩虹的人"),
}))

const sortedPosts = computed(() => [...(posts.value ?? [])].sort((a, b) => b.date.localeCompare(a.date)))
const recent = computed(() => sortedPosts.value.slice(0, 6))
const latest = computed(() => sortedPosts.value[0])
const startYear = computed(() => {
    const years = documents.value
        .map((item) => String(item.date ?? "").slice(0, 4))
        .filter(Boolean)
        .sort()
    return years[0] ?? ""
})
const stats = computed(() => [
    { label: "篇内容", value: documents.value.length },
    { label: "个主题", value: tags.value.length },
    { label: "篇长文", value: posts.value?.length ?? 0 },
])

const latestEntry = computed(() =>
    latest.value
        ? { date: latest.value.date, title: latest.value.title ?? "", to: latest.value.permalink ?? latest.value.path }
        : undefined,
)

useHead({ title: "Rainbow Watcher — 看彩虹的人" })
</script>

<template>
    <div class="wrap view-enter">
        <section
            class="grid grid-cols-[minmax(0,1.35fr)_minmax(290px,0.65fr)] items-center gap-[clamp(36px,6vw,84px)] pt-[clamp(48px,7.5vw,88px)] pb-[clamp(34px,4vw,46px)] lt-lg:(grid-cols-1 gap-36px) lt-md:pt-38px"
        >
            <div class="relative z-2">
                <p class="eyebrow">{{ hero.eyebrow }}</p>
                <h1
                    class="mt-18px font-serif text-[clamp(48px,7.6vw,88px)] font-700 tracking-[-0.035em] leading-[1.02] lt-md:text-[clamp(44px,13vw,62px)]"
                >
                    {{ hero.title }}<span class="c-accent">。</span>
                </h1>
                <p class="lede mt-24px">{{ hero.lede }}</p>
                <div class="mt-30px flex flex-wrap items-center gap-12px">
                    <NuxtLink class="btn-primary" :to="NAV_ITEMS[0]!.path" prefetch>
                        开始阅读
                        <i class="i-ph-arrow-right text-16px" />
                    </NuxtLink>
                    <NuxtLink
                        class="btn-ghost"
                        to="https://github.com/rainbowatcher"
                        external
                        target="_blank"
                        rel="noreferrer"
                    >
                        GitHub
                        <i class="i-ph-arrow-up-right text-16px" />
                    </NuxtLink>
                </div>
                <p
                    class="mt-26px flex flex-wrap items-center gap-8px c-faint font-mono text-[10.5px] tracking-[0.03em]"
                >
                    <span>{{ documents.length }} 篇内容</span>
                    <span class="dot mx-3px" />
                    <span>{{ tags.length }} 个主题</span>
                    <span class="dot mx-3px" />
                    <span>{{ startYear ? `${startYear} 年起写作` : "持续更新" }}</span>
                </p>
            </div>

            <HomeStats :stats="stats" :latest="latestEntry" />
        </section>

        <section class="mt-[clamp(38px,5vw,58px)]" aria-labelledby="recent-title">
            <SectionHead index="01" title="最近更新" more-label="全部文章" more-to="/posts" />
            <div class="mt-8px">
                <PostRow
                    v-for="post in recent"
                    :key="post.path"
                    :date="post.date"
                    :excerpt="post.description ?? post.subtitle"
                    :tags="post.tags"
                    :title="post.title ?? ''"
                    :to="post.permalink ?? post.path"
                />
            </div>
        </section>

        <section class="mt-[clamp(38px,5vw,58px)]" aria-labelledby="topics-title">
            <SectionHead index="02" title="按主题浏览" more-label="在博客里筛选" more-to="/posts" />
            <TopicCloud :tags="tags" />
        </section>

        <section
            class="relative mt-[clamp(56px,8vw,92px)] flex items-center justify-between gap-32px overflow-hidden border border-line rounded-card bg-surface px-40px py-36px lt-md:(flex-col items-start gap-24px px-24px py-28px) after:(absolute -bottom-90px -right-40px h-260px w-260px rounded-full border-40px border-accentSoft content-[''] op-55 pointer-events-none)"
            aria-labelledby="contact-title"
        >
            <div>
                <p class="eyebrow">Stay in touch</p>
                <h2 class="mt-8px font-serif text-[clamp(24px,3vw,32px)] font-600 tracking-[-0.02em]">
                    {{ hero.contactTitle }}
                </h2>
                <p class="mt-8px max-w-34em c-muted text-13px">{{ hero.contactText }}</p>
            </div>
            <div class="relative z-1 flex flex-none flex-wrap items-center gap-12px">
                <NuxtLink
                    class="btn-primary"
                    to="https://github.com/rainbowatcher"
                    external
                    target="_blank"
                    rel="noreferrer"
                >
                    GitHub
                    <i class="i-ph-arrow-up-right text-16px" />
                </NuxtLink>
                <NuxtLink class="btn-ghost" to="https://x.com/_rainbowatcher" external target="_blank" rel="noreferrer">
                    X / Twitter
                    <i class="i-ph-arrow-up-right text-16px" />
                </NuxtLink>
            </div>
        </section>
    </div>
</template>
