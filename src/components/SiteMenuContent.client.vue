<script lang="ts" setup>
import { useBodyScrollLock } from "radix-vue"

const show = defineModel<boolean>("show")
const toggleShow = useToggle(show)
const locked = useBodyScrollLock(show.value)
const toggleLock = useToggle(locked)
watch(() => show.value, () => {
    if (show.value) {
        toggleLock(true)
    } else {
        setTimeout(() => { toggleLock(false) }, 150)
    }
})
useEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape") {
        toggleShow(false)
    }
})
</script>

<template>
    <Transition
        class="transition-opacity duration-150"
        mode="in-out"
        enter-active-class="opacity-0 ease-in"
        enter-from-class="opacity-100"
        leave-active-class="opacity-100 ease-out"
        leave-to-class="opacity-0"
    >
        <div v-if="show" class="pointer-events-initial fixed inset-0 z-98 flex flex-(col wrap) gap-4 bg-neutral9/75 p4 backdrop-blur sm:px-8">
            <div class="menu-header flex flex-(row) !pr-[--scrollbar-width]">
                <div>test</div>
                <button class="ml-auto" @click="toggleShow(false)">
                    {{ $t("close") }}
                </button>
            </div>
            <div class="nav-items flex justify-center">
                <SiteNav :pt="{ ol: 'flex flex-row gap-4' }" wrapper />
            </div>
            <div class="appearance-items mt-auto flex flex-(row gap-4) items-center justify-center">
                <SiteAppearance />
                <SocailLinks />
            </div>
        </div>
    </Transition>
</template>

<style>

</style>
