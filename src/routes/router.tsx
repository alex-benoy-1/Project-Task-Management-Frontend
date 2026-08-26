import { createBrowserRouter } from "react-router-dom";
import { RegisterPage } from "../features/auth/pages/RegisterPage.tsx";

export const router = createBrowserRouter([
    {
        path: "/register",
        element: <RegisterPage />
    },
]);
