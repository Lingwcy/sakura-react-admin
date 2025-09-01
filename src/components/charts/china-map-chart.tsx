import { echarts } from "@/utils";
import { EChartsOption } from "echarts";

import mapJson from "@/assets/echarts/china.json";

import EChartsReact from 'echarts-for-react';

export default function ChinaMapChart() {
	echarts.registerMap("china", mapJson as any)
	/* echarts sysmbol */
	const data = [
		{
			fromName: "北京",
			toName: "上海",
			coords: [
				[116.4551, 40.2539],
				[121.4648, 31.2891]
			]
		},
		{
			fromName: "上海",
			toName: "北京",
			coords: [
				[121.4648, 31.2891],
				[116.4551, 40.2539]
			]
		},
		{
			fromName: "北京",
			toName: "广州",
			coords: [
				[116.4551, 40.2539],
				[113.5107, 23.2196]
			]
		},
		{
			fromName: "广州",
			toName: "北京",
			coords: [
				[113.5107, 23.2196],
				[116.4551, 40.2539]
			]
		},
		{
			fromName: "北京",
			toName: "成都",
			coords: [
				[116.4551, 40.2539],
				[103.9526, 30.7617]
			]
		},
		{
			fromName: "成都",
			toName: "北京",
			coords: [
				[103.9526, 30.7617],
				[116.4551, 40.2539]
			]
		},
		{
			fromName: "成都",
			toName: "新疆维吾尔自治区",
			coords: [
				[103.9526, 30.7617],
				[85.294711, 41.371801]
			]
		},
		{
			fromName: " 新疆维吾尔自治区",
			toName: "成都",
			coords: [
				[85.294711, 41.371801],
				[103.9526, 30.7617]
			]
		}
	];

	const option: EChartsOption = {
		// 悬浮窗
		tooltip: {
			trigger: "item",
			formatter: function (params: any) {
				return `${params.name}: ${params.value || "-"}`;
			}
		},
		// echarts大小位置
		grid: {
			left: "0px",
			right: "80px",
			top: "10px",
			bottom: "10px"
		},
		geo: {
			map: "china",
			zoom: 1.5,
			center: [102.848234, 32.82333],
			scaleLimit: {
				min: 0.8
			},
			label: {
				color: "#fff",
				show: true
			},
			emphasis: {
				label: {
					color: "#fff",
					show: true
				},
				itemStyle: {
					areaColor: {
						x: 0,
						y: 0,
						x2: 0,
						y2: 1,
						colorStops: [
							{
								offset: 0,
								color: "#073684" // 0% 处的颜色
							},
							{
								offset: 1,
								color: "#2B91B7" // 100% 处的颜色
							}
						]
					}
				}
			},
			roam: false,
			itemStyle: {
				areaColor: {
					x: 0,
					y: 0,
					x2: 0,
					y2: 1,
					colorStops: [
						{
							offset: 0,
							color: "green" // 0% 处的颜色
						},
						{
							offset: 1,
							color: "green" // 100% 处的颜色
						}
					]
				},
				borderColor: new echarts.graphic.LinearGradient(
					0,
					0,
					0,
					1,
					[
						{
							offset: 0,
							color: "#228B22"
						},
						{
							offset: 1,
							color: "#228B22"
						}
					],
					false
				),
				shadowColor: "green",
				shadowOffsetY: 0,
				shadowBlur: 20,
				borderWidth: 1
			},
			tooltip: {
				show: false
			}
		},
		// 要显示的散点数据
		series: [
			{
				name: "",
				type: "lines",
				coordinateSystem: "geo",
				zlevel: 1,
				effect: {
					show: true,
					period: 6,
					trailLength: 0.7,
					color: "red", 
					symbolSize: 6
				},
				lineStyle: {
					color: "#fff",
					width: 0,
					curveness: 0.2
				},
				data
			},
		]
	};
	return (
		<EChartsReact
			option={option}
			style={{ width: '100%', height: '100%' }}
		/>
	);
};
