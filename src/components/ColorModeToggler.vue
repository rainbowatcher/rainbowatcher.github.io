<script lang="ts" setup>
const color = useColorMode()

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
</script>

<template>
    <button class="leading-none" title="Dark mode" @click="toggleDark()">
        <i class="dark:i-ph-moon i-ph-sun" />
    </button>
</template>
