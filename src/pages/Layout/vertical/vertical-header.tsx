
export default function VerticalHeader() {
    return (
        <div className="gap-0 px-0 flex justify-center items-center cursor-pointer select-none">
            <div className="flex aspect-square size-8 items-center justify-center overflow-hidden rounded-lg bg-background">
                <img src="/brand/oolong-comics-logo.svg" alt="Oolong Comics" className="size-full object-contain" />
            </div>
            <div className="grid flex-1 text-left text-lg leading-tight">
                <span className="truncate text-primary font-bold">Oolong Comics</span>
            </div>
            
        </div>
    )
}
