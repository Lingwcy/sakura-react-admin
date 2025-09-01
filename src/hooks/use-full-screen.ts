import { useCallback, useEffect, useState } from 'react';

export function useFullscreen(ref: React.RefObject<HTMLElement>, open?: boolean) {
    const [isFullscreen, setIsFullscreen] = useState(false);


    const enter = useCallback(() => {
        ref.current?.requestFullscreen?.();
    }, [ref]);

    const exit = useCallback(() => {
        document.exitFullscreen?.();
    }, []);

    /**
     * document.fullscreenElement 是 Fullscreen API 提供的一个只读属性，
     * 用来告诉“当前页面里到底是哪个元素处于全屏状态”。
     */
    useEffect(() => {
        const onChange = () => setIsFullscreen(!!document.fullscreenElement);
        /**
         * 监听全屏状态变化，让 React 组件能实时知道当前是不是全屏
         */
        document.addEventListener('fullscreenchange', onChange);
        return () => document.removeEventListener('fullscreenchange', onChange);
    }, []);

    useEffect(() => {
        if (open && ref.current && !document.fullscreenElement) {
            ref.current.requestFullscreen?.();
        }
    }, [open, ref]);

    return { isFullscreen, enter, exit };
}