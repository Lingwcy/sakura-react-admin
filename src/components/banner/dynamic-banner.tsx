import defaultBanner from '@assets/banner/default-banner.jpg'
interface DynamicBannerProps {
    url?: string
}


export default function DynamicBanner({ url }: DynamicBannerProps) {
    if (!url) url = defaultBanner 
    const isVideBanner = () => {
        const videoExtensions = ['webm']
        return videoExtensions.find((item) => url.toLowerCase().endsWith(item))
    }

    return isVideBanner() ? (
        <video autoPlay loop muted
            className="max-h-[60px]  w-full object-cover rounded-t-sm">
            <source src={url} type="video/webm" />
        </video>
    ) : (
        <img className="max-h-[60px] w-full object-cover rounded-t-sm"
            src={url} />
    )
}