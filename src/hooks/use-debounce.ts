import { useState, useCallback, useRef, useEffect } from 'react';

const useDebounce = (initialValue: string, delay = 500) => {
    const [value, setValue] = useState(initialValue);
    const [debouncedValue, setDebouncedValue] = useState(initialValue);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const debounceSetValue = useCallback(
        (next: string) => {
            setValue(next); 
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            
            timerRef.current = setTimeout(() => {
                setDebouncedValue(next);
            }, delay);
        },
        [delay]
    );

    // 清理定时器
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    return [value, debouncedValue, debounceSetValue] as const;
};

export { useDebounce };
