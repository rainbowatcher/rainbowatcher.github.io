<template>
    <SiteHeader />
    <main class="flex flex-1 flex-col" role="main">
        <slot />
        <BackTop />
    </main>
    <SiteFooter />
</template>
