import { 
    createBrowserRouter,
 } from "react-router";
import Layout from "@pages/Layout";
import Login from "@/pages/Login";
import { AuthRoute } from "@/components/AuthRoute";
const router = createBrowserRouter([
    {
        path:'/',
        element: <AuthRoute><Layout/></AuthRoute>
    },
    {
        path:'/login',
        Component: Login
    }
])


export default router