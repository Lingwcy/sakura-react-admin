import { EChartsOption } from "echarts";
import LineChart from "@/components/charts/line-chart";
/**
 * 
 *  折线图组件演示页面
 * 
 */
const chartOption: EChartsOption = {
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
        data: ['系列1', '系列2', '系列3']
    },
    xAxis: {
        type: 'category',
        data: ['数据1', '数据2', '数据3', '数据4', '数据5', '数据6', '数据7', '数据8', '数据9', '数据10']
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name: '系列1',
            data: [100, 150, 200, 250, 300, 350, 400, 450, 500, 550],
            type: 'line'
        },
        {
            name: '系列2',
            data: [500, 420, 380, 350, 300, 280, 250, 200, 150, 100],
            type: 'line'
        },
        {
            name: '系列3',
            data: [400, 300, 200, 150, 100, 180, 280, 350, 450, 500],
            type: 'line'
        }
    ]

};
export default function LineChartPage() {
    return (
        <div className="grid grid-rows-1 gap-5">
             <LineChart type="stack" isTheme={true} isShowLabel={true} isFillArea={true}  isSmooth={true} cardTitle="line-chart.tsx 组件" data={chartOption} />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <LineChart type="simple" isTheme={true} cardTitle="基础折线图" data={chartOption} />
                <LineChart type="stack" isTheme={true} cardTitle="堆叠折线图" data={chartOption} />
                <LineChart type="stack" isTheme={true} isShowLabel={true} cardTitle="在数据点处显示数值" data={chartOption} />
                <LineChart type="stack" isTheme={true} isFillArea={true} cardTitle="启用区域填充" data={chartOption} />
                <LineChart type="stack" isTheme={true} isSmooth={true} cardTitle="启用曲线平滑" data={chartOption} />
                <LineChart type="stack" cardTitle="无主题模式" data={chartOption} />
            </div>
        </div>
    )
}