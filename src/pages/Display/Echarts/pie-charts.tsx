import { PieChart } from "@/components/charts";
import { EChartsOption } from "echarts";

const chartOption: EChartsOption = {
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
        data: ['数据1', '数据2', '数据3', '数据4','数据5','数据6','数据7','数据8','数据9','数据10']
    },
    series: [
        {
            name: '饼图数据',
            type: 'pie',
            radius: '50%',
            data: [
                { value: 335, name: '数据1' },
                { value: 310, name: '数据2' },
                { value: 274, name: '数据3' },
                { value: 235, name: '数据4' },
                { value: 400, name: '数据5' },
                { value: 180, name: '数据6' },
                { value: 290, name: '数据7' },
                { value: 220, name: '数据8' },
                { value: 150, name: '数据9' },
                { value: 320, name: '数据10' }
            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};
export default function PieChartPage() {
    return (
        <div className="grid grid-rows-1 gap-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <PieChart type="simple" isTheme={true} cardTitle="基础饼图" data={chartOption} />
                <PieChart type="ring" isTheme={true} cardTitle="圆环饼图" data={chartOption} />
                <PieChart type="area" isTheme={true} cardTitle="玫瑰饼图" data={chartOption} />

                <PieChart type="simple" cardTitle="无主题的基础饼图" data={chartOption} />
            </div>
        </div>
    )
}