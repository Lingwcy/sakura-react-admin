import { Progress } from "../ui/progress";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";

export function RouteLoadingProgress() {
	const [progress, setProgress] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const location = useLocation();

	useEffect(() => {
		let progressTimer: NodeJS.Timeout;
		let completeTimer: NodeJS.Timeout;

		const startLoading = () => {
			setIsLoading(true);
			setProgress(0);
			let currentProgress = 0;

			// 快速增长到 30%
			const fastInterval = setInterval(() => {
				currentProgress += 10;
				setProgress(currentProgress);
				if (currentProgress >= 30) {
					clearInterval(fastInterval);

					// 然后慢速增长到 70%
					const slowInterval = setInterval(() => {
						currentProgress += 2;
						setProgress(currentProgress);
						if (currentProgress >= 70) {
							clearInterval(slowInterval);
						}
					}, 50);

					progressTimer = slowInterval;
				}
			}, 20);

			progressTimer = fastInterval;
		};

		const completeLoading = () => {
			if (progressTimer) {
				clearInterval(progressTimer);
			}

			// 快速完成到 100%
			setProgress(100);

			completeTimer = setTimeout(() => {
				setProgress(0);
				setIsLoading(false);
			}, 200);
		};

		// 开始加载
		startLoading();

		// 模拟路由加载完成
		const loadingCompleteTimer = setTimeout(() => {
			completeLoading();
		}, 100 + Math.random() * 200); // 300-500ms 的随机延迟

		return () => {
			if (progressTimer) clearInterval(progressTimer);
			if (completeTimer) clearTimeout(completeTimer);
			if (loadingCompleteTimer) clearTimeout(loadingCompleteTimer);
		};
	}, [location.pathname, location.hash]); // 监听路径和 hash 变化

	return isLoading && progress > 0 ? (
		<div className="fixed top-0 left-0 right-0 z-[99999] w-screen opacity-80">
			<Progress value={progress} className="h-[3px] shadow-2xl rounded-none" />
		</div>
	) : null;
}
