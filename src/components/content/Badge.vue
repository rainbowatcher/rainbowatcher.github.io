<script lang="ts" setup>
type BadgeType = "danger" | "info" | "note" | "tip" | "warning"

defineProps({
    text: {
        default: "",
        required: false,
        type: String,
    },
    type: {
        default: "tip",
        required: false,
        type: String as PropType<BadgeType>,
    },
    vertical: {
        default: undefined,
        required: false,
        type: String as PropType<"bottom" | "middle" | "top">,
    },
})
</script>

<template>
    <span
        class="text-semibold badge inline-block select-none rounded-full bg-slate5/20 px-2 py.5 v-text-bottom text-sm" :class="[type]" :style="{
            verticalAlign: vertical,
        }"
    >
        <slot>{{ text }}</slot>
    </span>
</template>

<style lang="css">
.badge {
    @apply [&.danger]:(bg-destructive c-destructive-foreground);
    @apply [&.info]:(bg-popover c-popover-foreground);
    @apply [&.tip]:(bg-primary c-primary-foreground);
    @apply [&.warning]:(bg-accent c-accent-foreground);
}
/* .badge {
   display: inline-block;
   font-size: 14px;
   height: 1.25rem;
   line-height: 1.25rem;
   border-radius: .25rem;
   padding: 0 .35rem;
   vertical-align: top;
   color: rgba(38, 38, 38, 1);

   &.tip {
     background-color: rgba(74, 222, 128, 1);
   }

   &.warning {
     background-color: rgba(250, 204, 21, 1);
   }

   &.danger {
     background-color: rgba(248, 113, 113, 1);
   }

   .table-of-contents & {
     vertical-align: middle;
   }

   &+& {
     margin-left: 5px;
   }
 }

 .badge-dot {
   height: 1rem;
 }
*/
</style>
