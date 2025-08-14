
import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Permission } from "@/types/roleType"


interface SelectParentsBoxProps {
    list: Permission[]
    value?: string
    onChange?: (value: string) => void
    placeholder?: string
}

export function SelectParentsBox({ list, value, onChange, placeholder = "选择父节点" }: SelectParentsBoxProps) {
    const [open, setOpen] = React.useState(false)
    const data = list ?? []

    return (
        <Popover open={open} onOpenChange={setOpen} modal={false}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    <span className="truncate w-[200px] lg:w-[300px]">
                        {value
                            ? data.find((node) => node.id === value)?.label
                            : placeholder}
                    </span>
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="p-0"
                style={{ pointerEvents: 'auto' }}
            >
                <Command>
                    <CommandInput placeholder="搜索节点" className="h-9" />
                    <CommandList>
                        <CommandEmpty>没有任何父节点</CommandEmpty>
                        <CommandGroup>
                            {list.map((item) => (
                                <CommandItem
                                    key={item.id}
                                    value={item.id}
                                    keywords={[item.label]}
                                    onSelect={(currentValue) => {
                                        const newValue = currentValue === value ? "" : currentValue
                                        onChange?.(newValue)
                                        setOpen(false)
                                    }}
                                >
                                    {item.label}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            value === item.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
