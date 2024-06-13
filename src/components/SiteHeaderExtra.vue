<script lang="ts" setup>
const [_show, toggleShow] = useToggle(false)
</script>

<template>
    <div class="extra-container relative mla hidden rounded-full bg-card px4 py1.5 op-75 transition-(opacity,width) duration-300 md:(flex flex-row flex-nowrap gap-2) hover:op-100">
        <!-- <div class="extra-inner flex flex-row flex-nowrap gap-2 rounded-full bg-card px4 py1.5"> -->
        <SearchBar title="Search" />
        <NuxtLink class="i-ph-twitter-logo bg-none" title="Twitter" href="https://x.com/_rainbowatcher" external target="_blank" rel="noreferrer" />
        <NuxtLink class="i-ph-github-logo bg-none" title="GitHub" href="https://github.com/rainbowatcher" external target="_blank" rel="noreferrer" />
        <ColorModeToggler />
        <!-- </div> -->
    </div>
    <div class="hidden rounded-full bg-card px4 py1.5 op-75 lt-md:block" @click="toggleShow()">
        <NuxtLink i-ph:list />
    </div>
</template>
