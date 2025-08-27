export function Horizontal() {
    return (
        <div className="grid grid-rows-[15%_1fr] w-full h-full gap-[1%]">
            <div className="bg-primary flex flex-row flex-nowrap rounded-[10%] ">
                <div className="mr-[50%] w-[10%] bg-pink-600 m-[1%] rounded-[20%]" />
                <div className=" w-[7%] bg-secondary m-[1%] rounded-[20%]" />
                <div className=" w-[7%] bg-secondary m-[1%] rounded-[20%]" />
                <div className=" w-[7%] bg-secondary m-[1%] rounded-[20%]" />
                <div className=" w-[7%] bg-secondary m-[1%] rounded-[20%]" />

            </div>
            <div className=" grid grid-rows-[1fr_1fr] h-full" >
                <div className="grid grid-cols-[30%_1fr] m-[0.5%] rounded-md">
                    <div className="bg-secondary mr-[5%] rounded-xs" />
                    <div className="bg-secondary rounded-xs" />
                </div>
                <div className="bg-secondary m-[0.5%] rounded-xs">
                </div>
            </div>
        </div>
    )
}