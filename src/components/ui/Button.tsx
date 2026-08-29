import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: "primary" | "secondary" | "danger" | "ghost";
    fullWidth?: boolean;
}

export function Button({
    children,
    variant = "primary",
    fullWidth = false,
    className = "",
    ...props 
}: ButtonProps) {
    const baseStyles = "rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50";
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        danger: "bg-red-600 text-white hover:bg-red-700",
        ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
    };

    const width = fullWidth ? "w-full" : "";

    return(
        <button
            className={`${baseStyles} ${variants[variant]} ${width} ${className}`}
            {...props}
        >
            { children }
        </button>
    );
}