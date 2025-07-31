import { requestClient } from "@/utils";
import type { UserProfile, UserSignIn, UserToken } from "@/types/userType";
const UserApi = {
    SignIn: "api/authorizations",
    UserProfile: "api/user/profile"
};


type SigInResponse =  {
    data: UserToken,
    message: string,
}

type UserProfileResponse =  {
    data: UserProfile,
    message: string,
}

const signIn = (formData:UserSignIn) => requestClient.post<SigInResponse>({url: UserApi.SignIn, data: formData})
const getUserProfile = () => requestClient.get<UserProfileResponse>({url: UserApi.UserProfile})


export {
    signIn,
    getUserProfile
}