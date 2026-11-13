<!-- 做什么：表格外壳：滚动容器包住 MDC 输出的 table，边框、圆角与横向滚动见 .prose .table-scroll。 -->
<template>
    <div class="table-scroll">
        <table>
            <slot />
        </table>
    </div>
</template>
