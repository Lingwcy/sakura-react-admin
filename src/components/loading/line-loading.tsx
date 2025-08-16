import { useRef } from "react";
import "./line-loading.css";

export function LineLoading() {
	console.log('LineLoading 组件正在显示');
	const containerRef = useRef<HTMLDivElement>(null);
	return (
		<div className="m-auto flex h-full w-96 items-center justify-center">
			<div
				ref={containerRef}
				className="relative h-1.5 w-full overflow-hidden rounded"
			>哈哈哈哈哈哈哈哈哈哈哈哈
				<div
					className="absolute left-0 top-0 h-full w-1/3 animate-loading"
				/>
			</div>
		</div>
	);
}
