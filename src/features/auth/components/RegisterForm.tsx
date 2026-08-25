import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    registerSchema,
    type RegisterFormData,
} from "../validation/authSchemas.ts";

import { registerUser } from "../api/authApi.ts";

export function RegisterForm() {
    const [serverError, setServerError] = useState<string | null>(null);

    
}