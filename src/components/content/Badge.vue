<script lang="ts" setup>
defineProps({
    text: {
        default: "",
        required: false,
        type: String,
    },
    type: {
        default: "tip",
        required: false,
        type: String,
    },
    vertical: {
        default: undefined,
        required: false,
        type: String,
    },
})
</script>

<template>
    <span
        class="inline-block rounded-full px-1 vertical-top text-sm color-foreground outline [&.danger]:bg-[#F87171] [&.info]:bg-[#60A5FA] [&.tip]:bg-[#4ADE80] [&.warning]:bg-[#FACC15]" :class="[type]" :style="{
            verticalAlign: vertical,
        }"
    >
        <slot>{{ text }}</slot>
    </span>
</template>

<style lang="css">
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
