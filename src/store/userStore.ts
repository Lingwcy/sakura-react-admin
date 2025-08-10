import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserProfile, UserToken } from "@/types/userType";
import { Role } from "@/types/roleType";
type Store = {
    userToken: UserToken,
    userProfile: UserProfile,
}

type Action = {
    setUserToken: (token: UserToken) => void;
    setUserProfile: (data: UserProfile) => void;
    setUserRole: (data: Role) => void;
}

const useUserStore = create<Store & Action>()(
    persist(
        (set) => ({
            userToken: {
                token: '',
                refresh_token: ''
            },
            userProfile: {
                id: '',
                name: '',
                email: '',
                avatar: '',
                userRole: undefined,
            },
            setUserToken: (token) => {
                set((state) => ({ ...state, userToken: token }))
            },
            setUserProfile: (data) => {
                set((state) => ({ ...state, userProfile: data }))
            },
            setUserRole: (role: Role) =>
                set((state) => ({
                    userProfile: { ...state.userProfile, userRole: role },
                })
            ),
        }),
        {
            name: "userStore",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                userToken: state.userToken,
                userProfile: state.userProfile
            }),
        },
    )
)

export default useUserStore
