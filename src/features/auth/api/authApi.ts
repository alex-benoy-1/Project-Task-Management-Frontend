import { api } from "../../../lib/api/client.ts";

import type {
    RegisterRequest,
    RegisterResponse
} from "../types/auth.types.ts";

export const registerUser = async (
    data: RegisterRequest,
): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>(
        "/auth/register",
        data
    );

    return response.data;
}