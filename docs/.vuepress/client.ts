import Align from './components/Align.vue';
import { defineClientConfig } from '@vuepress/client'
import { addIcons } from 'oh-vue-icons'
import { setupDynamicStyle } from './composables'
import { RiBookMarkFill } from 'oh-vue-icons/icons'

addIcons(RiBookMarkFill)
export default defineClientConfig({
    enhance: ({ app, /* router, siteData */ }) => {
        app.component('Align', Align)
    },
    setup: () => {
        setupDynamicStyle()
    },
    rootComponents: []
})
