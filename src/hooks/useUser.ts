import { useUserStore } from "@/store";
import { useMutation } from "@tanstack/react-query";
import { signIn, getUserProfile } from "@/apis/userService";
import type { UserProfile, UserSignIn } from "@/types/userType";



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

    const clearUserToken =() => setUserToken({
        token: '',
        refresh_token: userToken.refresh_token
    })

    return {
        sinIn,
        userToken,
        clearUserToken
    };

}

const useUserProfile = () => {
    const userProfile = useUserStore((state) => (state.userProfile))
    const setUserProfile = useUserStore((sate) => (sate.setUserProfile))

    const userProfileMutaition = useMutation({
        mutationFn: getUserProfile,
    })

    const getUserInfo = async () => {
        try {
            const result = await userProfileMutaition.mutateAsync();
            setUserProfile(result.data)
        } catch (e: unknown) {
            console.log('登录错误:', e)
            throw e;
        }
    }

    const clearUserInfo = () => setUserProfile({} as UserProfile)

    return {
        getUserInfo,
        userProfile,
        clearUserInfo
    }
}

export {
    useUserToken,
    useUserProfile
}