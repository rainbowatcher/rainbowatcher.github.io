import { NuxtLink } from "#components"

type NavItemsPassThrough = {
    li?: string
    ol?: string
}

const NavItems = defineNuxtComponent({
    emits: ["navigator"],
    methods: {
        getActiveClasses(path: string) {
            return this.$route.path.startsWith(path) ? "text-shadow-lg text-shadow-color-foreground/38.2 op-100" : "op-45"
        },
    },
    name: "SiteNavItems",
    props: {
        navItems: {
            required: true,
            type: Array<{ label: string; path: string }>,
        },
        pt: {
            default: undefined,
            type: Object as PropType<NavItemsPassThrough>,
        },
    },
    render() {
        return (
            <>
                {this.navItems.map(item => (
                    <li>
                        <NuxtLink
                            class={`font-400 hover:(op-100) ${this.getActiveClasses(item.path)} ${this.pt?.li ?? ""}`}
                            onClick={() => { this.$emit("navigator") }}
                            to={item.path}
                        >
                            {item.label}
                        </NuxtLink>
                    </li>
                ))}
            </>
        )
    },
})

export default defineNuxtComponent({
    data() {
        return {
            navItems: [
                { label: "博客", path: "/posts" },
                { label: "在用", path: "/uses" },
                { label: "归档", path: "/archives" },
                { label: "项目", path: "/projects" },
            ],
        }
    },
    emits: ["navigator"],
    name: "SiteNav",
    props: {
        pt: {
            default: undefined,
            type: Object as PropType<NavItemsPassThrough>,
        },
        wrapper: {
            default: false,
            type: Boolean,
        },
    },
    render() {
        if (this.$props.wrapper) {
            return (
                <ol class={this.pt?.ol ?? ""}>
                    <NavItems
                        navItems={this.navItems}
                        onNavigator={() => { this.$emit("navigator") }}
                        pt={this.pt}
                    />
                </ol>
            )
        } else {
            return (
                <>
                    <NavItems
                        navItems={this.navItems}
                        pt={this.pt}
                    />
                </>
            )
        }
    },
})
