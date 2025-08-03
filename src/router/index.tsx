import {
    createBrowserRouter,
} from "react-router";
import Layout from "@pages/Layout";
import Login from "@/pages/Login";
import { AuthRoute } from "@/components/auth-route";
import Home from "@/pages/Home";
import Article from "@/pages/Article";
import Publish from "@/pages/Publish";
import CssPlaygroundLayout from "@/pages/CssPlayground";
import { TwoWingsMiddle } from "@/components/css-playground";
import ComponentLayout from "@/pages/Component";
import ServerCardPlayground from "@/pages/Component/server-card-playground";
import ServerComponentLayout from "@/pages/Server";
import ArchiveServerPage from "@/pages/Server/achrive-list";
import ToolsComponentLayout from "@/pages/Tools";
import APITools from "@/pages/Tools/api-tool";
import BorderLoading from "@/components/loading/border-loading";
import UserManagementLayout from "@/pages/UserManagement";
import AdminUserManagement from "@/pages/UserManagement/admin-user-management";
import FontUserManagement from "@/pages/UserManagement/font-user-management";
const router = createBrowserRouter([
    {
        path: '/',
        element: <AuthRoute><Layout /></AuthRoute>,
        children: [
            {
                path: 'home',
                Component: Home
            },
            {
                path: 'article',
                Component: Article
            },
            {
                path: 'publish',
                Component: Publish
            },
            {
                path: 'server',
                element: <ServerComponentLayout />,
                children: [
                    {
                        path: 'archive',
                        Component: ArchiveServerPage
                    }
                ]

            },
            {
                path: 'usermanagement',
                element: <UserManagementLayout />,
                children: [
                    {
                        path: 'user',
                        Component: AdminUserManagement
                    },
                    {
                        path: 'font-user',
                        Component: FontUserManagement
                    }
                ]
            },
            {
                path: 'tool',
                element: <ToolsComponentLayout />,
                children: [
                    {
                        path: 'api',
                        Component: APITools
                    }
                ]
            },
            {
                path: 'cssplayground',
                element: <CssPlaygroundLayout />,
                children: [
                    {
                        path: 'twowings',
                        Component: TwoWingsMiddle
                    },
                    {
                        path: 'loading-2',
                        element: <BorderLoading mode="dev" />
                    }
                ]
            },
            {
                path: 'component',
                element: <ComponentLayout />,
                children: [
                    {
                        path: 'servercard',
                        Component: ServerCardPlayground
                    }
                ]

            }
        ]
    },
    {
        path: '/login',
        Component: Login
    },
])


export default router