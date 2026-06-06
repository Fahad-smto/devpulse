// src/modules/user/user.service.ts
import { pool } from '../../db/index.js';
import bcrypt from 'bcrypt';
import type { ICreateUser, IUpdateUser } from './user.interface.js';

const getAllUsersFromDB = async () => {
    const result = await pool.query(
        'SELECT id, name, email, role, created_at FROM users ORDER BY id'
    );
    return result.rows;
};

const getUserByIdFromDB = async (id: number) => {
    const result = await pool.query(
        'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
        [id]
    );
    return result.rows[0];
};

const createUserInDB = async (userData: ICreateUser) => {
    const { name, email, password, role = 'contributor' } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
        `INSERT INTO users (name, email, password, role) 
         VALUES ($1, $2, $3, $4) 
         RETURNING id, name, email, role, created_at`,
        [name, email, hashedPassword, role]
    );
    return result.rows[0];
};

const updateUserInDB = async (id: number, userData: IUpdateUser) => {
    const { name, email, password, role } = userData;
    let hashedPassword = null;
    
    if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
    }
    
    const result = await pool.query(
        `UPDATE users 
         SET 
            name = COALESCE($1, name),
            email = COALESCE($2, email),
            password = COALESCE($3, password),
            role = COALESCE($4, role),
            updated_at = CURRENT_TIMESTAMP
         WHERE id = $5 
         RETURNING id, name, email, role, created_at`,
        [name, email, hashedPassword, role, id]
    );
    return result.rows[0];
};

const deleteUserFromDB = async (id: number) => {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    return result.rows.length > 0;
};

const findUserByEmail = async (email: string) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
};

export const userServices = {
  
    getUserByIdFromDB,
    createUserInDB,
    updateUserInDB,
    deleteUserFromDB,
    findUserByEmail
};