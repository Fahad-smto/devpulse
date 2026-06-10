// src/modules/user/user.interface.ts

export interface IUser {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
    created_at: Date;
    updated_at: Date;
}

export interface ICreateUser {
    name: string;
    email: string;
    password: string;
    role?: string;
}

