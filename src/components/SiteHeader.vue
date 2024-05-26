<script lang="ts" setup>
const isDark = useDark({})
const toggleDark = useToggle(isDark)
const route = useRoute()
const navItems = [
    { label: "Rainbow watcher", path: "/" },
    { label: "Blog", path: "/posts" },
    { label: "Uses", path: "/uses" },
    { label: "Projects", path: "/projects" },
]
</script>

<template>
    <header class="w-full flex flex-row flex-nowrap items-center justify-between md:px-12 md:py-4 xl:py8">
        <nav class="">
            <ol flex="~ row nowrap gap-x-6" class="select-none uppercase">
                <li v-for="{ label, path } in navItems" :key="label">
                    <a
                        :class="{ active: route.fullPath.startsWith(path) }"
                        class="hidden op-30 md:inline-block [&.active]:op-100 active:op-100 focus:op-100 hover:op-100" :href="path"
                    >
                        {{ label }}
                    </a>
                </li>
            </ol>
        </nav>
        <div class="mla hidden items-center rounded-full bg-secondary px4 py2 md:flex">
            <i :class="isDark ? 'i-ph:moon-bold' : 'i-ph:sun-dim-bold'" class="inline-block cursor-pointer op-75 transition-opacity hover:op-100" @click="toggleDark()" />
        </div>
    </header>
</template>
