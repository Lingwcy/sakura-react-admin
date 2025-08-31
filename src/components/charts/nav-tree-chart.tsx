
import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useDynamicRoutes } from "@/hooks/use-system";
import { TabInfo } from "@/hooks/use-system";
/**
 * 把 TabInfo[] → ECharts tree 数据
 * @param tabs 原数组
 * @returns ECharts tree 需要的 data 字段
 */
type TreeNode = {
    name: string;
    value: number;
    itemStyle: {
        key: string;
        order?: number;
        hide?: boolean;
    };
    children?: TreeNode[];
};

function tabs2Tree(tabs: TabInfo[]) {
    // 内部递归函数
    const transform = (tab: TabInfo): TreeNode => {
        const value = tab.children?.length ?? 0;

        // 节点主体
        const node: TreeNode = {
            name: tab.label,
            value,
            // 把可能用到的其他字段塞进 itemStyle.tooltip 备用
            itemStyle: {
                key: tab.key,
                order: tab.order,
                hide: tab.hide
            }
        };

        // 处理子节点
        if (tab.children && tab.children.length) {
            node.children = tab.children.map(transform);
        }

        return node;
    };

    const forest = tabs.map(transform);

    // 整片森林包成一个根
    return [{
        name: '全站权限',
        value: forest.length,
        children: forest
    }];
}
export default function NavTreeChartCard() {
    const { availableTabs } = useDynamicRoutes()
    const treeData = tabs2Tree(availableTabs);
    console.log(treeData)
    const [option] = useState({
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
        },
        series: [
            {
                type: 'tree',
                data: treeData,
                top: '1%',
                left: '7%',
                bottom: '1%',
                right: '20%',
                symbolSize: 7,
                label: {
                    position: 'left',
                    verticalAlign: 'middle',
                    align: 'right',
                    fontSize: 9
                },
                leaves: {
                    label: {
                        position: 'right',
                        verticalAlign: 'middle',
                        align: 'left'
                    }
                },
                emphasis: {
                    focus: 'descendant'
                },
                expandAndCollapse: true,
                animationDuration: 550,
                animationDurationUpdate: 750
            }]
    });


    useEffect(() => {

    }, [])


    // 数据还没回来前不渲染图表
    if (!option) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    全站权限节点依赖树
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ReactECharts option={option} />
            </CardContent>
        </Card>
    );
}