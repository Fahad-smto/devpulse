// src/modules/user/user.interface.ts


export interface ICreateUser {
    name: string;
    email: string;
    password: string;
    role?: string;
}

export interface IUpdateUser {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
}