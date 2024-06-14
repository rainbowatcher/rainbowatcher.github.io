<script lang="ts" setup>
const { y } = useWindowScroll({ behavior: "smooth" })
const show = ref("hidden")
const backToTop = () => y.value = 0
watch(y, () => {
    if (show.value === "flex") {
        if (y.value < 800) {
            setTimeout(() => show.value = "hidden", 300)
            show.value = "flex op0"
        }
    } else {
        if (y.value >= 800) {
            show.value = "flex"
        }
        return
    }
})
</script>

<template>
    <div
        class="watermark-border fixed bottom-4dvh right-8dvw z-99"
        :class="[show]" style="--un-animate-duration:500ms" @click="backToTop"
    >
        <i i-line-md-arrow-up />
    </div>
</template>

<style lang="css">
.watermark-border {
    @apply [transition-property:background-color,color,opacity] duration-300 items-center rounded-full p1.5;
    @apply animate-in fade-in slide-in-from-bottom-10;
    /* @apply bg-ring; */
    @apply bg-transparent;
    @apply hover:(bg-secondary c-secondary-foreground before:blur-lg) hover:active:(bg-input c-background);
    /* background-size: 400%; */
}

.watermark-border::before {
    content: '';
    @apply absolute inset-0 z-1 blur-xl;
    background: linear-gradient(45deg, var(--background), var(--primary));
    background-blend-mode: overlay;
}
</style>
