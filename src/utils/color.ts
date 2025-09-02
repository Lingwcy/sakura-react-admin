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

