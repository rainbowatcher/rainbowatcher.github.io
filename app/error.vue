<script setup lang="ts">
/**
 * 做什么：错误页：404 与其它错误的统一落点，给出回首页与去博客的两个出口。
 * 状态与生命周期：error 由 Nuxt 注入（clearError 可清除）；组件按 statusCode 区分文案。
 * 取舍与不变量：标题用衬线大字号加巨型状态码，与站内其它页面的层级一致；
 * 不列出全部导航，避免错误页变成第二套首页。
 * 边界：不处理路由重定向与埋点。
 */
import type { NuxtError } from "#app"

const props = defineProps<{ error: NuxtError }>()

const isNotFound = computed(() => props.error.statusCode === 404)

useHead({ title: isNotFound.value ? "页面不存在 — Rainbow Watcher" : "出错了 — Rainbow Watcher" })
</script>

<template>
    <div class="wrap">
        <section class="flex min-h-56vh flex-col items-start justify-center py-60px">
            <span
                class="c-lineStrong font-serif text-[clamp(90px,18vw,190px)] font-700 tracking-[-0.06em] leading-[0.9]"
            >
                {{ error.statusCode }}
            </span>
            <h1 class="mt-18px font-serif text-30px">
                {{ isNotFound ? "这里没有你要找的页面" : "页面渲染时出了点问题" }}
            </h1>
            <p class="mt-8px c-muted text-13px">
                {{ isNotFound ? "地址可能拼错了，或者内容已经搬走。" : error.message }}
            </p>
            <div class="mt-24px flex flex-wrap items-center gap-12px">
                <button class="btn-primary" type="button" @click="clearError({ redirect: '/' })">
                    回到首页
                    <i class="i-ph-arrow-right text-16px" />
                </button>
                <button class="btn-ghost" type="button" @click="clearError({ redirect: '/posts' })">看所有文章</button>
            </div>
        </section>
    </div>
</template>
