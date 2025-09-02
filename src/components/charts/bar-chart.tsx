import { useLayoutEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { EChartsOption } from "echarts";
import ChartCard from "./chart-card";
export default function BarChart() {
    const [option, setOption] = useState<EChartsOption>();

    useLayoutEffect(() => {
        setOption({
            xAxis: {
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {},
            series: [
                {
                    type: 'bar',
                    data: [23, 24, 18, 25, 27, 28, 25]
                },
                {
                    type: 'bar',
                    data: [23, 24, 18, 25, 27, 28, 25]
                }
            ]
        })
    }, [])

    if (!option) return null


    return (
        <ChartCard title="柱状图">
            <ReactECharts option={option} />
        </ChartCard>
    );
}