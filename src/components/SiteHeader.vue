<template>
    <header class="lt-sm:window-like z-1 w-full flex flex-row flex-nowrap items-center justify-between py4 lt-sm:(sticky inset-x-0 top-0 px-4 backdrop-blur) md:(px-12 py-6) sm:(px-8) xl:py8" role="banner">
        <nav class="font-mb" role="navigation">
            <ol flex="~ row nowrap gap-x-6" class="select-none uppercase">
                <li>
                    <NuxtLink to="/" class="bg-none font-400 transition-opacity">
                        {{ $t("hero") }}
                    </NuxtLink>
                </li>
                <SiteNav :pt="{ li: 'hidden md:block' }" />
            </ol>
        </nav>
        <SiteHeaderExtra />
    </header>
</template>
