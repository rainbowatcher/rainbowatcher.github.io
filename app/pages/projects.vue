<script setup>
import { useMotionProperties, useSpring } from "@vueuse/motion"
import { ref } from "vue"

const box = ref(null)

const { motionProperties } = useMotionProperties(box, {
    x: 0,
    y: 0,
})

const { set, stop } = useSpring(motionProperties, {
    bounce: 0,
    duration: 1000,
})

function animate() {
    set({
        x: Math.random() * 400,
        y: Math.random() * 400,
    })
}
</script>

<template>
    <div class="container" tabindex="0" @keyup.esc="stop()">
        <div ref="box" class="box" @click="animate">
            Click me
        </div>
    </div>
</template>

<style scoped>
.container {
    width: 500px;
    height: 500px;
    outline: 2px solid #41B883;
}

.box {
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #41B883;
    color: white;
}
</style>
