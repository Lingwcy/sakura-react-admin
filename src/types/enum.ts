export enum StorageEnum {
	UserInfo = "userInfo",
	UserToken = "userToken",
	Settings = "settings",
	I18N = "i18nextLng",
}

export enum ThemeMode {
	Light = "light",
	Dark = "dark",
    Sakura = "sakura",
    Blue = "blue",
}

export const AvailableThemeMode:Record<ThemeMode, string> = {
	[ThemeMode.Light]: "#FCFDFE",
	[ThemeMode.Dark]: "#101010",
    [ThemeMode.Sakura]: "#F855C3",
    [ThemeMode.Blue]: "#3ACBFC",
}

export enum ThemeLayout {
	Vertical = "vertical",
	Horizontal = "horizontal",
	Mini = "mini",
}

export enum ThemeColorPresets {
	Default = "default",
	Cyan = "cyan",
	Purple = "purple",
	Blue = "blue",
	Orange = "orange",
	Red = "red",
}

export enum LocalEnum {
	en_US = "en-US",
	zh_CN = "zh-CN",
}
