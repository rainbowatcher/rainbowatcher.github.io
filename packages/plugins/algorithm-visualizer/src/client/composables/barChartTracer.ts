import { Commander } from "./commander"
import type { ChartOption } from "../types"

export type CommandType = "select" | "swap"

class Array1DTracer extends Commander {

    // eslint-disable-next-line ts/naming-convention
    private _data: number[] | undefined

    public random(capability: number, max = 10, min = 1) {
        this._data = Array.from({ length: capability })
            .map(() => Math.floor(Math.random() * max + min))
    }

    select(...args: number[]) {
        super.command("select", args)
    }

    public set(array: number[]) {
        this._data = [...array]
    }

    // deselect(...args: number[]) {
    //   super.command("downplay", args, "highlight")
    // }

    swap(...args: number[]) {
        super.command("swap", args)
    }

    toJson(): ChartOption {
        const len = this._data?.length
        const xAxisData = Array.from({ length: len! }, (_v, k) => k.toString())
        return {
            // silent: true
            animation: false,
            barCategoryGap: "10%",

            // grid: {
            //   left: '3%',
            //   right: '3%',
            //   bottom: '3%',
            //   containLabel: true
            color: "gray",

            // },
            series: [
                {
                    data: this._data,
                    name: "data",
                    type: "bar",

                    // emphasis: {
                    //   itemStyle: {
                    //     color: 'blue'
                    //   }
                    // },
                    // select: {
                    //   itemStyle: {
                    //     color: '#a3a',
                    //   }
                    // }
                },
            ],
            tooltip: {
                axisPointer: {
                    type: "none",
                },
                trigger: "axis",
            },
            xAxis: {
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                data: [...xAxisData],
                type: "category",
            },

            // 禁用鼠标交互
            yAxis: {
                splitLine: {
                    show: false,
                },
                type: "value",
            },
        }
    }

    public get data() {
        return this._data ? [...this._data] : []
    }

}

export { Array1DTracer as BarChartTracer }
