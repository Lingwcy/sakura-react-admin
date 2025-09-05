/**
 * 折线图组件
 * 应该支持的类型:
 *  1. simple
 *  2. stack
 *  
 * 
 * 应该具有的特性:
 *  1.选择性在数据点处显示数值
 *  2.选择性启用区域填充色(自动填入调色板)
 *  3.选择性启用曲线平滑
 *  4.选择性启用预设主题包装器
 */
import { EChartsOption } from "echarts"
import { useState, useLayoutEffect } from "react"
import ChartCard from "./chart-card"
import ReactECharts from "echarts-for-react";
import { useTheme } from "@/theme/hook/use-theme";
import { ThemeWrapper } from "@/utils/color";
type LineChartType = 'simple' | 'stack'

interface LineChartProps {
    type?: LineChartType
    cardTitle: string
    isTheme?: boolean
    isShowLabel?: boolean
    isFillArea?: boolean
    isSmooth?: boolean
    data: EChartsOption
}


export default function LineChart({
    type = 'simple',
    cardTitle,
    isTheme = false,
    isShowLabel = false,
    isFillArea = false,
    isSmooth = false,
    data
}: LineChartProps) {
    const makeOption = (
        d: EChartsOption,
        t: LineChartType,
    ): EChartsOption => {
        const base: EChartsOption = { ...d };

        switch (t) {
            case 'simple':
                return {
                    ...base,
                    tooltip: {
                        ...base.tooltip,
                        trigger: 'item'
                    },
                    series: Array.isArray(base.series) ? base.series.slice(0, 1) : base.series
                };
            default:
                return {
                    ...base,
                    tooltip: {
                        ...base.tooltip,
                        trigger: 'item'
                    }
                };
        }
    };

    const [option, setOption] = useState<EChartsOption>(() => makeOption(data, type));
    const { themeMode } = useTheme();


    useLayoutEffect(() => {
        setOption(makeOption(data, type));
    }, [data, type]);

    useLayoutEffect(() => {
        if (isTheme) {
            const applyTheme = async () => {
                const themed = await ThemeWrapper(makeOption(data, type), 'line', [isShowLabel,isFillArea,isSmooth]);
                setOption(themed);
            };
            applyTheme();
        }
    }, [isTheme, themeMode, data, type, isShowLabel, isFillArea, isSmooth])

    if (!option) return null

    return (
        <ChartCard title={cardTitle}>
            <ReactECharts option={option} />
        </ChartCard>
    );
}