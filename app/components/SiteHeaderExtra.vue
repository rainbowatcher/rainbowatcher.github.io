<template>
    <div class="extra-container relative mla hidden px4 py1.5 transition-(opacity,width) duration-300 md:(flex flex-row flex-nowrap gap-2) [&>a,&_button]:op-75 [&>a:hover,&_button:hover]:op-100">
        <ColorModeToggler />
        <SearchBar />
        <!-- <I18nSwitcher /> -->
        <NuxtLink class="bg-none leading-none" title="Twitter" to="https://x.com/_rainbowatcher" external target="_blank">
            <i class="i-ph-twitter-logo" />
        </NuxtLink>
        <NuxtLink class="bg-none leading-none" title="GitHub" to="https://github.com/rainbowatcher" external target="_blank">
            <i class="i-ph-github-logo" />
        </NuxtLink>
    </div>
    <SiteMenu />
</template>
