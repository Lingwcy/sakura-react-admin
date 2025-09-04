import { useLayoutEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { EChartsOption } from "echarts";
import ChartCard from "./chart-card";
import { useTheme } from "@/theme/hook/use-theme";
import { ThemeWrapper } from "@/utils/color";

type BarCharType = "simple" | "ring" | "area"

interface BarChartProps {
    type?: BarCharType
    cardTitle: string
    isTheme?: boolean
    data: EChartsOption
}
export default function PieChart({
    type = 'simple',
    cardTitle,
    data,
    isTheme = false
}: BarChartProps) {

    const makeOption = (d: EChartsOption, t: BarCharType): EChartsOption => {
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
            case 'ring':
                return {
                    ...base,
                    tooltip: {
                        ...base.tooltip,
                        trigger: 'item',
                        axisPointer: { type: 'shadow' }
                    },
                    series: Array.isArray(base.series)
                        ? (base.series as any[]).map((s) => ({ ...s, radius: ['30%', '50%'] }))
                        : base.series
                };
            case 'area':
                return {
                    ...base,
                    tooltip: {
                        ...base.tooltip,
                        trigger: 'item',
                        axisPointer: { type: 'shadow' }
                    },
                    series: Array.isArray(base.series)
                        ? (base.series as any[]).map((s) => ({ ...s, roseType: 'area' }))
                        : base.series
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
                const themed = await ThemeWrapper(makeOption(data, type), 'pie');
                setOption(themed);
            };
            applyTheme();
        }
    }, [isTheme, themeMode, data, type])

    if (!option) return null

    return (
        <ChartCard title={cardTitle}>
            <ReactECharts key={themeMode} option={option} />
        </ChartCard>
    );
}