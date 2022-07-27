<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import type { PropType } from 'vue'
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
import { CODEPEN_SVG, JSFIDDLE_SVG, LOADING_SVG } from './icons'

import 'balloon-css/balloon.css'
import '../styles/code-demo.scss'

const props = defineProps({
  id: { type: String, required: true },
  type: {
    type: String as PropType<'normal' | 'vue' | 'react'>,
    default: 'normal',
  },
  title: { type: String, default: '' },
  config: { type: String, default: '' },

  code: { type: String, required: true },
})

const MARKDOWN_ENHANCE_DELAY = ref(0)

const isExpanded = ref(false)
const demoWrapper = ref<HTMLDivElement | null>(null)
const codeContainer = ref<HTMLDivElement | null>(null)
const height = ref('0')
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

    height.value = '0'
  }
  else { height.value = 'auto' }

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

const expand = () => {
  height.value = isExpanded.value
    ? '0'
    : `${codeContainer.value!.clientHeight + 13.8}px`
  isExpanded.value = !isExpanded.value
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
  }, MARKDOWN_ENHANCE_DELAY.value)
})
</script>

<template>
  <div :id="props.id" class="code-demo-wrapper">
    <div v-if="loaded.value" class="loading" />
    {{ LOADING_SVG }}
  </div>
  <div class="code-demo-header">
    <button class="toggle-button" :class="isExpanded.value ? 'down' : 'right'" @click="expand" />
  </div>
  <span :class="props.title ? null : 'title'">
    {{ props.title }}
  </span>
  <form
    v-if="code.value.isLegal && code.value.jsfiddle !== false" class="code-demo-jsfiddle" target="_blank"
    action="https://jsfiddle.net/api/post/library/pure/" method="post"
  >
    <input type="hidden" name="html" :value="code.value.html">
    <input type="hidden" name="js" :value="code.value.js">
    <input type="hidden" name="css" :value="code.value.css">
    <input type="hidden" name="wrap" :value="1">
    <input type="hidden" name="panel_js" :value="3">
    <input type="hidden" name="resources" :value="[...code.value.cssLib, ...code.value.jsLib].join(',')">
    <button type="submit" class="jsfiddle-button" aria-label="JSFiddle" data-ballon-pos="up">
      {{ JSFIDDLE_SVG }}
    </button>
  </form>
  <form
    v-if="!code.value.isLegal || code.value.codepen !== false" class="code-demo-codepen" target="_blank"
    action="https://codepen.io/pen/define" method="post"
  >
    <input type="hidden" name="data" :value="codepen_data">
    <button type="submit" class="codepen-button" aria-label="Codepen" data-ballon-pos="up">
      {{ CODEPEN_SVG }}
    </button>
  </form>
  <div
    :ref="demoWrapper" class="code-demo-container"
    :style="{ display: isLegal.value && loaded.value ? 'block' : 'none' }"
  />
  <div class="code-demo-code-wrapper" :style="{ height: height.value }">
    <div :ref="codeContainer">
      <slot />
    </div>
  </div>
</template>

<style scoped>
</style>
