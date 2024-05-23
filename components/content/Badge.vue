<script lang="ts" setup>
defineProps({
    type: {
        type: String,
        required: false,
        default: "tip",
    },
    text: {
        type: String,
        required: false,
        default: "",
    },
    vertical: {
        type: String,
        required: false,
        default: undefined,
    },
})
</script>

<template>
    <span
        class="color-forground inline-block rounded-md vertical-top text-sm [&.danger]:bg-[#F87171] [&.tip]:bg-[#4ADE80] [&.warning]:bg-[#FACC15]" :class="[type]" :style="{
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
