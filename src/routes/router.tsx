import { createBrowserRouter } from "react-router-dom";
import { RegisterPage } from "../features/auth/pages/RegisterPage.tsx";
import { LoginPage } from "../features/auth/pages/LoginPage.tsx";
import { HomePage } from "../pages/HomePage.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/register",
        element: <RegisterPage />
    },
]);
