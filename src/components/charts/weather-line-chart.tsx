import { getTodayWeather } from "@/apis/weather-service";
import { Suspense } from "react";
import ReactECharts from "echarts-for-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { use } from "react";
import { ContentLoading } from "../loading";

// 模块单列
const weatherPromise = getTodayWeather();


function WeatherChart() {
    // React 18 use Hook
    // 这个 use 只会在首次（或者前几次） 挂起
    // 用use 避免第一次加载手动维护loading状态
    // weatherPromise 会保证 getTodayWeather() 被 模块化 缓存
    const weatherData = use(weatherPromise);

    // 直接构建图表配置
    const option = {
        tooltip: { trigger: "axis", axisPointer: { type: "cross" } },
        legend: {},
        xAxis: {
            type: "category",
            axisTick: { alignWithLabel: true },
            data: weatherData.hourly.time.map(t => t.slice(-5))        // 只取今天 24h
        },
        yAxis: [
            {
                type: "value",
                name: "风速",
                min: 0,
                max: 30,
                position: "right",
                axisLabel: { formatter: "{value} km/h" }
            },
            {
                type: "value",
                name: "温度",
                min: 15,
                max: 35,
                position: "left",
                axisLabel: { formatter: "{value} °C" }
            },
            {
                type: 'value',
                name: '',
                min: 0,
                max: 100,
                position: 'right',
                offset: 60,
                axisLabel: ''
            }
        ],
        series: [
            {
                name: "风速",
                type: "bar",
                yAxisIndex: 0,
                data: weatherData.hourly.windspeed_10m
            },
            {
                name: "温度",
                type: "line",
                smooth: true,
                yAxisIndex: 1,
                data: weatherData.hourly.temperature_2m
            },
            {
                name: '湿度',
                type: 'line',
                smooth: true,
                yAxisIndex: 2,
                data: weatherData.hourly.relativehumidity_2m
            }
        ]
    };

    return <ReactECharts option={option} />;
}

// 主组件，提供 Suspense 边界
export default function WeatherLineChartCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>天气预测折线柱状图</CardTitle>
            </CardHeader>
            <CardContent>
                <Suspense
                    fallback={
                        <ContentLoading/>
                    }
                >
                    <WeatherChart />
                </Suspense>
            </CardContent>
        </Card>
    );
}