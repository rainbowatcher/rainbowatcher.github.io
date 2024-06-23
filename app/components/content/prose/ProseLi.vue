<template>
    <li class="relative [&+li]:mt2 [&>ol,&>ul]:mt2">
        <slot />
    </li>
</template>

<style lang="css">
li > input {
    @apply mr-2 h3.5 w3.5 appearance-none b b-border rounded bg-popover;
}

li > input:checked {
    @apply bg-accent;
}

li > input:checked::before {
    content: '\2713';
    display: block;
    text-align: center;
    color: var(--background);
    position: absolute;
    left: 0rem;
    top: 0rem;
}
</style>
