/**
 * 这个工具文件目前主要提供给 Echart 主题化
 * 读取特定的主题变量 并 注入到 ThemeWrapper ，ThemeWrapper 会返回一个带有主题颜色的 EChartsOption
 */

import { EChartsOption, SeriesOption } from "echarts";


/**
   根据 CSS 变量生成颜色
 */
export function getColor(name: string, fallback?: string) {
    const read = (el: Element | null) =>
        el ? getComputedStyle(el).getPropertyValue(name).trim() : "";

    // 优先从 body 读取（主题类多半挂在 body 上）
    const fromBody = read(document.body);
    if (fromBody) return fromBody;

    // 回退到 html(:root)
    const fromRoot = read(document.documentElement);
    if (fromRoot) return fromRoot;

    // 最后使用 fallback
    return fallback ?? "";
}

/**
 * 等到样式应用到下一/下下帧后再读取，避免拿到旧值
 */
export function getColorAsync(name: string, fallback?: string): Promise<string> {
    return new Promise((resolve) => {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                resolve(getColor(name, fallback));
            });
        });
    });
}
/**
 * 
 * 一次性获取多个样式
 */

export function getColorListAsync(names: string[]): Promise<string[]> {
    return Promise.all(names.map(item => getColorAsync(item)))
}

/**
 * 枚举所有可用的主题颜色
 */

export enum ThemeColor {
    primary = '--primary',
    secondary = '--secondary',
    background = '--background',
    foreground = '--foreground',
    card = '--card',
    cardForeground = '--card-foreground',
    popover = '--popover',
    popoverForeground = '--popover-foreground',
    primaryForeground = '--primary-foreground',
    secondaryForeground = '--secondary-foreground',
    muted = '--muted',
    mutedForeground = '--muted-foreground',
    accent = '--accent',
    accentForeground = '--accent-foreground',
    destructive = '--destructive',
    border = '--border',
    input = '--input',
    ring = '--ring',
    sidebar = '--sidebar',
    sidebarForeground = '--sidebar-foreground',
    sidebarPrimary = '--sidebar-primary',
    sidebarPrimaryForeground = '--sidebar-primary-foreground',
    sidebarAccent = '--sidebar-accent',
    sidebarAccentForeground = '--sidebar-accent-foreground',
    sidebarBorder = '--sidebar-border',
    sidebarRing = '--sidebar-ring',
    // 自定义颜色变量
    colorBg = '--color-bg',
    colorText = '--color-text',
    colorPrimary = '--color-primary',
    colorPrimaryForeground = '--color-primary-foreground'
}

/**
 * 读取 CSS 变量 --chart1..--chart10 作为调色板
 */
export function readChartPalette(): string[] {
    if (typeof window === "undefined") return [];
    const root = document.documentElement;
    const stylesRoot = getComputedStyle(root);
    const stylesBody = document.body ? getComputedStyle(document.body) : null;
    const colors: string[] = [];
    for (let i = 1; i <= 10; i++) {
        let v = stylesRoot.getPropertyValue(`--chart${i}`).trim();
        if (!v && stylesBody) v = stylesBody.getPropertyValue(`--chart${i}`).trim();
        if (v) colors.push(v);
    }
    return colors;
}

/**
 * 异步读取调色板
 */
export function readChartPaletteAsync(): Promise<string[]> {
    return new Promise((resolve) => {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                resolve(readChartPalette());
            });
        });
    });
}

/**
 * 根据系列数量获取对应数量的调色板颜色
 * @param seriesCount 系列数量
 */
export async function getChartPalette(seriesCount: number): Promise<string[]> {
    const palette = await readChartPaletteAsync();

    if (seriesCount <= 0 || palette.length === 0) return [];
    if (seriesCount <= palette.length) {
        return palette.slice(0, seriesCount);
    }

    // 如果需要的颜色数量超过调色板长度，循环使用
    const result: string[] = [];
    for (let i = 0; i < seriesCount; i++) {
        result.push(palette[i % palette.length]);
    }
    return result;
}

// 仅对柱状图系列生效
function isBarSeries(s: SeriesOption): s is { type: 'bar'; itemStyle?: any } {
    return s && s.type === 'bar';
}
// 仅对饼图系列生效
function isPieSeries(s: SeriesOption): s is { type: 'pie'; itemStyle?: any; data?: any[] } {
    return s && s.type === 'pie';
}
// 新增：仅对折线图系列生效
function isLineSeries(s: SeriesOption): s is { type: 'line'; label?: any; areaStyle?: any; smooth?: any } {
    return s && s.type === 'line';
}


export async function BarThemeWrapper(
    data: EChartsOption,
) {
    const [primary] = await getColorListAsync([ThemeColor.primary]);

    const paletteCount = Array.isArray(data.series) ? data.series.length : 1;
    const palette = await getChartPalette(paletteCount);

    const res: EChartsOption = {
        ...data,
        color: palette,
        xAxis: {
            ...data.xAxis,
            axisLine: {
                ...(data as any).xAxis?.axisLine,
                lineStyle: {
                    ...(data as any).xAxis?.axisLine?.lineStyle,
                    color: primary
                }
            },
            axisTick: {
                ...(data as any).xAxis?.axisTick,
                lineStyle: {
                    ...(data as any).xAxis?.axisTick?.lineStyle,
                    color: primary
                }
            },
            axisLabel: {
                ...(data as any).xAxis?.axisLabel,
                color: primary
            }
        },
        yAxis: {
            ...data.yAxis,
            axisLine: {
                ...(data as any).yAxis?.axisLine,
                lineStyle: {
                    ...(data as any).yAxis?.axisLine?.lineStyle,
                    color: primary
                }
            },
            axisTick: {
                ...(data as any).yAxis?.axisTick,
                lineStyle: {
                    ...(data as any).yAxis?.axisTick?.lineStyle,
                    color: primary
                }
            },
            axisLabel: {
                ...(data as any).yAxis?.axisLabel,
                color: primary
            }
        },
        emphasis: {
            focus: 'series',
            itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: primary
            }
        },
        series: Array.isArray(data.series)
            ? (data.series).map(s => {
                if (isBarSeries(s)) {
                    return {
                        ...s,
                        itemStyle: {
                            ...(s.itemStyle ?? {}),
                            borderRadius: 2
                        }
                    };
                }
                return s;
            })
            : (isBarSeries(data.series)
                ? {
                    ...data.series,
                    itemStyle: {
                        ...(data.series.itemStyle ?? {}),
                        borderRadius: 4
                    }
                }
                : data.series)
    };

    return res;
}


export async function PieThemeWrapper(
    data: EChartsOption,
) {
    const [primary] = await getColorListAsync([ThemeColor.primary]);

    let paletteCount = 1;
    if (Array.isArray(data.series)) {
        const pieSeries = data.series.find(s => isPieSeries(s)) as any;
        paletteCount = pieSeries?.data?.length || 1;
    } else if (isPieSeries(data.series)) {
        paletteCount = (data.series as any).data?.length || 1;
    }

    const palette = await getChartPalette(paletteCount);

    const res: EChartsOption = {
        ...data,
        color: palette,
        xAxis: undefined,
        yAxis: undefined,
        emphasis: {
            focus: 'series',
            itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: primary
            }
        },
        series: Array.isArray(data.series)
            ? (data.series).map(s => {
                if (isPieSeries(s) && Array.isArray(s.data)) {
                    return {
                        ...s,
                        data: s.data.map((item: any, index: number) => ({
                            ...item,
                            itemStyle: {
                                ...item.itemStyle,
                                color: palette[index % palette.length]
                            }
                        }))
                    };
                }
                return s;
            })
            : (isPieSeries(data.series) && Array.isArray((data.series as any).data)
                ? {
                    ...data.series,
                    data: (data.series as any).data.map((item: any, index: number) => ({
                        ...item,
                        itemStyle: {
                            ...item.itemStyle,
                            color: palette[index % palette.length]
                        }
                    }))
                }
                : data.series)
    };

    return res;
}

export async function LineThemeWrapper(data:EChartsOption, flags?: [boolean, boolean, boolean]){
    const [primary] = await getColorListAsync([ThemeColor.primary]);

    const paletteCount = Array.isArray(data.series) ? data.series.length : 1;
    const palette = await getChartPalette(paletteCount);

    const [showLabel, fillArea, smooth] = flags ?? [];

    const applyLineFlags = (s: SeriesOption) => {
        if (!isLineSeries(s)) return s;
        return {
            ...s,
            // 仅在开关为 true 时启用，不主动关闭已有配置
            smooth: smooth ? true : s.smooth,
            label: showLabel ? { 
                ...(s.label ?? {}), 
                show: true,
                color: primary
            } : s.label,
            areaStyle: fillArea ? { ...(s.areaStyle ?? {}), opacity: s.areaStyle?.opacity ?? 0.15 } : s.areaStyle,
        } as SeriesOption;
    };

    const themedSeries = Array.isArray(data.series)
        ? data.series.map(applyLineFlags)
        : (data.series ? applyLineFlags(data.series) : data.series);

    const res: EChartsOption = {
        ...data,
        color: palette,
        legend: {
            ...data.legend,
            textStyle: {
                ...(data.legend as any)?.textStyle,
                color: primary
            }
        },
        tooltip: {
            ...data.tooltip,
            textStyle: {
                ...(data.tooltip as any)?.textStyle,
                color: primary
            }
        },
        xAxis: {
            ...data.xAxis,
            axisLine: {
                ...(data as any).xAxis?.axisLine,
                lineStyle: {
                    ...(data as any).xAxis?.axisLine?.lineStyle,
                    color: primary
                }
            },
            axisTick: {
                ...(data as any).xAxis?.axisTick,
                lineStyle: {
                    ...(data as any).xAxis?.axisTick?.lineStyle,
                    color: primary
                }
            },
            axisLabel: {
                ...(data as any).xAxis?.axisLabel,
                color: primary
            }
        },
        yAxis: {
            ...data.yAxis,
            axisLine: {
                ...(data as any).yAxis?.axisLine,
                lineStyle: {
                    ...(data as any).yAxis?.axisLine?.lineStyle,
                    color: primary
                }
            },
            axisTick: {
                ...(data as any).yAxis?.axisTick,
                lineStyle: {
                    ...(data as any).yAxis?.axisTick?.lineStyle,
                    color: primary
                }
            },
            axisLabel: {
                ...(data as any).yAxis?.axisLabel,
                color: primary
            }
        },
        emphasis: {
            focus: 'series',
            itemStyle: {
                shadowBlur: 8,
                shadowOffsetX: 0,
                shadowColor: primary
            }
        },
        series: themedSeries
    };

    return res;
}

export type ChartKind = 'bar' | 'pie' | 'line';

export async function ThemeWrapper(
    data: EChartsOption,
    kind: ChartKind,
    props: any
) {
    switch (kind){
        case 'pie': {
            return PieThemeWrapper(data)
        }
        case 'bar': {
            return BarThemeWrapper(data)
        }
        case 'line' : {
            return LineThemeWrapper(data, props as [boolean, boolean, boolean])
        }
        default: {
            return data;
        }
    }
}
