// src/modules/users/user.interface.ts

export interface IUser {
    id: number;
    name: string;
    email: string;
    password: string;
    role: 'contributor' | 'maintainer';
    created_at: Date;
    updated_at: Date;
}

export interface ICreateUser {
    name: string;
    email: string;
    password: string;
    role?: 'contributor' | 'maintainer';
}

export interface IUpdateUser {
    name?: string;
    email?: string;
    password?: string;
    role?: 'contributor' | 'maintainer';
}

export interface IUserResponse {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: Date;
    updated_at: Date;
}

export interface ILoginRequest {
    email: string;
    password: string;
}

export interface ILoginResponse {
    token: string;
    user: IUserResponse;
}