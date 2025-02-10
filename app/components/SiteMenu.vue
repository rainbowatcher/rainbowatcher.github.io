<script lang="ts" setup>
const [show, toggleShow] = useToggle(false)
</script>

<template>
    <div class="menu-container hidden font-mb transition-opacity duration-300 lt-md:block">
        <button class="menu-trigger" @click="toggleShow(true)">
            菜单
        </button>

        <SiteMenuContent v-model:show="show" />
    </div>
</template>
