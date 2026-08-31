import { createBrowserRouter } from "react-router-dom";
import { RegisterPage } from "../features/auth/pages/RegisterPage.tsx";
import { LoginPage } from "../features/auth/pages/LoginPage.tsx";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/register",
        element: <RegisterPage />
    },
]);
