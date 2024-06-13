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
    <button class="i-line-md-sun-rising-loop dark:i-line-md-moon-filled-alt-loop cursor-pointer" title="Toggle dark mode" @click="toggleDark()" />
</template>
