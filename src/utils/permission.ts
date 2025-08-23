import { Permission } from "@/types/roleType";
function PermisionTree2List(permissionTree:Permission[]){
    const list:Omit<Permission,'children'>[] = []

    function traverse(node:Permission[]){
        node.forEach((item) => {
            if(item.children){
                traverse(item.children)
            }
            list.push(item)
        })
    }

    traverse(permissionTree)
    return list
}

// 先用
function PermissionListFattented2Tree(list: Omit<Permission[], 'children'>) {
	const copyList = list.map((item) => ({ ...item, children: [] }))
	const mapNode = new Map<string, Permission>()
	copyList.forEach(node => mapNode.set(node.id, node))

	const roots: Permission[] = []
	copyList.forEach(item => {
		const parentId = item.parentId
		if(!parentId || !mapNode.has(parentId)){
			roots.push(item)
		}else{
			const parentNode = mapNode.get(parentId) //找到父节点
			parentNode!.children = parentNode!.children ?? [];
			parentNode!.children.push(item);
			
		}
	})

	return roots

}
export{
    PermisionTree2List,
    PermissionListFattented2Tree
}