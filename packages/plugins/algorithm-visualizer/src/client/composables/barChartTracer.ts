import type { ChartOption } from '../types'
import { Commander } from './commander'

export type CommandType = 'swap' | 'select'

class Array1DTracer extends Commander {
  private _data: Array<number> | undefined

  public random(capability: number, max = 10, min = 1) {
    this._data = Array.from({ length: capability })
      .map(() => Math.floor((Math.random() * max) + min))
  }

  public set(array: number[]) {
    this._data = [...array]
  }

  select(...args: number[]) {
    super.command('select', args)
  }

  // deselect(...args: number[]) {
  //   super.command("downplay", args, "highlight")
  // }

  swap(...args: number[]) {
    super.command('swap', args)
  }

  public get data() {
    return this._data ? [...this._data] : []
  }

  toJson(): ChartOption {
    const len = this._data?.length
    const xAxisData = Array.from({ length: len! }, (_v, k) => k.toString())
    return {
      xAxis: {
        type: 'category',
        data: [...xAxisData],
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        type: 'value',
        splitLine: {
          show: false,
        },
      },
      // grid: {
      //   left: '3%',
      //   right: '3%',
      //   bottom: '3%',
      //   containLabel: true
      // },
      series: [
        {
          name: 'data',
          data: this._data,
          type: 'bar',
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
        trigger: 'axis',
        axisPointer: {
          type: 'none',
        },
      },
      color: 'gray',
      barCategoryGap: '10%',
      // 禁用鼠标交互
      // silent: true
      animation: false,
    }
  }
}

export { Array1DTracer as BarChartTracer }
