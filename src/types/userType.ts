
export type UserToken = {
    token: string,
    refresh_token: string
}

export type UserSignIn = {
    username:string,
    password:string

}

export type UserProfile = {
    id: string,
    avatar: string,
    name: string,
    email: string,
}