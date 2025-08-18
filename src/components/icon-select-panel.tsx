import { useMemo } from 'react';
import { Icon } from '@iconify/react';
import { useDebounce } from '@/hooks/use-debounce';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';


import mdi from '@iconify/json/json/mdi.json';
import { DialogDescription } from '@radix-ui/react-dialog';
const iconNames = Object.keys(mdi.icons);

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (iconName: string) => void;
}

export default function IconifySelectDialog({
    open,
    onOpenChange,
    onSelect,
}: Props) {
    const [inputValue, keyword, setInputValue] = useDebounce('');

    // 过滤
    const filtered = useMemo(() => {
        if (!keyword) return iconNames.slice(0, 500);
        return iconNames.filter((n) => n.includes(keyword.toLowerCase())).slice(0, 500);
    }, [keyword]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl h-[80vh] flex flex-col p-0">
                <DialogHeader className="px-6 pt-4 pb-2">
                    <DialogTitle>选择图标</DialogTitle>
                    <DialogDescription />
                </DialogHeader>

                {/* 搜索框 */}
                <div className="px-6 pb-2">
                    <Input
                        placeholder="搜索图标..."
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                        }}
                    />
                </div>

                {/* 图标列表 */}
                <ScrollArea className="flex-1 px-6 pb-4 min-h-0">
                    <div className="grid grid-cols-6 gap-2 ">
                        {filtered.map((name) => (
                            <Button
                                key={name}
                                variant="ghost"
                                size="icon"
                                title={name}
                                className="h-12 w-12"
                                onClick={() => {
                                    onSelect(`mdi:${name}`);
                                    onOpenChange(false);
                                    setInputValue('');
                                }}
                            >
                                <Icon icon={`mdi:${name}`} width={24} height={24} />
                            </Button>
                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}