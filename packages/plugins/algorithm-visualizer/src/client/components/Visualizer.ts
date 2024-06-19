/* eslint-disable unicorn/filename-case */
/* eslint-disable ts/naming-convention */
// <script setup lang="ts">
import * as echarts from "echarts/core"
import {
    computed, defineComponent, h, onMounted, ref,
} from "vue"
import { sleep } from "../utils"
import type { Command } from "../composables"
import type { ChartOption, Data } from "../types"
import type { VNode } from "vue"

export default defineComponent({
    setup() {
        const props = defineProps<{
            commands: string
            options: string
        }>()

        const container = ref()
        let chart: echarts.ECharts
        const _options = computed(() => JSON.parse(decodeURIComponent(props.options)) as ChartOption)
        const _commands = computed(() => JSON.parse(decodeURIComponent(props.commands)) as Command[])

        onMounted(() => {
            chart = echarts.init(container.value, "vintage", { renderer: "canvas" })
            chart.setOption({ ..._options })
        })

        let currentCmdIdx = 0
        let previousCommandArgs: number[] = []
        const delayLevel = ref(2)
        const delayMs = computed(() => 800 / delayLevel.value)
        let _data = [..._options.value.series[0].data ?? []]
        let canceled = false
        const cmdCount = props.commands.length

        const select = (data: Array<Data | number>, color: string) => {
            if (previousCommandArgs.length > 0) restore(data)

            const cmd = _commands.value[currentCmdIdx]

            for (const idx of cmd.args) {
                const value = data[idx] as number
                data[idx] = { itemStyle: { color }, value }
            }
            previousCommandArgs = cmd.args
        }

        function restore(data: Array<Data | number>) {
            for (const idx of previousCommandArgs) {
                if (typeof data[idx] === "object") data[idx] = (data[idx] as Data).value
            }
        }

        // eslint-disable-next-line unicorn/consistent-function-scoping
        const swap = (data: Array<Data | number>, left: number, right: number) => {
            const tmp = data[left]
            data[left] = data[right]
            data[right] = tmp
        }

        const swapAction = (cmd: Command) => {
            const [left, right] = cmd.args
            select(_data, "#a4a")
            swap(_data, left, right)
        }

        const mapActions = () => {
            const cmd = _commands.value[currentCmdIdx]
            switch (cmd.type) {
                case "select": {
                    select(_data, "blue")
                    break
                }
                case "swap": {
                    swapAction(cmd)
                    break
                }
                default: {
                    break
                }
            }
        }

        // button

        const next = () => {
            const reach_end = currentCmdIdx >= cmdCount
            if (reach_end && _data.every(item => typeof item === "number")) {
                return
            } else if (reach_end) {
                restore(_data)
            } else {
                mapActions()
                console.log(props.commands[currentCmdIdx])
                currentCmdIdx++
            }
            chart.setOption({ series: { data: _data } })
        }

        const previous = () => {
            if (currentCmdIdx > 0) {
                currentCmdIdx--
            } else {
                restore(_data)
                chart.setOption({ series: { data: _data } })
                return
            }
            console.log(props.commands[currentCmdIdx])
            mapActions()
            chart.setOption({ series: { data: _data } })
        }

        const play = async () => {
            canceled = false
            for (let i = 0; i < _commands.value.length; i++) {
                if (canceled) return

                // if (current_cmd_idx > cmd_count) return
                next()
                // eslint-disable-next-line no-await-in-loop
                await sleep(delayMs.value)
            }

            // next()
        }

        const reset = () => {
            canceled = true
            chart.setOption(_options.value)

            // chart.dispatchAction({ type: 'restore' })
            _data = [..._options.value.series[0].data ?? []]
            currentCmdIdx = 0
        }

        return (): VNode => h("div", { class: "algorithm-visualizer" }, [
            h("div", {}, h("cavans", {
                height: "400", id: "myChart", ref: "container", width: "600",
            })),
            h("div", { class: "btn-group" }, [
                h("button", { innerHTML: "previous", onClick: previous }),
                h("button", { innerHTML: "next", onClick: next }),
                h("button", { innerHTML: "play", onClick: play }),
                h("button", { innerHTML: "reset", onClick: reset }),
            ]),
            h("input", {
                list: "marks", max: 8, min: 1, type: "range", value: delayLevel,
            }),
            h("datalist", { id: "marks" }, [
                h("option", { value: "1" }),
                h("option", { value: "2" }),
                h("option", { value: "3" }),
                h("option", { value: "4" }),
                h("option", { value: "5" }),
                h("option", { value: "6" }),
                h("option", { value: "7" }),
                h("option", { value: "8" }),
            ]),
            h("p", { innerHTML: `倍速 ${delayLevel.value}` }),
        ])
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
