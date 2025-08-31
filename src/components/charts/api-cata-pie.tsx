import { apiList } from "@/apis/api-list";
import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
export default function ApiCataPie() {
    const [option, setOption] = useState({
        title: {
            text: '可用API统计',
            subtext: 'Mock JS API',
            left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            left: 'left'
        },
        series: [
            {
                name: 'API统计',
                type: 'pie',
                radius: '50%',
                data: [
                    { value: 1048, name: 'Search Engine' },
                    { value: 735, name: 'Direct' },
                    { value: 580, name: 'Email' },
                    { value: 484, name: 'Union Ads' },
                    { value: 300, name: 'Video Ads' }
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
    });
    const transforData = (list: object) => {
        const arr = [];
        for (const [key, subObj] of Object.entries(list)) {
            arr.push({ name: key, value: Object.keys(subObj).length });
        }
        setOption(prevOption => ({
            ...prevOption,
            series: [
                {
                    ...prevOption.series[0],
                    data: arr
                }
            ]
        }));
    }

    useEffect(() => {
        transforData(apiList)
    }, [])


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
                <ReactECharts option={option} />
            </CardContent>
        </Card>
    );
}