import { requestClient } from "@/utils";
import type { UserSignIn, UserToken } from "@/types/userType";
const UserApi = {
    SignIn: "authorizations",
};


type sigInResponse =  {
    data: UserToken,
    message: string,
}


const signIn = (formData:UserSignIn) => requestClient.post<sigInResponse>({url: UserApi.SignIn, data: formData})



export {
    signIn
}