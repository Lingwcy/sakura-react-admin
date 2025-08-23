import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronRight } from "lucide-react";
import { usePermissionTree } from "@/hooks/use-permission-tree";
import { Permission as PermissionNode, PermissionBasicStatus } from "@/types/roleType";
import { Checkbox } from "@/components/ui/checkbox";
import { usePermissionList } from "@/hooks/use-permission";
interface PermissionTreeProps {
    data: PermissionNode[];
    value?: string[];
    onChange?: (next: string[]) => void;
    defaultValue?: string[];
}
/***
 * value : 一个node id数组
 */
function PermissionTree({ data, value, onChange, defaultValue }: PermissionTreeProps) {
    const { isChecked,toggleNode } = usePermissionTree(value, onChange, defaultValue);
    if (!data || !Array.isArray(data)) {
        return (
            <ScrollArea className="w-full rounded-md border">
                <div className="p-4 text-center text-muted-foreground">
                    {data === undefined ? "加载中..." : "暂无权限数据"}
                </div>
            </ScrollArea>
        );
    }

    return (
        <ScrollArea className="h-88 rounded-md">
            <ul className="p-2 cursor-pointer">
                {data.map((node) => (
                    <PermissionItem
                        key={node.id}
                        node={node}
                        depth={0}
                        {...{ isChecked, toggleNode }}
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
    toggleNode,
}: {
    node: PermissionNode;
    depth: number;
    isChecked: (id: string) => boolean;
    toggleNode: (node: PermissionNode) => void;
}) {
    const hasChildren = node.children && node.children.length > 0;
    const checked = isChecked(node.id)

    return (
        <Collapsible.Root>
            <li
                style={{ paddingLeft: `${depth +0.5 * 1}rem` }}
                className="flex justify-between items-center gap-2 rounded hover:bg-accent px-0 py-1"
            >
                <Checkbox
                    checked={checked}
                    onCheckedChange={() => toggleNode(node)}
                    disabled={node.status === PermissionBasicStatus.DISABLE}
                />
                <span className="flex-1 text-sm">{node.name}</span>

                {hasChildren && (
                    <Collapsible.Trigger asChild>
                        <Button variant="ghost" size="icon" className="cursor-pointer">
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
                                depth={depth + 0.3}
                                {...{ isChecked, toggleNode }}
                            />
                        ))}
                    </ul>
                </Collapsible.Content>
            )}
        </Collapsible.Root>
    );
}



interface PermissionSelectTreeProps {
    checked: string[],
    setChecked: (ids:string[]) => void
}

// checked被选中的权限 id 列表，任何角色只需要传入此状态
export default function PermissionSelectTree({
    checked,
    setChecked
}:PermissionSelectTreeProps) { 
    const { data, isLoading } = usePermissionList() //此data只负责维护全局权限列表
    return (
        <div>
            {isLoading ? (
                <div className="h-80 w-full rounded-md border flex items-center justify-center">
                    <div className="text-muted-foreground">加载权限数据中...</div>
                </div>
            ) : (
                <PermissionTree data={data} value={checked} onChange={setChecked} />
            )}

        </div>
    );
}