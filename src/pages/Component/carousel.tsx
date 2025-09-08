
import trans2 from '@/assets/banner/trans2.jpg'
import trans3 from '@/assets/banner/trans3.jpg'
import trans4 from '@/assets/banner/trans4.jpg'
import trans5 from '@/assets/banner/trans5.jpg'
import { useMemo } from 'react'
import { CardData } from '@/components/card-carousel'
import CardCarousel from '@/components/card-carousel'
export default function CarouselPage() {
    const cardsData: CardData[] = useMemo(() => [
        {
            id: 2,
            title: '图2',
            content: '内容2',
            image: trans2,
            backgroundColor: '#1d262d',
        },
        {
            id: 3,
            title: '图3',
            content: '内容3',
            image: trans3,
            backgroundColor: '#1d262d',
        },
        {
            id: 4,
            title: '图4',
            content: '内容4',
            image: trans4,
            backgroundColor: '#1d262d',
        },
        {
            id: 5,
            title: '图5',
            content: '内容5',
            image: trans5,
            backgroundColor: '#1d262d',
        },
    ], []);

    return (
        <div className='flex flex-col items-center  justify-center'>
            <p className='italic'>纯 react , 无任何第三方库或组件库依赖, 即插即用</p>
            <div className='p-5 bg-primary rounded-2xl'>
                <CardCarousel
                    cards={cardsData}
                    autoPlayInterval={3000}
                    pauseOnHover={true}
                    className=""
                />
            </div>
        </div>
    )
}