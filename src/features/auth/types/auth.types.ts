export interface RegisterRequest {
    fName: string;
    lName: string;
    email: string;
    password: string;
}

export interface User {
    id: string;
    fName: string;
    lName: string;
    email: string;
    createdAt: string;
}

export interface Workspace {
    id: string;
    name: string;
    slug: string;
    type: "personal" | "team";
    createdBy: string;
}

export interface RegisterResponse {
    user: User;
    workspace: Workspace;
    token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginUser {
  id: string;
  fName: string;
  lName: string;
  email: string;
  createdAt: string;
}

export interface LoginResponse {
  user: LoginUser;
  token: string;
}