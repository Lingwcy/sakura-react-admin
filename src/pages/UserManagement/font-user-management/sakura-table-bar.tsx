import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
interface SakuraTableBarProps {
    enableSearch?: boolean,
    enableCreate?: boolean
    enableSelected?: boolean,
    searchValue?: string,
    searchPlaceholder?: string,
    createButtonText?: string
    selectCount?: number
    onDeleteItems?: () => void
    onOpenCreateDialog: () => void
    onSearchChange?: (value: string) => void
}


export default function SakuraTableBar({
    enableSearch = false,
    enableSelected = false,
    enableCreate = false,
    searchPlaceholder,
    searchValue,
    createButtonText,
    selectCount,
    onOpenCreateDialog,
    onSearchChange,
    onDeleteItems



}: SakuraTableBarProps) {

    return (
        <div className="flex py-4 space-x-1.5 items-center">
            {
                enableSearch && <Input
                    placeholder={searchPlaceholder}
                    value={searchValue}
                    onChange={(event) => onSearchChange(event.target.value)}
                    className="max-w-sm"
                />
            }
            {
                enableCreate && <Button variant="outline" className="bg-pink-900 text-white" onClick={onOpenCreateDialog}>
                    {createButtonText}
                </Button>
            }


            {enableSelected && selectCount > 0 &&
                <div className="flex justify-center items-center gap-3 md:flex-row-reverse">
                    <div className="text-muted-foreground  text-sm hidden lg:block">
                        {selectCount} 行 被选中了
                    </div>

                    <Button onClick={() => {
                        onDeleteItems();
                    }}>
                        删除选中
                    </Button></div>
            }


        </div>


    )
}