import type {
    MinecraftServerType,
    MinecraftEdition,
    MinecraftServerVersion,
    ServerGamemodes,
    ServerWhitelist,
    ServerAuthMode,
    ServerCommercialType,
    ServerCrossVersion
} from "./minecraft-server-types"
export type MinecraftServerItem = {
    id: string,
    name: string,
    icon: string,
    banner: string,
    javaAddress: string,
    bedrockAddress: string,
    javaAddressPort: number,
    bedrockAddressPort: number,
    backendType: MinecraftServerType,
    edition: MinecraftEdition,
    version: MinecraftServerVersion
    gamemodes: ServerGamemodes
    isWhitelist: ServerWhitelist,
    isAuthMode: ServerAuthMode,
    isCommercial: ServerCommercialType,
    isCrossVersion: ServerCrossVersion,
    arichiveDate: Date,
    social: MinecraftServerSocial
    status?: MinecraftServerStatus

}

export type MinecraftServerStatus = {
    id: string,
    isRuning: boolean,
    players: number,
    upTime: string, //正常运行时间
    ping?: number,
    maxPlayers?:number

}

export type MinecraftServerSocial = {
    onwerid: string,  //用户id
    onwerQQ?: string, //所有人qq
    website?: string, //官网 
    groups?: string[] //qq群 支持添加多个

}

export type MinecraftServerCard = {
    serverName: string
    serverIconUrl: string
    bannerUrl?: string
    addressUrl: string
    serverBadge?: string[],
    maxPlayer: number,
    currentPlayer: number,
    isRuning: boolean
}

export type MinecraftServerCardBadge = {
    version?: string,
    gamemodes?: ServerGamemodes,
    isAuthMode?: ServerAuthMode,
    isCrossVersion?: ServerCrossVersion,
}