export function Vertical() {
    return (
        <div className="grid grid-cols-[25%_1fr] w-full h-full gap-[1%]">
            <div className="bg-primary flex flex-col ">
                <div className=" h-[10%] bg-pink-600 m-[8%] rounded-xs" />
                {
                    new Array(5).fill(1).map(() => {
                        return <div className="h-[7%] bg-secondary m-[5%] mt-[15%] rounded-xs" />
                    })
                }
            </div>
            <div className=" grid grid-rows-[8%_1fr_1fr] h-full" >
                <div className=" flex justify-between items-stretch bg-secondary m-[0.5%] rounded-xs">
                    <div className="w-[5%] m-[0.5%] bg-foreground ml-[2%] rounded-md" />
                    <div className="w-[10%] m-[0.5%] bg-foreground ml-[2%] rounded-md" />
                </div>
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