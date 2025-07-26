import { useUserStore } from "@/store";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "@/apis/userService";
import type { UserSignIn } from "@/types/userType";



const useUserToken = () => {
    const userToken = useUserStore((state) => state.userToken)
    const setUserToken = useUserStore((state) => state.setUserToken)
    const signInMutation = useMutation({
        mutationFn: signIn,
    });

    const sinIn = async (formData: UserSignIn) => {
        try {
            const result = await signInMutation.mutateAsync(formData)
            setUserToken(result.data)

        } catch (e: unknown) {
            console.log('登录错误:', e)
            throw e;
        }
    }

    return {
        sinIn,
        userToken
    };

}


export {
    useUserToken
}