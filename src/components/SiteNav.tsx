import { NuxtLink } from "#components"

type NavItemsPassThrough = {
    li?: string
    ol?: string
}

const NavItems = defineNuxtComponent({
    methods: {
        getActiveClasses(path: string) {
            return this.$route.path.startsWith(path) ? "bg-[size:100%_0.75em] op-100" : "op-45"
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
                            class={`font-400 transition-opacity hover:op-100 ${this.getActiveClasses(item.path)} ${this.pt?.li || ""}`}
                            to={item.path}
                        >
                            {this.$t(item.label)}
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
                { label: "blog", path: "/posts" },
                { label: "uses", path: "/uses" },
                { label: "archives", path: "/archives" },
                { label: "projects", path: "/projects" },
            ],
        }
    },
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
                <ol class={this.pt?.ol || ""}>
                    <NavItems
                        navItems={this.navItems}
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
