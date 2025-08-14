
import { useState } from "react";
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
interface PageAutocompleteProps {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
}

const ENTRY_PATH = "/src/pages";
const PAGES = import.meta.glob("/src/pages/**/*.tsx", { eager: true });

const pageOptions = Object.keys(PAGES).map((fullPath) => {
    const value = fullPath.replace(ENTRY_PATH, "");
    return { label: value, value };
});


export function PageAutocomplete({
    value,
    onChange,
}: PageAutocompleteProps) {
    const [open, setOpen] = useState(false);
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
                            ? pageOptions.find((node) => node.value === value)?.label
                            : "选择组件"}
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
                            {pageOptions.map((item) => (
                                <CommandItem
                                    key={item.value}
                                    value={item.value}
                                    keywords={[item.label]}
                                    onSelect={(currentValue) => {
                                        onChange(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    {item.label}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            value === item.value ? "opacity-100" : "opacity-0"
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