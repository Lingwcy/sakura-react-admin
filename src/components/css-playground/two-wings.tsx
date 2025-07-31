import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"


export default function TwoWingsMiddle() {
    return (
        <div className="flex flex-col h-full gap-2">
            <Card>
                <CardHeader>
                    <CardTitle>双飞翼布局</CardTitle>
                    <CardDescription>
                        基于Flexbox实现的双飞翼布局，左右翼宽度固定（100px），主内容区flex-1自动填充。
                        使用order属性控制移动端下的垂直顺序，min-width保证内容不挤压。
                    </CardDescription>
                </CardHeader>
            </Card>
            <div className="flex flex-col md:flex-row text-center flex-1 min-w-[320px]">
                <div className="w-full md:w-[100px] bg-yellow-400 order-1 md:order-none flex items-center justify-center">left</div>
                <div className="flex-1 min-w-[200px] bg-orange-600 order-2 flex items-center justify-center">middle</div>
                <div className="w-full md:w-[100px] bg-pink-300 order-3 flex items-center justify-center">right</div>
            </div>
        </div>

    )
}
