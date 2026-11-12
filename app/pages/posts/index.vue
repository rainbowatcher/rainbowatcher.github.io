<script setup lang="ts">
/**
 * 做什么：博客列表页：时间流卡片、关键词搜索、主题筛选与分页。
 * 状态与生命周期：帖子与标签计数来自 useTagStats；关键词是本地状态，主题与页码写回路由 query，
 * 因此列表可分享、可前进后退；切换主题或改关键词时页码回到第 1 页。
 * 取舍与不变量：搜索只在已发布文章元数据（标题、摘要、标签）里做即时过滤，不请求全文；
 * 每页 8 篇，与原型一致。
 * 边界：不渲染文章详情（见 posts/[...post].vue），也不做主站全文搜索（见页头 DocSearch）。
 */
const route = useRoute()
const router = useRouter()
const { posts, tags } = useTagStats()
const pageSize = 8

const keyword = ref("")
const currentTag = computed(() => (typeof route.query.tag === "string" ? route.query.tag : ""))
const currentPage = computed(() => Math.max(1, Number(route.query.page ?? 1) || 1))

const sortedPosts = computed(() => [...posts.value].sort((a, b) => b.date.localeCompare(a.date)))

const filtered = computed(() => {
    const needle = keyword.value.trim().toLocaleLowerCase()
    return sortedPosts.value.filter((post) => {
        const tagOk =
            !currentTag.value ||
            (post.tags ?? []).some((tag) => tag.toLocaleLowerCase() === currentTag.value.toLocaleLowerCase())
        if (!tagOk) return false
        if (!needle) return true
        const haystack = `${post.title ?? ""} ${post.description ?? ""} ${post.subtitle ?? ""} ${(post.tags ?? []).join(" ")}`
        return haystack.toLocaleLowerCase().includes(needle)
    })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize)))
const page = computed(() => Math.min(currentPage.value, totalPages.value))
const pageItems = computed(() => filtered.value.slice((page.value - 1) * pageSize, page.value * pageSize))
const rangeFrom = computed(() => (filtered.value.length ? (page.value - 1) * pageSize + 1 : 0))
const rangeTo = computed(() => Math.min(filtered.value.length, page.value * pageSize))

const years = computed(() => sortedPosts.value.map((post) => post.date.slice(0, 4)).sort())
const yearSpan = computed(() => (years.value.length ? `${years.value[0]}—${years.value.at(-1)}` : ""))

const filterNote = computed(() => {
    if (currentTag.value) return `主题 ${currentTag.value}`
    if (keyword.value.trim()) return `“${keyword.value.trim()}”`
    return "全部主题"
})

function setPage(next: number) {
    router.push({ query: { ...route.query, page: String(next) } })
}

watch(keyword, () => {
    if (page.value !== 1) setPage(1)
})

useHead({ title: `博客 · ${posts.value.length} 篇 — Rainbow Watcher` })
</script>

<template>
    <div class="wrap view-enter">
        <PageHead
            eyebrow="Feed / Posts"
            title="博客"
            :meta="`${sortedPosts.length} POSTS · ${yearSpan}`"
            desc="想法、唠叨与长短不一的笔记。短的直接留在这里，长的可以展开，也可以进入正文。"
        />

        <div class="flex items-center gap-16px pt-22px lt-md:(flex-wrap gap-12px)">
            <label
                class="flex h-40px w-290px items-center gap-9px rounded-ctrl border border-line bg-surface px-12px transition-colors focus-within:border-accent lt-md:w-full"
            >
                <i class="i-ph-magnifying-glass flex-none c-muted text-15px" />
                <input
                    v-model="keyword"
                    class="w-full border-0 bg-transparent text-13px outline-none placeholder:c-faint"
                    type="search"
                    autocomplete="off"
                    aria-label="搜索文章"
                    :placeholder="`在 ${sortedPosts.length} 篇文章里搜索…`"
                />
                <button
                    v-if="keyword"
                    class="flex-none c-muted hover:c-ink"
                    type="button"
                    aria-label="清空搜索"
                    @click="keyword = ''"
                >
                    <i class="i-ph-x text-13px" />
                </button>
            </label>
            <span class="meta-mono ml-auto whitespace-nowrap lt-md:ml-0"
                >{{ filtered.length }} 篇 · {{ filterNote }}</span
            >
        </div>

        <div class="flex flex-wrap gap-7px pt-15px pb-18px lt-md:(flex-nowrap overflow-x-auto pb-12px)">
            <NuxtLink
                class="tag-pill h-28px px-11px text-11.5px"
                :class="{ 'border-accent bg-accentSoft c-accent': !currentTag }"
                to="/posts"
                prefetch
            >
                全部 {{ sortedPosts.length }}
            </NuxtLink>
            <NuxtLink
                v-for="[name, count] in tags"
                :key="name"
                class="tag-pill h-28px px-11px text-11.5px whitespace-nowrap"
                :class="{ 'border-accent bg-accentSoft c-accent': name === currentTag }"
                :to="{ path: '/posts', query: { tag: name } }"
                prefetch
            >
                {{ name }} <span class="ml-5px c-faint font-mono text-9.5px">{{ count }}</span>
            </NuxtLink>
        </div>

        <div v-if="pageItems.length" class="mx-auto max-w-760px border-t border-line" aria-live="polite">
            <PostCard v-for="post in pageItems" :key="post.path" :post="post" />
        </div>
        <div v-else class="border-b border-line py-70px text-center">
            <strong class="block font-serif text-24px">没有找到文章</strong>
            <p class="mt-6px c-muted text-13px">换一个关键词，或者清空主题筛选再试试。</p>
        </div>

        <Pager
            v-if="filtered.length"
            :current="page"
            :total="filtered.length"
            :total-pages="totalPages"
            :from="rangeFrom"
            :to="rangeTo"
            @change="setPage"
        />
    </div>
</template>
