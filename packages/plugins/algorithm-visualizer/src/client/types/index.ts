type AxisType = "category" | "log" | "time" | "value"

type Data = {
    itemStyle: {
        color: string
    }
    value: number
}

type ChartOption = {
    [key: string]: unknown
    series: [
        {
            [key: string]: unknown
            data: Array<Data | number> | undefined
            type: string
        },
    ]
    xAxis: {
        axisLine?: {
            show: boolean
        }
        axisTick?: {
            show: boolean
        }
        data: unknown[]
        type: AxisType
    }
    yAxis: {
        axisLine?: {
            show: boolean
        }
        axisTick?: {
            show: boolean
        }
        splitLine?: {
            show: boolean
        }
        type: AxisType
    }
}

export type { ChartOption, Data }
