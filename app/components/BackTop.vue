<script lang="ts" setup>
const { y } = useWindowScroll({ behavior: "smooth" })
const [show, toggleShow] = useToggle(false)
const backToTop = () => y.value = 0
watch(y, () => {
    if (show.value) {
        if (y.value < 800) {
            toggleShow(false)
        }
    } else {
        if (y.value >= 800) {
            toggleShow(true)
        }
    }
})
</script>

<template>
    <Transition
        enter-active-class="animate-in-300 fade-in slide-in-from-bottom-10"
        leave-active-class="animate-out-300 fade-out slide-out-to-bottom-10"
    >
        <div v-if="show" class="watermark-border fixed bottom-8dvh z-99 flex" @click="backToTop">
            <i class="i-ph-arrow-fat-up-fill" />
        </div>
    </Transition>
</template>

<style lang="css">
.watermark-border {
    @apply lg:right-12 lt-sm:right-4 md:right-6 sm:right-4 xl:right-24;
    @apply c-background bg-neutral4/25;
    @apply [transition-property:background-color,color,opacity] duration-300 items-center rounded-full p1.5;
    @apply hover:(bg-neutral4/75 c-background before:blur-lg) hover:active:(bg-input c-background);
}

.watermark-border::before {
    content: '';
    @apply absolute inset-0 z-1 blur-xl;
    background: linear-gradient(45deg, hsl(var(--primary)), hsl(var(--primary)));
    background-blend-mode: overlay;
}
</style>
