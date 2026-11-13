/** * 做什么：站点默认布局：顶部进度线 + 页头 + 主区域 + 页脚。 * 状态与生命周期：无自身状态；主区域 id="view"
供跳过链接与页内锚点定位。 * 取舍与不变量：布局只提供骨架与跳过链接，内容宽度由各页面的 wrap 决定； *
回到顶部入口由文章页右栏的 ArticleTocRail 提供，不再放全局浮动按钮。 * 边界：不定义页面内容、导航项与页脚内容。 */
<template>
    <ReadingProgress />
    <a class="skip-link" href="#view">跳到正文</a>
    <SiteHeader />
    <main id="view" class="flex flex-1 flex-col" role="main" tabindex="-1">
        <slot />
    </main>
    <SiteFooter />
</template>
