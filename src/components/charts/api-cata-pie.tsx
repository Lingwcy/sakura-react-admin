import { apiList } from "@/apis/api-list";
import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { getColorAsync } from "@/utils/color";
import { useTheme } from "@/theme/hook/use-theme";
import { EChartsOption } from "echarts";


export default function ApiCataPie() {
    const { themeMode } = useTheme()
    const [option, setOption] = useState<EChartsOption>();


    const transforData = (list: object) => {
        const arr: { name: string; value: number }[] = [];
        for (const [key, subObj] of Object.entries(list)) {
            arr.push({ name: key, value: Object.keys(subObj).length });
        }
        return arr;
    }

    useEffect(() => {
        let cancelled = false;

        const updateColors = async () => {
            const [primary] = await Promise.all([
                getColorAsync('--primary'),
            ]);
            if (cancelled) return;

            const data = transforData(apiList);

            setOption(prev => {
                const prevSeries = prev?.series?.[0];
                const baseSeries = prevSeries ?? {
                    type: 'pie',
                    radius: '50%',
                    data: []
                };
                return {
                    ...prev,
                    series: [
                        {
                            ...baseSeries,
                            data: data,
                            emphasis: {
                                ...(baseSeries.emphasis ?? {}),
                                itemStyle: {
                                    ...(baseSeries.emphasis?.itemStyle ?? {}),
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: primary
                                }
                            }
                        }
                    ]
                };
            });
        };

        updateColors();
        return () => { cancelled = true };
    }, [themeMode])

    // 数据还没回来前不渲染图表
    if (!option) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    全站可用API分类饼图
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ReactECharts key={themeMode} option={option} />
            </CardContent>
        </Card>
    );
}