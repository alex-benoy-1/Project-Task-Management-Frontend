import { api } from "../../../lib/api/client.ts";

import type {
    RegisterRequest,
    RegisterResponse
} from "../types/auth.types.ts";
import type { LoginRequest, LoginResponse } from "../types/auth.types";

export const registerUser = async (
    data: RegisterRequest,
): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>(
        "/auth/register",
        data
    );

    return response.data;
}

export const loginUser = async (
  data: LoginRequest,
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    "/auth/login",
    data,
  );

  return response.data;
};