<script lang="ts" setup>
const { y } = useWindowScroll({ behavior: "smooth" })
const show = ref("hidden")
const backToTop = () => y.value = 0
watch(y, () => {
    if (show.value === "flex") {
        if (y.value < 800) {
            setTimeout(() => show.value = "hidden", 300)
            show.value = "flex transition-opacity duration-300 op0"
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
        class="[transition-property:background-color,color] fixed bottom-8 right-14 z-99 items-center rounded-full bg-ring p1.5 duration-300 animate-in fade-in slide-in-from-bottom-10 hover:(bg-secondary c-secondary-foreground) hover:active:(bg-input c-background)"
        :class="[show]" @click="backToTop"
    >
        <i i-line-md-arrow-up />
    </div>
</template>

<style>

</style>
