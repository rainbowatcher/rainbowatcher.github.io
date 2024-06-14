<script lang="ts" setup>
const [_show, toggleShow] = useToggle(false)
</script>

<template>
    <div class="extra-container relative mla hidden px4 py1.5 transition-(opacity,width) duration-300 md:(flex flex-row flex-nowrap gap-2) [&>a,&_button]:op-75 [&>a:hover,&_button:hover]:op-100">
        <ColorModeToggler />
        <SearchBar title="Search" />
        <NuxtLink class="i-ph-twitter-logo bg-none" title="Twitter" href="https://x.com/_rainbowatcher" external target="_blank" rel="noreferrer" />
        <NuxtLink class="i-ph-github-logo bg-none" title="GitHub" href="https://github.com/rainbowatcher" external target="_blank" rel="noreferrer" />
    </div>
    <div class="hidden px4 py1.5 font-mb transition-opacity duration-300 lt-md:block [&>a,&_button]:(bg-none op-75) [&>a:hover,&_button:hover]:op-100" @click="toggleShow()">
        <NuxtLink>
            菜单
        </NuxtLink>
    </div>
</template>
