import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronRight } from "lucide-react";
import { usePermissionTree } from "@/hooks/use-permission-tree";
import { Permission as PermissionNode, PermissionBasicStatus } from "@/types/roleType";

import { useState } from "react";
import { usePermissionList } from "@/hooks/use-permission";
interface PermissionTreeProps {
    data: PermissionNode[];
    value?: string[];
    onChange?: (next: string[]) => void;
    defaultValue?: string[];
}

function PermissionTree({ data, value, onChange, defaultValue }: PermissionTreeProps) {
    const { isChecked, isIndeterminate, toggleNode } = usePermissionTree(value, onChange, defaultValue);
    if (!data || !Array.isArray(data)) {
        return (
            <ScrollArea className="h-80 w-full rounded-md border">
                <div className="p-4 text-center text-muted-foreground">
                    {data === undefined ? "加载中..." : "暂无权限数据"}
                </div>
            </ScrollArea>
        );
    }

    return (
        <ScrollArea className="h-80 w-full rounded-md border">
            <ul className="p-2 space-y-1">
                {data.map((node) => (
                    <PermissionItem
                        key={node.id}
                        node={node}
                        depth={0}
                        {...{ isChecked, isIndeterminate, toggleNode }}
                    />
                ))}
            </ul>
        </ScrollArea>
    );
}

function PermissionItem({
    node,
    depth,
    isChecked,
    isIndeterminate,
    toggleNode,
}: {
    node: PermissionNode;
    depth: number;
    isChecked: (id: string) => boolean;
    isIndeterminate: (node: PermissionNode) => boolean;
    toggleNode: (node: PermissionNode) => void;
}) {
    const hasChildren = node.children && node.children.length > 0;
    const checked = isChecked(node.id);

    return (
        <Collapsible.Root>
            <li
                style={{ paddingLeft: `${depth * 1.25}rem` }}
                className="flex items-center gap-2 rounded hover:bg-accent px-1 py-1.5"
            >
                <Checkbox
                    checked={checked}
                    onCheckedChange={() => toggleNode(node)}
                    disabled={node.status === PermissionBasicStatus.DISABLE}
                />
                <span className="flex-1 text-sm">{node.name}</span>

                {hasChildren && (
                    <Collapsible.Trigger asChild>
                        <Button variant="ghost" size="icon">
                            <ChevronRight className="h-4 w-4 transition-transform ui-state-open:rotate-90" />
                        </Button>
                    </Collapsible.Trigger>
                )}
            </li>

            {hasChildren && (
                <Collapsible.Content>
                    <ul className="pl-4">
                        {node.children!.map((child) => (
                            <PermissionItem
                                key={child.id}
                                node={child}
                                depth={depth + 1}
                                {...{ isChecked, isIndeterminate, toggleNode }}
                            />
                        ))}
                    </ul>
                </Collapsible.Content>
            )}
        </Collapsible.Root>
    );
}



export default function TestPermissionSelectTree() {
    const [checked, setChecked] = useState<string[]>([]);
    const { data, isLoading } = usePermissionList()

    return (
        <div>
            <h3 className="mb-2 text-lg font-semibold">选择权限</h3>
            {isLoading ? (
                <div className="h-80 w-full rounded-md border flex items-center justify-center">
                    <div className="text-muted-foreground">加载权限数据中...</div>
                </div>
            ) : (
                <PermissionTree data={data} value={checked} onChange={setChecked} />
            )}
            <pre className="mt-4 text-xs">{JSON.stringify(checked, null, 2)}</pre>
        </div>
    );
}