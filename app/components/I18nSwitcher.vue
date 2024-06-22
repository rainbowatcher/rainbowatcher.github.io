<script lang="ts" setup>
import {
    DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuRoot, DropdownMenuTrigger,
} from "radix-vue"

const { locale } = useI18n({ useScope: "global" })

const items = [
    { label: "简体中文", value: "cn" },
    { label: "English", value: "en" },
]

function handleClick(e: MouseEvent) {
    e.preventDefault()
    // this check is because when use setLocale in @click or @select the nuxt will crash
    // @ts-expect-error property not exist on EventTarget
    if (e.target?.textContent === "简体中文") {
        locale.value = "cn"
    } else {
        locale.value = "en"
    }
}
</script>

<template>
    <DropdownMenuRoot>
        <DropdownMenuTrigger class="leading-none">
            <i class="i-ph:translate" :title="$t('translate')" />
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
            <DropdownMenuContent
                :side-offset="5"
                class="z-99 b b-border rounded-lg bg-popover p2 shadow-md data-[state=open]:(animate-in fade-in zoom-in-97 slide-in-from-bottom-1) data-[state=closed]:(animate-out fade-out zoom-out-97 slide-out-to-bottom-1)"
            >
                <DropdownMenuItem
                    v-for="item in items"
                    :key="item.label"
                    class="relative h-6 w-full flex select-none items-center rounded px-6 text-sm leading-none outline-none data-[state=checked]:(bg-primary) data-[disabled]:op-50 data-[highlighted]:(ring-1 ring-ring) focus:(ring-1 ring-secondary)"
                    :text-value="item.label"
                    :value="item.value"
                    @click="handleClick"
                >
                    {{ item.label }}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenuPortal>
    </DropdownMenuRoot>
</template>
