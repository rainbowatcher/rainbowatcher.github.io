<script setup lang="ts">
import { joinURL, withLeadingSlash, withTrailingSlash } from "ufo"
import { computed, useRuntimeConfig } from "#imports"

const props = defineProps({
    alt: {
        default: "",
        type: String,
    },
    height: {
        default: undefined,
        type: [String, Number],
    },
    src: {
        default: "",
        type: String,
    },
    width: {
        default: undefined,
        type: [String, Number],
    },
})


const refinedSrc = computed(() => {
    if (props.src?.startsWith("/") && !props.src.startsWith("//")) {
        const _base = withLeadingSlash(withTrailingSlash(useRuntimeConfig().app.baseURL))
        if (_base !== "/" && !props.src.startsWith(_base)) {
            return joinURL(_base, props.src)
        }
    }
    return props.src
})
</script>

<template>
    <NuxtImg
        :src="refinedSrc"
        :alt="alt"
        :width="width"
        :height="height"
    />
</template>
