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
import ServerList from "@/pages/Server/server-list";
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
                path:'server',
                element:<ServerComponentLayout/>,
                children: [
                    {
                        path: 'list',
                        Component: ServerList
                    }
                ]

            },
            {
                path: 'cssplayground',
                element: <CssPlaygroundLayout/>,
                children: [
                    {
                        path: 'twowings',
                        Component: TwoWingsMiddle
                    }
                ]
            },
            {
                path:'component',
                element: <ComponentLayout/>,
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