<script lang="ts" setup>
import { useBodyScrollLock } from "radix-vue"

const show = defineModel<boolean>("show")
const toggleShow = useToggle(show)
const locked = useBodyScrollLock(show.value)
const toggleLock = useToggle(locked)
watch(() => show.value, () => {
    toggleLock(show.value)
})
useEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape") {
        toggleShow(false)
    }
})
</script>

<template>
    <Teleport to="body">
        <Transition
            enter-active-class="animate-in-300 fade-in slide-in-from-bottom-2"
            leave-active-class="animate-out-300 fade-out slide-out-to-bottom-2"
        >
            <div v-if="show" class="pointer-events-initial fixed inset-0 z-98 flex flex-col gap-4 bg-popover/85 py4 font-mb backdrop-blur lt-sm:px4 sm:px-8">
                <div class="menu-header flex flex-(row)">
                    <div>test</div>
                    <button class="ml-auto" @click="toggleShow(false)">
                        关闭
                    </button>
                </div>
                <div class="nav-items flex justify-center">
                    <SiteNav :pt="{ ol: 'flex flex-row gap-4' }" wrapper @navigator="toggleShow(false)" />
                </div>
                <div class="appearance-items mt-auto flex flex-(row gap-4) items-center justify-center">
                    <SiteAppearance />
                    <SocailLinks />
                </div>
            </div>
        </Transition>
    </Teleport>
</template>
