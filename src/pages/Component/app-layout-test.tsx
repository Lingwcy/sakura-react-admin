import {
    Vertical,
    TwoVertical,
    Hybird,
    Empty,
    Horizontal
} from "@/components/layout";
export default function AppLayoutTest() {
    const render = () => {
        const nodeArr: React.ReactNode[] = [<Vertical />, <TwoVertical />, <Hybird />, <Empty />, <Horizontal />]
        return nodeArr.map(item => {
            return (
                <div className="w-[100px] h-[60px] ">
                    {item}
                </div>
            )
        })
    }

    return (
        <>

            <div className="flex gap-5 ">
                {render()}
            </div>

        </>

    )
}