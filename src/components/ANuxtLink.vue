<script setup lang="ts">
const props = defineProps<{
    href?: string
    to?: string
}>()

const router = useRouter()

const delay = ref(200) // 阈值时间，单位毫秒

// 模拟阈值逻辑：点击后延迟一定时间再执行跳转
function handleClick() {
    setTimeout(() => {
        const link = props.href ?? props.to
        if (link) {
            router.push(link)
        }
    }, delay.value)
}
</script>

<template>
    <NuxtLink :href="href ?? to" @click.prevent="handleClick">
        <slot />
    </NuxtLink>
</template>
