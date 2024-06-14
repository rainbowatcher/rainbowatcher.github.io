<script lang="ts" setup>
const route = useRoute()

const getActiveClasses = (path: string) => (route.path.startsWith(path) ? "bg-[size:100%_0.75em] op-100" : "op-30")
const navItems = [
    { label: "博客", path: "/posts" },
    { label: "在用", path: "/uses" },
    { label: "归档", path: "/archives" },
    { label: "项目", path: "/projects" },
]
</script>

<template>
    <header class="w-full flex flex-row flex-nowrap items-center justify-between py4 lt-sm:(px-4) md:(px-12 py-6) sm:(px-8) xl:py8" role="banner">
        <nav class="font-mb" role="navigation">
            <ol flex="~ row nowrap gap-x-6" class="select-none uppercase">
                <li>
                    <NuxtLink to="/" class="bg-none font-400">
                        看彩虹的人
                    </NuxtLink>
                </li>
                <li v-for="{ label, path } in navItems" :key="label">
                    <NuxtLink
                        :class="[getActiveClasses(path)]"
                        class="hidden font-400 op75 transition-opacity md:inline-block hover:op-100" :href="path"
                    >
                        {{ label }}
                    </NuxtLink>
                </li>
            </ol>
        </nav>
        <SiteHeaderExtra />
    </header>
</template>
