import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { useCurrentManager } from "@/hooks/use-manager";
import useUserStore from "@/store/userStore";

type AuthRouteProps = {
	children: ReactNode;
};

export function AuthRoute({ children }: AuthRouteProps) {
	const location = useLocation();
	const token = useUserStore((state) => state.userToken.token);
	const sessionQuery = useCurrentManager();

	if (!token) {
		return <Navigate to="/login" replace state={{ from: location }} />;
	}

	if (sessionQuery.isPending) {
		return (
			<div className="grid min-h-svh place-items-center text-sm text-muted-foreground">
				正在验证管理员会话…
			</div>
		);
	}

	if (sessionQuery.isError || !sessionQuery.data) {
		return <Navigate to="/login" replace state={{ from: location }} />;
	}

	return <>{children}</>;
}
