import { useState, useEffect, useCallback, useRef } from 'react';

// ===== 常量区域 =====
const DEFAULT_AUTOPLAY_INTERVAL = 0;
const SWIPE_THRESHOLD = 50; // 触摸滑动最小距离

export interface UseCarouselOptions {
  itemCount: number;
  autoPlayInterval?: number;
  pauseOnHover?: boolean;
  infinite?: boolean;
}

export interface UseCarouselReturn {
  currentIndex: number;        // 包含克隆位（0..itemCount+1）
  logicalIndex: number;        // 真实索引（0..itemCount-1）
  isPlaying: boolean;
  nextSlide: () => void;
  prevSlide: () => void;
  goToSlide: (index: number) => void; // 动画跳转到真实索引
  immediateJump: (index: number) => void; // 无动画内部重定位
  pause: () => void;
  resume: () => void;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
}

export const useCarousel = ({
  itemCount,
  autoPlayInterval = DEFAULT_AUTOPLAY_INTERVAL,
  pauseOnHover = true,
  infinite = false,
}: UseCarouselOptions): UseCarouselReturn => {
  // ===== 状态与引用 =====
  const [currentIndex, setCurrentIndex] = useState(() => (infinite ? 1 : 0));
  const [isPlaying, setIsPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const intervalRef = useRef<number | null>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const isTouching = useRef(false);

  // ===== 基础动作 =====
  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => {
      if (!infinite) {
        return itemCount === 0 ? 0 : (prev + 1) % itemCount;
      }
      if (itemCount === 0) return 0;
      const upperClone = itemCount + 1; // 右侧克隆位
      if (prev >= upperClone) return prev; // 等待复位
      return prev + 1;
    });
  }, [itemCount, infinite]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(prev => {
      if (!infinite) {
        return itemCount === 0 ? 0 : (prev - 1 + itemCount) % itemCount;
      }
      if (itemCount === 0) return 0;
      if (prev <= 0) return prev; // 等待复位
      return prev - 1;
    });
  }, [itemCount, infinite]);

  // 跳到真实索引（带动画）
  const goToSlide = useCallback((index: number) => {
    if (itemCount === 0) return;
    const clamped = Math.max(0, Math.min(index, itemCount - 1));
    setCurrentIndex(infinite ? clamped + 1 : clamped);
  }, [infinite, itemCount]);

  // 无动画内部跳转（复位）
  const immediateJump = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // ===== 播放控制 =====
  const pause = useCallback(() => {
    setIsPlaying(false);
    setIsPaused(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resume = useCallback(() => {
    if (!isTouching.current) {
      setIsPlaying(true);
      setIsPaused(false);
    }
  }, []);

  // ===== 触摸交互 =====
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    isTouching.current = true;
    pause();
  }, [pause]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!isTouching.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if(diff === touchStartX.current) return;
    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    isTouching.current = false;
    // 延迟恢复（防抖）
    setTimeout(() => {
      if (!isTouching.current) resume();
    }, 0);
  }, [nextSlide, prevSlide, resume]);

  // ===== 悬停交互 =====
  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) pause();
  }, [pauseOnHover, pause]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover && !isTouching.current) {
      setTimeout(() => {
        if (!isTouching.current) resume();
      }, 0);
    }
  }, [pauseOnHover, resume]);

  // ===== 自动播放 Effect =====
  useEffect(() => {
    if (isPlaying && !isPaused && itemCount > 1) {
      intervalRef.current = setInterval(() => {
        nextSlide();
      }, autoPlayInterval);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, isPaused, itemCount, autoPlayInterval, nextSlide]);

  // itemCount 变化时的安全校正（例如数据异步加载或减少）
  useEffect(() => {
    if (itemCount <= 0) {
      setCurrentIndex(0);
      return;
    }
    // 非无限：确保 currentIndex 在 0..itemCount-1
    if (!infinite) {
      setCurrentIndex(prev => Math.min(prev, Math.max(0, itemCount - 1)));
      return;
    }
    // 无限：允许 1..itemCount 之间，若越界重置到 1
    setCurrentIndex(prev => {
      if (prev === 0) return 1; // 左克隆位未来由组件复位，保持最小干预
      if (prev > itemCount + 1) return itemCount; // 防御性
      return prev;
    });
  }, [itemCount, infinite]);

  // 卸载清理
  useEffect(() => () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  // 真实索引计算
  const logicalIndex = infinite ? ((currentIndex - 1 + itemCount) % itemCount) : currentIndex;

  return {
    currentIndex,
    logicalIndex,
    isPlaying,
    nextSlide,
    prevSlide,
    goToSlide,
    immediateJump,
    pause,
    resume,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseEnter,
    handleMouseLeave,
  };
};
