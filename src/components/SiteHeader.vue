<script lang="ts" setup>
const color = useColorMode()
const route = useRoute()

useHead({
    meta: [{
        content: () => (color.value === "dark" ? "#123549" : "#eeeeee"),
        id: "theme-color",
        name: "theme-color",
    }],
})

function toggleDark() {
    color.preference = color.value === "dark" ? "light" : "dark"
}

const navItems = [
    { label: "Blog", path: "/posts" },
    { label: "Uses", path: "/uses" },
    { label: "Archives", path: "/archives" },
    { label: "Projects", path: "/projects" },
]
</script>

<template>
    <header class="w-full flex flex-row flex-nowrap justify-between md:px-12 md:py-4 xl:py8">
        <nav class="">
            <ol flex="~ row nowrap gap-x-6" class="select-none uppercase">
                <li>
                    <NuxtLink to="/" class="bg-none font-400">
                        Rainbow watcher
                    </NuxtLink>
                </li>
                <li v-for="{ label, path } in navItems" :key="label">
                    <NuxtLink
                        :class="{ active: route.fullPath.startsWith(path) }"
                        class="hidden font-400 op-30 md:inline-block [&.active]:(bg-[size:100%_0.75em] op-100) focus:(bg-[size:100%_0.75em] op-100) hover:op-100" :href="path"
                    >
                        {{ label }}
                    </NuxtLink>
                </li>
            </ol>
        </nav>
        <div class="mla hidden gap-2 rounded-full bg-card px4 py2 op-75 transition-opacity duration-300 md:(flex flex-row flex-nowrap) hover:op-100">
            <a class="i-line-md:twitter bg-none" href="https://x.com/_rainbowatcher" target="_blank" rel="noreferrer" />
            <a class="i-line-md:github bg-none" href="https://github.com/rainbowatcher" target="_blank" rel="noreferrer" />
            <i :class="$colorMode.value === 'dark' ? 'i-line-md-moon-filled-alt-loop' : 'i-line-md-sun-rising-loop'" class="cursor-pointer" @click="toggleDark()" />
        </div>
    </header>
</template>
