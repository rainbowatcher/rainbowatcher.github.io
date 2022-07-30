import { computed, defineComponent, h, onMounted, reactive, ref } from 'vue'
import type { PropType, VNode } from 'vue'
import { loadNormal, loadReact, loadVue } from '../composables'
import {
  getCode,
  getNormalCode,
  getReactCode,
  getVueCode,
  injectCSS,
  injectScript,
} from '../utils'

import type { CodeDemoOptions } from '../../shared'
import { CODEPEN_SVG, JSFIDDLE_SVG, LOADING_SVG, TOGGLE_SVG } from './icons'

import 'balloon-css/balloon.css'
import '../styles/code-demo.scss'

declare const MARKDOWN_ENHANCE_DELAY: number

export default defineComponent({
  name: 'CodeDemo',

  props: {
    id: {
      type: String,
      required: true,
    },
    type: {
      type: String as PropType<'normal' | 'vue' | 'react'>,
      default: 'normal',
    },

    title: {
      type: String,
      default: '',
    },

    config: {
      type: String,
      default: '',
    },

    code: {
      type: String,
      required: true,
    },
  },

  setup(props, { slots }) {
    const isExpanded = ref(false)
    const demoWrapper = ref<HTMLDivElement | null>(null)
    const codeContainer = ref<HTMLDivElement | null>(null)
    const loaded = ref(false)

    const config = computed(
      () =>
        JSON.parse(
          decodeURIComponent(props.config || '{}'),
        ) as Partial<CodeDemoOptions>,
    )

    const codeType = computed(() => {
      const codeConfig = JSON.parse(
        decodeURIComponent(props.code || '{}'),
      ) as Record<string, string>

      return getCode(codeConfig)
    })

    const code = computed(() =>
      props.type === 'react'
        ? getReactCode(codeType.value, config.value)
        : props.type === 'vue'
          ? getVueCode(codeType.value, config.value)
          : getNormalCode(codeType.value, config.value),
    )

    const isLegal = computed(() => code.value.isLegal)
    const code_wrapper = reactive({
      overflow: 'hidden',
      height: '0',
    })

    const initDom = (innerHTML = false): void => {
      // attach a shadow root to demo

      const shadowRoot = demoWrapper.value!.attachShadow({ mode: 'open' })
      const appElement = document.createElement('div')

      appElement.classList.add('code-demo-app')
      shadowRoot.appendChild(appElement)

      if (isLegal.value) {
        if (innerHTML)
          appElement.innerHTML = code.value.html
        injectCSS(shadowRoot, code.value)
        injectScript(props.id, shadowRoot, code.value)

        code_wrapper.height = '0'
      }
      else { code_wrapper.height = 'auto' }

      loaded.value = true
    }

    const loadDemo = async (): Promise<void> => {
      switch (props.type) {
        case 'react': {
          await loadReact(code.value)
          return initDom()
        }
        case 'vue': {
          await loadVue(code.value)
          return initDom()
        }

        default: {
          await loadNormal(code.value)
          return initDom(true)
        }
      }
    }

    const codepen_data = JSON.stringify({
      html: code.value.html,
      js: code.value.js,
      css: code.value.css,

      js_external: code.value.jsLib.join(';'),

      css_external: code.value.cssLib.join(';'),
      layout: code.value.codepenLayout,

      html_pre_processor: codeType.value
        ? codeType.value.html[1]
        : 'none',

      js_pre_processor: codeType.value
        ? codeType.value.js[1]
        : code.value.jsx
          ? 'babel'
          : 'none',

      css_pre_processor: codeType.value
        ? codeType.value.css[1]
        : 'none',
      editors: code.value.codepenEditors,
    })

    onMounted(() => {
      setTimeout(() => {
        loadDemo()
      }, MARKDOWN_ENHANCE_DELAY)
    })

    return (): VNode =>
      h('div', { class: 'code-demo-wrapper', id: props.id }, [
        h('div', { class: 'code-demo-header' }, [
          code.value.isLegal
            ? h('button', {
              class: ['toggle-button', isExpanded.value ? 'down' : 'right'],
              onClick: () => {
                isExpanded.value = !isExpanded.value
                if (isExpanded.value) {
                  code_wrapper.height = `${codeContainer.value!.clientHeight + 13.8}px`
                  setTimeout(() => {
                    code_wrapper.overflow = 'visible'
                  }, 200)
                }
                else {
                  code_wrapper.overflow = 'hidden'
                  setTimeout(() => {
                    code_wrapper.height = '0'
                  }, 100)
                }
              },
              innerHTML: TOGGLE_SVG,
            })
            : null,
          props.title
            ? h('span', { class: 'title' }, decodeURIComponent(props.title))
            : null,

          code.value.isLegal && code.value.jsfiddle !== false
            ? h(
              'form',
              {
                class: 'code-demo-jsfiddle',
                target: '_blank',
                action: 'https://jsfiddle.net/api/post/library/pure/',
                method: 'post',
              },
              [
                h('input', {
                  type: 'hidden',
                  name: 'html',
                  value: code.value.html,
                }),
                h('input', {
                  type: 'hidden',
                  name: 'js',
                  value: code.value.js,
                }),
                h('input', {
                  type: 'hidden',
                  name: 'css',
                  value: code.value.css,
                }),
                h('input', { type: 'hidden', name: 'wrap', value: '1' }),
                h('input', { type: 'hidden', name: 'panel_js', value: '3' }),
                h('input', {
                  type: 'hidden',
                  name: 'resources',
                  value: [...code.value.cssLib, ...code.value.jsLib].join(
                    ',',
                  ),
                }),
                h('button', {
                  'type': 'submit',
                  'class': 'jsfiddle-button',
                  'innerHTML': JSFIDDLE_SVG,
                  'aria-label': 'JSFiddle',
                  'data-balloon-pos': 'up',
                }),
              ],
            )
            : null,

          !code.value.isLegal || code.value.codepen !== false
            ? h(
              'form',
              {
                class: 'code-demo-codepen',
                target: '_blank',
                action: 'https://codepen.io/pen/define',
                method: 'post',
              },
              [
                h('input', {
                  type: 'hidden',
                  name: 'data',
                  value: codepen_data,
                }),
                h('button', {
                  'type': 'submit',
                  'innerHTML': CODEPEN_SVG,
                  'class': 'codepen-button',
                  'aria-label': 'Codepen',
                  'data-balloon-pos': 'up',
                }),
              ],
            )
            : null,
        ]),

        loaded.value
          ? null
          : h('div', {
            class: ['loading'],
            innerHTML: LOADING_SVG,
          }),

        h('div', {
          ref: demoWrapper,
          class: 'code-demo-container',
          style: {
            display: isLegal.value && loaded.value ? 'block' : 'none',
          },
        }),

        h(
          'div',
          { class: 'code-demo-code-wrapper', style: { height: code_wrapper.height, overflow: code_wrapper.overflow } },
          h(
            'div',
            {
              ref: codeContainer,
              class: 'code-demo-codes',
            },
            // eslint-disable-next-line dot-notation
            slots['default']?.(),
          ),
        ),
      ])
  },
})
