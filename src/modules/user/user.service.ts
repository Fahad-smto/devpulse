// src/modules/users/user.service.ts
import { pool } from "../../db/index.js";
import bcrypt from 'bcrypt';
import type { ICreateUser, IUserResponse,IUpdateUser,IUser } from "./user.interface.js";


export class UserService {
    
    // ইউজার তৈরি করুন
    async createUser(userData: ICreateUser): Promise<IUserResponse> {
        const { name, email, password, role = 'contributor' } = userData;
        
        // পাসওয়ার্ড হ্যাশ করুন
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const query = `
            INSERT INTO users (name, email, password, role, created_at, updated_at)
            VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            RETURNING id, name, email, role, created_at, updated_at
        `;
        
        const result = await pool.query(query, [name, email, hashedPassword, role]);
        return result.rows[0];
    }
    
    // ইমেইল দিয়ে ইউজার খুঁজুন
    async findUserByEmail(email: string): Promise<IUser | null> {
        const query = `SELECT * FROM users WHERE email = $1`;
        const result = await pool.query(query, [email]);
        return result.rows[0] || null;
    }
    
    // আইডি দিয়ে ইউজার খুঁজুন
    async findUserById(id: number): Promise<IUserResponse | null> {
        const query = `
            SELECT id, name, email, role, created_at, updated_at 
            FROM users WHERE id = $1
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0] || null;
    }
    
    // সব ইউজার পাওয়া
    async getAllUsers(): Promise<IUserResponse[]> {
        const query = `
            SELECT id, name, email, role, created_at, updated_at 
            FROM users ORDER BY id
        `;
        const result = await pool.query(query);
        return result.rows;
    }
    
    // ইউজার আপডেট করুন
    async updateUser(id: number, userData: IUpdateUser): Promise<IUserResponse | null> {
        const { name, email, password, role } = userData;
        let hashedPassword = null;
        
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }
        
        const query = `
            UPDATE users 
            SET 
                name = COALESCE($1, name),
                email = COALESCE($2, email),
                password = COALESCE($3, password),
                role = COALESCE($4, role),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $5
            RETURNING id, name, email, role, created_at, updated_at
        `;
        
        const result = await pool.query(query, [name, email, hashedPassword, role, id]);
        return result.rows[0] || null;
    }
    
    // ইউজার ডিলিট করুন
    async deleteUser(id: number): Promise<boolean> {
        const query = `DELETE FROM users WHERE id = $1 RETURNING id`;
        const result = await pool.query(query, [id]);
        return result.rows.length > 0;
    }
    
    // পাসওয়ার্ড ভেরিফাই করুন
    async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
    
    // ইউজারের ইমেইল আছে কিনা চেক করুন
    async isEmailExist(email: string, excludeId?: number): Promise<boolean> {
        let query = `SELECT id FROM users WHERE email = $1`;
        let params: any[] = [email];
        
        if (excludeId) {
            query += ` AND id != $2`;
            params.push(excludeId);
        }
        
        const result = await pool.query(query, params);
        return result.rows.length > 0;
    }
}