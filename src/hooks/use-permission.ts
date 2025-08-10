import { getPermissionList } from "@/apis/permission-service";
import { useQuery } from "@tanstack/react-query";

const usePermissionList = () => {

    const query = useQuery({
        queryKey: ['permissionList'],
        queryFn: async () => {
            try {
                const result = await getPermissionList();

                if (result && result.code === 200 && result.data) {
                    return result.data;
                }
                return result.data
            }
            catch (e) {
                console.error('API Error:', e);
            }
        },
        retry: 3,
        staleTime: 10 * 1000,
        placeholderData: (previousData) => previousData, 
    })

    return {
        data: query.data,
        isLoading: query.isLoading,
    }
}

const usePermissionTable = () =>{

}

export {
    usePermissionList,
    usePermissionTable
}