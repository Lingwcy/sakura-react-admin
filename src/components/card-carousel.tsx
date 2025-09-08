import { useMemo, useLayoutEffect, useRef } from 'react';
import { useCarousel } from '@/hooks/use-carousel';


// 过渡配置常量
const TRANSITION_DURATION = 350; // ms
const TRANSITION_EASING = 'ease';

export interface CardData {
  id: string | number;
  image?: string;
  backgroundColor?: string;
}

export interface CardCarouselProps {
  cards: CardData[];
  autoPlayInterval?: number;
  pauseOnHover?: boolean;
  className?: string;
}

export default function CardCarousel({
  cards,
  autoPlayInterval = 30,
  pauseOnHover = true,
  className = '',
}: CardCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const {
    currentIndex,
    logicalIndex,
    isPlaying,
    nextSlide,
    prevSlide,
    goToSlide,
    immediateJump,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseEnter,
    handleMouseLeave,
  } = useCarousel({
    itemCount: cards.length,
    autoPlayInterval,
    pauseOnHover,
    infinite: true,
  });

  // 构造扩展卡片（首尾克隆）
  const extendedCards = useMemo(() => {
    if (cards.length === 0) return [];
    if (cards.length === 1) return cards;
    return [cards[cards.length - 1], ...cards, cards[0]];
  }, [cards]);

  // 布局与过渡控制
  useLayoutEffect(() => {
    if (!trackRef.current || cards.length <= 1) return;
    const track = trackRef.current;
    const total = extendedCards.length; // itemCount + 2
    const percentPerSlide = 100 / total; 

    // 应用动画位移
    track.style.transition = `transform ${TRANSITION_DURATION}ms ${TRANSITION_EASING}`;
    track.style.transform = `translateX(-${currentIndex *  percentPerSlide}%)`;

    const handleEnd = () => {
      if (!trackRef.current) return;
      // 左越界 -> 跳到最后一张真实
      if (currentIndex === 0) {
        trackRef.current.style.transition = 'none';
        immediateJump(cards.length);
        trackRef.current.style.transform = `translateX(-${cards.length * percentPerSlide}%)`;
      // 右越界 -> 跳到第一张真实
      } else if (currentIndex === cards.length + 1) {
        trackRef.current.style.transition = 'none';
        immediateJump(1);
        trackRef.current.style.transform = `translateX(-${1 * percentPerSlide}%)`;
      }
    };

    track.addEventListener('transitionend', handleEnd);
    return () => track.removeEventListener('transitionend', handleEnd);
  }, [currentIndex, cards.length, extendedCards.length, immediateJump]);

  if (cards.length === 0) {
    return (
      <div className={`carousel-container empty  ${className}`} role="region" >
        <div className="empty-state">暂无卡片数据</div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full h-auto select-none ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="overflow-hidden relative">
        <div
          ref={trackRef}
            className="flex h-auto"
          style={{ width: `${extendedCards.length * 100}%` }}
        >
          {extendedCards.map((card, index) => (
            <div
              key={`${card.id}-${index}`}
              style={{
                backgroundColor: card.backgroundColor || '#ffffff',
                width: `${100 / extendedCards.length}%`,
              }}
            >
              {card.image && (
                <div className=" transform duration-200 hover:scale-[1.05]">
                  <img src={card.image} alt="" draggable={false} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className= "translate-x-[-50%] gap-[1rem] absolute bottom-[1rem] left-[50%] flex  "  >
        {cards.map((_, index) => {
          const active = index === logicalIndex;
          return (
            <button
              key={index}
              role="tab"
              className={`w-[0.75rem] h-[0.75rem] transform cursor-pointer duration-200 hover:scale-[1.5] bg-gray-200 rounded-2xl ${active ? 'bg-gray-500' : ''}`}
              onClick={() => goToSlide(index)}
            />
          );
        })}
      </div>

      <button
        className=" text-4xl cursor-pointer transform duration-200 hover:opacity-100 absolute top-[50%] rounded-2xl opacity-60 left-1.5 w-[2.5rem] h-[5rem] translate-y-[-50%] bg-amber-50"
        onClick={prevSlide}
        type="button"
      >
        ‹
      </button>
      <button
        className="text-4xl cursor-pointer transform duration-200 hover:opacity-100 absolute top-[50%] rounded-2xl opacity-60 right-1.5 w-[2.5rem] h-[5rem] translate-y-[-50%] bg-amber-50"
        onClick={nextSlide}
        type="button"
      >
        ›
      </button>

      <div className="absolute top-[1rem] right-[1rem] bg-amber-50 w-[5rem] h-[2rem]  flex justify-center items-center rounded-2xl opacity-70 font-bold" >
        {isPlaying ? '播放中' : '已暂停'}
      </div>
    </div>
  );
};

