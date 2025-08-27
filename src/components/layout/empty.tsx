export function Empty() {
    return (
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
    )
}