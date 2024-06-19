<template>
    <header class="w-full flex flex-row flex-nowrap items-center justify-between py4 lt-sm:(px-4) md:(px-12 py-6) sm:(px-8) xl:py8" role="banner">
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
