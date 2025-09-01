import { useFullscreen } from "@/hooks/use-full-screen"
import { useRef, useLayoutEffect } from 'react';
import { ChinaMapChart } from "@/components/charts"
import bgImage from './assets/bg.png'
import centerHeader from './assets/dataScreen-header-center-bg.png'
import ltImage from './assets/dataScreen-main-lt.png'
import lcImage from './assets/dataScreen-main-lc.png'
import lbImage from './assets/dataScreen-main-lb.png'
import cbImage from './assets/dataScreen-main-cb.png'
import rtImage from './assets/dataScreen-main-rt.png'
import rcImage from './assets/dataScreen-main-rc.png'
import rbImage from './assets/dataScreen-main-rb.png'
import headerLeftImage from './assets/dataScreen-header-left-bg.png'
import headerRightImage from './assets/dataScreen-header-right-bg.png'
import headerBtR from './assets/dataScreen-header-btn-bg-r.png'
import headerBtL from './assets/dataScreen-header-btn-bg-l.png'
export default function ScrrenPage() {
    const ref = useRef<HTMLDivElement>(null);
    useFullscreen(ref, true);
    const dataScreenRef = useRef<HTMLDivElement>(null);

    /* 浏览器监听 resize 事件 */
    const resize = () => {
        if (dataScreenRef.current) {
            dataScreenRef.current.style.transform = `scale(${getScale()})`;
        }
    };

    /* 根据浏览器大小推断缩放比例 */
    const getScale = (width = 1920, height = 1080) => {
        const ww = window.innerWidth / width;
        const wh = window.innerHeight / height;
        return ww < wh ? ww : wh;
    };

    useLayoutEffect(() => {
        if (dataScreenRef.current) {
            dataScreenRef.current.style.transformOrigin = 'center';
            dataScreenRef.current.style.transform = `scale(${getScale()})`;
            dataScreenRef.current.style.width = `1920px`;
            dataScreenRef.current.style.height = `1080px`;
        }
        // 为浏览器绑定事件
        window.addEventListener("resize", resize);
        return () => {
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <div
            style={{ backgroundImage: `url(${bgImage})` }}
            className="w-screen h-screen fixed top-0 left-0 z-20 bg-cover bg-fixed">
            {/* 
                
                top-1/2 left-1/2 只是把元素的左上角移动到父容器的中心。
                而 -translate-x-1/2 -translate-y-1/2 再把元素整体向左/上移动自身宽高的一半，
                最终效果是元素的中心点正好落在父容器的中心。

            */}
            <div ref={dataScreenRef} className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex w-[1920px] h-[1080px]">

                <aside className="w-[394px] h-full flex flex-col gap-[20px]">
                    <div className="h-[40px]  flex justify-end items-center bg-cover" style={{ backgroundImage: `url(${headerLeftImage})` }}>
                        <div className="h-full bg-no-repeat w-[130px] flex justify-center items-center bg-[100%,80%]" style={{ backgroundImage: `url(${headerBtR})` }}>
                            <span className="text-blue-300 font-bold ">首页</span>
                        </div>
                    </div>
                    <div className="h-[37%] bg-cover" style={{ backgroundImage: `url(${ltImage})` }}></div>
                    <div className="h-[30%] bg-cover" style={{ backgroundImage: `url(${lcImage})` }}></div>
                    <div className="h-[27%] bg-cover" style={{ backgroundImage: `url(${lbImage})` }}></div>
                </aside>

                <main className="flex-1 h-full flex flex-col gap-[20px]">
                    <div className="h-[80px] flex justify-center items-center bg-no-repeat bg-center  bg-[length:100%_100%]" style={{ backgroundImage: `url(${centerHeader})` }}>
                        <span 
                            style={{fontFamily: 'YouSheBiaoTiHei', color: '#05e8fe'}}
                            className=" tracking-widest  text-4xl">
                            入侵植物数据可视化平台
                        </span>
                    </div>
                    <div className="flex-1 bg-cover">
                        <ChinaMapChart />
                    </div>
                    <div className="h-[252px] m-5 bg-cover" style={{ backgroundImage: `url(${cbImage})` }}>

                    </div>
                </main>

                <aside className="w-[394px] h-full flex flex-col gap-[20px]">
                    <div className="h-[40px] bg-[100%] w-full flex justify-start items-center bg-cover" style={{ backgroundImage: `url(${headerRightImage})` }}>
                        <div className="h-full bg-no-repeat w-[130px] flex justify-center items-center bg-[100%,80%]" style={{ backgroundImage: `url(${headerBtL})` }}>
                            <span className="text-blue-300 font-bold ">灾情统计</span>
                        </div>
                    </div>
                    <div className="h-[37%] bg-cover" style={{ backgroundImage: `url(${rtImage})` }}></div>
                    <div className="h-[30%] bg-cover" style={{ backgroundImage: `url(${rcImage})` }}></div>
                    <div className="h-[27%] bg-cover" style={{ backgroundImage: `url(${rbImage})` }}></div>
                </aside>

            </div>
        </div>
    )
}