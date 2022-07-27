import { defineClientConfig } from '@vuepress/client'
import { addIcons } from 'oh-vue-icons'
import Align from './components/Align.vue'
import { RiBookMarkFill } from 'oh-vue-icons/icons'
addIcons(RiBookMarkFill)

export default defineClientConfig({
    enhance: ({app})=>{
        app.component('Align', Align)
    }
})
