import { BarChart } from "@/components/charts";
import { EChartsOption } from "echarts";

const chartOption: EChartsOption = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        },
        formatter: '{b}<br/>{a}: {c}'
    },
    xAxis: {
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    legend: {
        data: ['1', '2', '3', '4','5','6','7','8','9','10']
    },
    yAxis: {},
    series: [
        {
            name: '1',
            type: 'bar',
            data: [23, 24, 18, 25, 27, 28, 25]
        },
        {
            name: '2',
            type: 'bar',
            data: [15, 20, 12, 18, 22, 25, 20]
        },
        {
            name: '3',
            type: 'bar',
            data: [30, 32, 28, 35, 33, 36, 34]
        },
        {
            name: '4',
            type: 'bar',
            data: [12, 14, 10, 16, 18, 20, 15]
        },
        {
            name: '5',
            type: 'bar',
            data: [28, 26, 22, 30, 32, 34, 29]
        },
        {
            name: '6',
            type: 'bar',
            data: [18, 22, 16, 24, 26, 28, 23]
        },
        {
            name: '7',
            type: 'bar',
            data: [35, 38, 32, 40, 42, 45, 39]
        },
        {
            name: '8',
            type: 'bar',
            data: [20, 18, 14, 22, 24, 26, 21]
        },
        {
            name: '9',
            type: 'bar',
            data: [25, 27, 23, 29, 31, 33, 28]
        },
        {
            name: '10',
            type: 'bar',
            data: [16, 19, 13, 21, 23, 25, 19]
        }
    ]
};
export default function BarChartDisplayPage() {
    return (
        <div className="grid grid-rows-1 gap-5">
            <BarChart type="multi" isTheme={true} cardTitle="多系列柱状图" data={chartOption} />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <BarChart type="simple" isTheme={true} cardTitle="基础柱状图" data={chartOption} />
                <BarChart type="stack" isTheme={true} cardTitle="堆叠柱状图" data={chartOption} />

                <BarChart type="stack" cardTitle="无主题的堆叠柱状图" data={chartOption} />
            </div>
        </div>
    )
}