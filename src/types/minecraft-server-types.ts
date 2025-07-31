
export enum MinecraftServerVersion {
    v1_2_5 = "1.2.5",
    v1_7_2 = "1.7.2",
    v1_7_10 = "1.7.10",
    v1_8_x = "1.8_x",
    v1_8_1 = "1.8.1",
    v1_8_8 = "1.8.8",
    v1_8_9 = "1.8.9",
    v1_11_2 = "1.11.2",
    v1_12_x = "1.12_x",
    v1_12_2 = "1.12.2",
    v1_13_x = "1.13_x",
    v1_13_2 = "1.13.2",
    v1_14_x = "1.14.x",
    v1_15_2 = "1.15.2",
    v1_16_x = "1.16.x",
    v1_16_1 = "1.16.1",
    v1_16_2 = "1.16.2",
    v1_16_4 = "1.16.4",
    v1_17_x = "1.17.x",
    v1_17_1 = "1.17.1",
    v1_18_x = "1.18.x",
    v1_18_1 = "1.18.1",
    v1_19_x = "1.19.x",
    v1_19_2 = "1.19.2",
    v1_19_3 = "1.19.3",
    v1_19_4 = "1.19.4",
    v1_20_x = "1.20.x",
    v1_20_1 = "1.20.1",
    v1_20_2 = "1.20.2",
    v1_20_4 = "1.20.4",
    v1_20_6 = "1.20.6",
    v1_21_x = "1.21.x",
    v1_21_1 = "1.21.1",
    v1_21_4 = "1.21.4",
    v1_21_5 = "1.21.5",
    v1_21_6 = "1.21.6",
    v1_21_7 = "1.21.7",
    v1_21_8 = "1.21.8",

    

    
}

export enum MinecraftServerType {
    SPIGOT = "Spigot",
    BUKKIT = "Bukkit",
    PAPER = "Paper",
    FOILA = "Folia",
    FORGE = "Forge",
    FABRIC = "Fabric",
    DEFAULT = "Default",
    LEAVES = "Leaves",
    ARCLIGHT = "Arclight",
    NEOFORGE = "NeoForge",
    VELOCITY = "Velocity",
    NOTPUBLIC = "NotPublic"
}

export enum MinecraftEdition {
    JAVA = 'java',
    BEDROCK = 'bedrock'
}

export enum ServerGamemodes {
  /* 生存类 */
  Vanilla = 'Vanilla',
  Survival = '生存服',
  NoRule = "无规则"
}

export enum ServerWhitelist {
  Whitelist = 1,
  NonWhitelist = 0,
}

export enum ServerAuthMode {
  Online = 1,  
  Offline = 0, 
}

export enum ServerCommercialType {
  Commercial = 1, 
  NonProfit = 0,  
}

export enum ServerCrossVersion {
  Cross = 1,
  Fixed = 0
}