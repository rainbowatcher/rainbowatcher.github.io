<script lang="ts" setup>
const color = useColorMode()

function toggleDark() {
    color.preference = color.value === "dark" ? "light" : "dark"
}

const preferDark = usePreferredDark()
watch(preferDark, (newVal) => {
    color.preference = newVal === false ? "light" : "dark"
})
</script>

<template>
    <button class="leading-none" title="Dark mode" @click="toggleDark()">
        <i class="i-ph-sun dark:i-ph-moon" />
    </button>
</template>
