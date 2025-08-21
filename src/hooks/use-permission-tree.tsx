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

  const isIndeterminate = useCallback(
    (node: PermissionNode) => {
      if (!node.children) return false;
      const childIds = flattenIds(node.children);
      const checkedChildren = childIds.filter(isChecked);
      return checkedChildren.length > 0 && checkedChildren.length < childIds.length;
    },
    [isChecked]
  );

  const toggleNode = useCallback(
    (node: PermissionNode) => {
      const ids = [node.id, ...flattenIds(node.children ?? [])];
      const allChecked = ids.every(isChecked);
      setCheckedSet(
        allChecked
          ? checkedSet.filter((id) => !ids.includes(id))
          : [...new Set([...checkedSet, ...ids])]
      );
    },
    [checkedSet, isChecked, setCheckedSet]
  );

  return { isChecked, isIndeterminate, toggleNode };
}

const flattenIds = (nodes: PermissionNode[]): string[] =>
  nodes.flatMap((n) => [n.id, ...flattenIds(n.children ?? [])]);