import { chain } from "ramda";
import { TabInfo } from "@/hooks/use-system";
/**
 * Flatten an array containing a tree structure
 * @param {T[]} trees - An array containing a tree structure
 * @returns {T[]} - Flattened array
 */
export function flattenTrees<T extends { children?: T[] }>(
	trees: T[] = [],
): T[] {
	return chain((node) => {
		const children = node.children || [];
		return [node, ...flattenTrees(children)];
	}, trees);
}



export function findTreeTabByKey(nodes :TabInfo[], key: string):TabInfo | undefined {
	for(const node of nodes){
		if(node.key === key) return node
		if(node.children) {
			const found = findTreeTabByKey(node.children, key)
			if(found) return found
		}
	}
	return undefined
}