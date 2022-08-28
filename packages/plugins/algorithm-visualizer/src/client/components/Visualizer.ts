/* eslint-disable no-console */
// <script setup lang="ts">
import type { VNode } from 'vue'
import { computed, defineComponent, h, onMounted, ref } from 'vue'
import * as echarts from 'echarts/core'
import type { Command } from '../composables'
import type { ChartOption, Data } from '../types'
import { sleep } from '../utils'

export default defineComponent({
  setup() {
    const props = defineProps<{
      options: string
      commands: string
    }>()

    const container = ref()
    let chart: echarts.ECharts
    const _options = computed(() => JSON.parse(decodeURIComponent(props.options)) as ChartOption)
    const _commands = computed(() => JSON.parse(decodeURIComponent(props.commands)) as Array<Command>)

    onMounted(() => {
      chart = echarts.init(container.value, 'vintage', { renderer: 'canvas' })
      chart.setOption({ ..._options })
    })

    let current_cmd_idx = 0
    let previous_command_args: number[] = []
    const delay_level = ref(2)
    const delay_ms = computed(() => 800 / delay_level.value)
    let _data = [..._options.value.series[0].data ?? []]
    let canceled = false
    const cmd_count = props.commands.length

    const select = (data: Array<number | Data>, color: string) => {
      if (previous_command_args.length > 0)
        restore(data)

      const cmd = _commands.value[current_cmd_idx]

      for (const idx of cmd.args) {
        const value = data[idx] as number
        data[idx] = { value, itemStyle: { color } }
      }
      previous_command_args = cmd.args
    }

    function restore(data: Array<number | Data>) {
      for (const idx of previous_command_args) {
        if (typeof data[idx] === 'object')
          data[idx] = (data[idx] as Data).value
      }
    }

    const swap = (data: Array<number | Data>, left: number, right: number) => {
      const tmp = data[left]
      data[left] = data[right]
      data[right] = tmp
    }

    const swapAction = (cmd: Command) => {
      const [left, right] = cmd.args
      select(_data, '#a4a')
      swap(_data, left, right)
    }

    const mapActions = () => {
      const cmd = _commands.value[current_cmd_idx]
      switch (cmd.type) {
        case 'select':
          select(_data, 'blue')
          break
        case 'swap': {
          swapAction(cmd)
          break
        }
        default:
          break
      }
    }

    // button

    const next = () => {
      const reach_end = current_cmd_idx >= cmd_count
      if (reach_end && _data.every(item => typeof item === 'number')) {
        return
      }
      else if (reach_end) {
        restore(_data)
      }
      else {
        mapActions()
        console.log(props.commands[current_cmd_idx])
        current_cmd_idx++
      }
      chart.setOption({ series: { data: _data } })
    }

    const previous = () => {
      if (current_cmd_idx > 0) {
        current_cmd_idx--
      }
      else {
        restore(_data)
        chart.setOption({ series: { data: _data } })
        return
      }
      console.log(props.commands[current_cmd_idx])
      mapActions()
      chart.setOption({ series: { data: _data } })
    }

    const play = async () => {
      canceled = false
      for (let i = 0; i < _commands.value.length; i++) {
        if (canceled)
          return
        // if (current_cmd_idx > cmd_count) return
        next()
        await sleep(delay_ms.value)
      }
      // next()
    }

    const reset = () => {
      canceled = true
      chart.setOption(_options.value)
      // chart.dispatchAction({ type: 'restore' })
      _data = [..._options.value.series[0].data ?? []]
      current_cmd_idx = 0
    }

    return (): VNode =>
      h('div', { class: 'algorithm-visualizer' }, [
        h('div', {},
          h('cavans', { id: 'myChart', ref: 'container', width: '600', height: '400' }),
        ),
        h('div', { class: 'btn-group' }, [
          h('button', { onClick: previous, innerHTML: 'previous' }),
          h('button', { onClick: next, innerHTML: 'next' }),
          h('button', { onClick: play, innerHTML: 'play' }),
          h('button', { onClick: reset, innerHTML: 'reset' }),
        ]),
        h('input', { value: delay_level, type: 'range', max: 8, min: 1, list: 'marks' }),
        h('datalist', { id: 'marks' }, [
          h('option', { value: '1' }),
          h('option', { value: '2' }),
          h('option', { value: '3' }),
          h('option', { value: '4' }),
          h('option', { value: '5' }),
          h('option', { value: '6' }),
          h('option', { value: '7' }),
          h('option', { value: '8' }),
        ]),
        h('p', { innerHTML: `倍速 ${delay_level.value}` }),
      ],
      )
  },
})

// </script>

// <template>
//   <div>
//     <canvas id="myChart" ref="container" width="600" height="400" />
//   </div>
//   <div style="display: flex;justify-content: center;">
//     <div class="btn-group">
//       <button :onclick="previous()">
//         previous
//       </button>
//       <button :onclick="next">
//         next
//       </button>
//       <button :onclick="play">
//         play
//       </button>
//       <button :onclick="reset">
//         reset
//       </button>
//     </div>
//     <input v-model="delay_level" type="range" max="8" min="1" list="marks">
//     <datalist id="marks">
//       <option value="1" />
//       <option value="2" />
//       <option value="3" />
//       <option value="4" />
//       <option value="5" />
//       <option value="6" />
//       <option value="7" />
//       <option value="8" />
//     </datalist>
//     <p>倍速：{{ delay_level }}</p>
//     <main :arg="`hello:${bar}`" />
//   </div>
// </template>
