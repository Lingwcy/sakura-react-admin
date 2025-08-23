import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { useCallback } from "react";
import { Permission as PermissionNode } from "@/types/roleType";
export function usePermissionTree(
  /** 受控用法 */
  value?: string[],
  onChange?: (next: string[]) => void,
  /** 非受控用法 */
  defaultValue?: string[]
) {
  const [checkedSet, setCheckedSet] = useControllableState<string[]>({
    prop: value,
    defaultProp: defaultValue ?? [],
    onChange,
  });

  const isChecked = useCallback(
    (id: string) => checkedSet.includes(id),
    [checkedSet]
  );

  // 一次性选中或取消其子节点的所有 ID。
  const toggleNode = useCallback(
    (node: PermissionNode) => {
      // 获取当前节点及其所有子节点的 ID 列表
      const ids = [node.id, ...flattenIds(node.children ?? [])];
      //判断这些 ID 是否全部已经被选中
      const allChecked = ids.every(isChecked);

      //更新选中状态：
      //- 如果全部已选中 → 取消选中（过滤掉这些 ID）
      //- 如果有未选中的 → 全部选中（合并 ID 列表并去重
      setCheckedSet(
        allChecked
          ? checkedSet.filter((id) => {
            return !ids.includes(id)
          })
          : [...new Set([...checkedSet, ...ids])]
      );
    },
    [checkedSet, isChecked, setCheckedSet]
  );

  return { isChecked, toggleNode };
}

const flattenIds = (nodes: PermissionNode[]): string[] =>
  nodes.flatMap((n) => [n.id, ...flattenIds(n.children ?? [])]);