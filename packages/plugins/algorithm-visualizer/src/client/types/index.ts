type AxisType = 'category' | 'time' | 'log' | 'value'

interface Data {
  value: number
  itemStyle: {
    color: string
  }
}

interface ChartOption {
  xAxis: {
    type: AxisType
    data: Array<unknown>
    axisLine?: {
      show: boolean
    }
    axisTick?: {
      show: boolean
    }
  }
  yAxis: {
    type: AxisType
    axisLine?: {
      show: boolean
    }
    axisTick?: {
      show: boolean
    }
    splitLine?: {
      show: boolean
    }
  }
  series: [
    {
      data: Array<Data | number> | undefined
      type: string
      [key: string]: unknown
    },
  ]
  [key: string]: unknown
}

export { ChartOption, Data }
