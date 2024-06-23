<script setup lang="ts">
const slots = useSlots()
const selectedIndex = ref(0)
const tabs = computed(() => slots.default?.().map((slot, index) => {
    return {
        component: slot,
        label: (slot.props?.meta && stringToKVPairs(slot.props.meta).get("label")) || slot.props?.filename || slot.props?.language || `${index}`,
    }
}) || [])
const selectedTab = computed(() => tabs.value.find((_, index) => index === selectedIndex.value))

function stringToKVPairs(str: string): Map<string, string> {
    const map = new Map<string, string>()
    const equalPairs = str.split(",")
    for (const p of equalPairs) {
        const [k, v] = p.split("=", 2)
        if (!k || !v) continue
        map.set(k, v)
    }
    return map
}
</script>

<template>
    <div class="code-group flow-root rounded-md space-y-2">
        <div class="inline-block flex flex-shrink flex-row overflow-auto rounded-lg bg-popover">
            <template
                v-for="(tab, index) in tabs"
                :key="index"
            >
                <button
                    class="m-1 px-4 py-1 text-sm focus:outline-none"
                    tabindex="-1"
                    :class="[selectedIndex === index ? 'font-medium rounded-lg text-primary-foreground bg-primary' : 'rounded-lg hover:bg-secondary/20']"
                    @click="selectedIndex = index"
                >
                    {{ tab.label }}
                </button>
            </template>
        </div>

        <div class="">
            <Component :is="selectedTab!.component" />
        </div>
    </div>
</template>
