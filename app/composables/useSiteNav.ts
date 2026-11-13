/**
 * 做什么：站点导航项的唯一来源（Note：与 queryContents 的 useNavItems 区分，避免同名冲突），页头主导航与移动端抽屉共用同一份顺序与文案。
 * 状态与生命周期：静态数据 + 当前路由计算，无副作用。
 * 取舍与不变量：分三层（博客｜探索 · 经验 · 知识｜在用 · 项目）即信息层级：写与读分开，站点信息最后；
 * 展示处按组渲染即可画出分隔，`NAV_ITEMS` 是分组拍平的结果，只读顺序的场合（如首页首屏按钮）用它。
 * 高亮按路由前缀判定，`/posts/<slug>` 这类内页仍高亮所属分区。
 * 边界：不渲染任何标记，也不负责抽屉的开关。
 */
export type NavItem = {
    label: string
    path: string
}

export const NAV_GROUPS: NavItem[][] = [
    [{ label: "博客", path: "/posts" }],
    [
        { label: "探索", path: "/explore" },
        { label: "经验", path: "/experience" },
        { label: "知识", path: "/knowledge" },
    ],
    [
        { label: "在用", path: "/uses" },
        { label: "项目", path: "/projects" },
    ],
]

export const NAV_ITEMS: NavItem[] = NAV_GROUPS.flat()

export function useSiteNav() {
    const route = useRoute()

    function isActive(path: string) {
        return route.path === path || route.path.startsWith(`${path}/`)
    }

    return { isActive, navGroups: NAV_GROUPS, navItems: NAV_ITEMS }
}
