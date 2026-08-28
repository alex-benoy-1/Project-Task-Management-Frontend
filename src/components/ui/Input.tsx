import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}

export function Input({
    error,
    className = "",
    ...props 
}: InputProps) {
    return (
        <input
            {...props}
            className={`
                w-full rounded-md border border-gray-300
                px-3 py-2 text-sm
                outline-none
                transition
                placeholder:text-gray-400
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
                disabled:cursor-not-allowed
                disabled:bg-gray-100
                ${error ? "border-red-500" : ""}
                ${className}
            `}
        />
    );
}