<script lang="ts" setup>
const route = useRoute()

const getActiveClasses = (path: string) => (route.path.startsWith(path) ? "bg-[size:100%_0.75em] op-100" : "op-30")
const navItems = [
    { label: "blog", path: "/posts" },
    { label: "uses", path: "/uses" },
    { label: "archives", path: "/archives" },
    { label: "projects", path: "/projects" },
]
</script>

<template>
    <header class="w-full flex flex-row flex-nowrap items-center justify-between py4 lt-sm:(px-4) md:(px-12 py-6) sm:(px-8) xl:py8" role="banner">
        <nav class="font-mb" role="navigation">
            <ol flex="~ row nowrap gap-x-6" class="select-none uppercase">
                <li>
                    <NuxtLink to="/" class="bg-none font-400 transition-opacity">
                        {{ $t("hero") }}
                    </NuxtLink>
                </li>
                <li v-for="{ label, path } in navItems" :key="label">
                    <NuxtLink
                        :class="[getActiveClasses(path)]"
                        class="hidden font-400 op75 transition-opacity md:inline-block hover:op-100" :href="path"
                    >
                        {{ $t(label) }}
                    </NuxtLink>
                </li>
            </ol>
        </nav>
        <SiteHeaderExtra />
    </header>
</template>
