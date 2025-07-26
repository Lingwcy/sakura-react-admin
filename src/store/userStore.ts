import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserToken } from "@/types/userType";
type Store = {
    userToken: UserToken,
}

type Action = {
    setUserToken: (token: UserToken) => void;
}

const useUserStore = create<Store & Action>()(
    persist(
        (set) => ({
            userToken: {
                token: '',
                refresh_token: ''
            },
            setUserToken: (token) => {
                set((state) => ({ ...state, userToken: token }))
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
