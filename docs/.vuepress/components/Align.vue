<script lang="ts" setup>
import { computed } from 'vue'
const props = defineProps<{
  place: 'center' | 'left' | 'right'
}>()

const styles = computed((): string => {
  if (props.place === 'center')
    return 'text-align: center'

  else if (props.place === 'left')
    return 'text-align: left'

  else if (props.place === 'right')
    return 'text-align: right'
  return ''
})
</script>

<template>
  <div :style="styles">
  <slot />
  </div>
</template>

<style scoped>

</style>
