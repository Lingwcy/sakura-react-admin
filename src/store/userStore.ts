import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserProfile, UserToken } from "@/types/userType";
type Store = {
    userToken: UserToken,
    userProfile: UserProfile
}

type Action = {
    setUserToken: (token: UserToken) => void;
    setUserProfile : (data: UserProfile) => void;
}

const useUserStore = create<Store & Action>()(
    persist(
        (set) => ({
            userToken: {
                token: '',
                refresh_token: ''
            },
            userProfile:{
                id: '',
                name: '',
                email: '',
                avatar: ''
            },
            setUserToken: (token) => {
                set((state) => ({ ...state, userToken: token }))
            },
            setUserProfile: (data) => {
                set((state) => ({ ...state, userProfile: data}))
            }
        }),
        {
            name: "userStore",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                userToken: state.userToken
            }),
        },
    )
)

export default useUserStore
