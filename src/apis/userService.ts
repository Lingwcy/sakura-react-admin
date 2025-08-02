import { requestClient } from "@/utils";
import type { UserProfile, UserSignIn, UserToken } from "@/types/userType";
import { apiList } from "./api-list";


type SigInResponse =  {
    data: UserToken,
    message: string,
}

type UserProfileResponse =  {
    data: UserProfile,
    message: string,
}

const signIn = (formData:UserSignIn) => requestClient.post<SigInResponse>({url: apiList.user.signIn, data: formData})
const getUserProfile = () => requestClient.get<UserProfileResponse>({url: apiList.user.userProfile})


export {
    signIn,
    getUserProfile
}