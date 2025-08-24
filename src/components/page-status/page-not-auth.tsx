import NotAuth from '@/assets/page-status/403.svg'
import { Button } from '../ui/button'
import Icon from '../ui/icon'
import { useTabs } from '@/hooks/use-tabs'
import { AnimatePresence, motion } from 'motion/react'

export function PageNotAuth() {
    const tabs = useTabs()

    return (
        <div className="flex space-y-3 flex-col items-center justify-center p-5">
            <AnimatePresence>
                <motion.img
                    key="404-img"
                    src={NotAuth}
                    alt="页面未找到"
                    className="w-80 h-80 md:w-96 md:h-96 object-contain select-none pointer-events-none cursor-pointer"
                    initial={{ scale: 0.3 }}
                    animate={{ scale: [0.3, 1.3, 1] }}
                    exit={{scale: 0.8 }}
                    transition={{
                        duration: 0.6,
                        ease: 'easeInOut',
                    }}
                />
            </AnimatePresence>

            <p className="mt-6 italic text-gray-500 text-l">抱歉，您没有权限访问此页面</p>
            <Button
                className="cursor-pointer"
                onClick={() => tabs.navigateToTab('/hero/about-project')}
            >
                <Icon icon="line-md:upload-outline-loop" size={23} />
                回到首页
            </Button>
        </div>
    )
}