import { Suspense, lazy } from "react";
import { Outlet } from "react-router";

import { BorderLoading } from "@/components/loading";

import { AppRouteObject } from "@/types/router";


const Page404 = lazy(() => import("@/pages/Component/page-not-found-test"));

/**
 * error routes
 * 403, 404, 500
 */
export const ERROR_ROUTE: AppRouteObject = {
	element: (
		<Suspense fallback={<BorderLoading />}>
			<Outlet />
		</Suspense>
	),
	children: [
		{ path: "404", element: <Page404 /> },
	],
};


