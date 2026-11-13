/**
 * 做什么：站点导航项的唯一来源（Note：与 queryContents 的 useNavItems 区分，避免同名冲突），页头主导航与移动端抽屉共用同一份顺序与文案。
 * 状态与生命周期：静态数据 + 当前路由计算，无副作用。
 * 取舍与不变量：顺序即信息层级（博客 → 经验 → 探索 → 知识 → 在用 → 项目），也对应文章生命周期；
 * 高亮按路由前缀判定，`/posts/<slug>` 这类内页仍高亮所属分区。
 * 边界：不渲染任何标记，也不负责抽屉的开关。
 */
export type NavItem = {
    label: string
    path: string
}

export const NAV_ITEMS: NavItem[] = [
    { label: "博客", path: "/posts" },
    { label: "经验", path: "/experience" },
    { label: "探索", path: "/explore" },
    { label: "知识", path: "/knowledge" },
    { label: "在用", path: "/uses" },
    { label: "项目", path: "/projects" },
]

export function useSiteNav() {
    const route = useRoute()

    function isActive(path: string) {
        return route.path === path || route.path.startsWith(`${path}/`)
    }

    return { isActive, navItems: NAV_ITEMS }
}
