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
        class="watermark-border fixed bottom-8dvh z-99 lg:right-12 lt-sm:right-4 md:right-6 sm:right-4 xl:right-24"
        :class="[show]" style="--un-animate-duration:500ms" @click="backToTop"
    >
        <i class="i-ph-arrow-fat-up-fill" />
    </div>
</template>

<style lang="css">
.watermark-border {
    @apply c-background bg-neutral4/25;
    @apply [transition-property:background-color,color,opacity] duration-500 items-center rounded-full p1.5;
    @apply animate-in fade-in slide-in-from-bottom-10;
    @apply hover:(bg-neutral4/75 c-secondary-foreground before:blur-lg) hover:active:(bg-input c-background);
}

.watermark-border::before {
    content: '';
    @apply absolute inset-0 z-1 blur-xl;
    background: linear-gradient(45deg, var(--background), var(--primary));
    background-blend-mode: overlay;
}
</style>
