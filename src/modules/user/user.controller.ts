// src/modules/users/user.controller.ts

import { Request, Response } from 'express';
import { UserService } from './user.service';
import { signToken } from '../../utils/jwt.utils';
import { ICreateUser, ILoginRequest } from './user.interface.js';

const userService = new UserService();

export class UserController {
    
    // ইউজার রেজিস্ট্রেশন
    async signup(req: Request, res: Response): Promise<void> {
        try {
            const { name, email, password, role } = req.body;
            
            // ভ্যালিডেশন
            if (!name || !email || !password) {
                res.status(400).json({
                    success: false,
                    message: 'Name, email and password are required'
                });
                return;
            }
            
            if (password.length < 6) {
                res.status(400).json({
                    success: false,
                    message: 'Password must be at least 6 characters'
                });
                return;
            }
            
            // ইমেইল চেক করুন
            const emailExists = await userService.isEmailExist(email);
            if (emailExists) {
                res.status(409).json({
                    success: false,
                    message: 'User already exists with this email'
                });
                return;
            }
            
            // ইউজার তৈরি করুন
            const userData: ICreateUser = { name, email, password, role };
            const newUser = await userService.createUser(userData);
            
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: newUser
            });
            
        } catch (error: any) {
            console.error('Signup error:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Registration failed'
            });
        }
    }
    
    // ইউজার লগইন
    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password }: ILoginRequest = req.body;
            
            if (!email || !password) {
                res.status(400).json({
                    success: false,
                    message: 'Email and password are required'
                });
                return;
            }
            
            // ইউজার খুঁজুন
            const user = await userService.findUserByEmail(email);
            if (!user) {
                res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
                return;
            }
            
            // পাসওয়ার্ড ভেরিফাই করুন
            const isValidPassword = await userService.verifyPassword(password, user.password);
            if (!isValidPassword) {
                res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
                return;
            }
            
            // JWT টোকেন তৈরি করুন
            const token = signToken({
                id: user.id,
                name: user.name,
                role: user.role
            });
            
            // পাসওয়ার্ড বাদ দিন
            const { password: _, ...userWithoutPassword } = user;
            
            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    token,
                    user: userWithoutPassword
                }
            });
            
        } catch (error: any) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Login failed'
            });
        }
    }
    
    // সব ইউজার পাওয়া (শুধু maintainer)
    async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await userService.getAllUsers();
            
            res.status(200).json({
                success: true,
                data: users
            });
            
        } catch (error: any) {
            console.error('Get users error:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to fetch users'
            });
        }
    }
    
    // একক ইউজার পাওয়া
    async getUserById(req: Request, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.params.id);
            
            if (isNaN(userId)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid user ID'
                });
                return;
            }
            
            const user = await userService.findUserById(userId);
            
            if (!user) {
                res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
                return;
            }
            
            res.status(200).json({
                success: true,
                data: user
            });
            
        } catch (error: any) {
            console.error('Get user error:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to fetch user'
            });
        }
    }
    
    // ইউজার আপডেট করুন (শুধু নিজের প্রোফাইল)
    async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.params.id);
            const { name, email, password, role } = req.body;
            
            if (isNaN(userId)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid user ID'
                });
                return;
            }
            
            // চেক করুন ইউজার আছে কিনা
            const existingUser = await userService.findUserById(userId);
            if (!existingUser) {
                res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
                return;
            }
            
            // পারমিশন চেক: শুধু নিজের প্রোফাইল আপডেট করতে পারবে (অথবা maintainer)
            if (req.user?.id !== userId && req.user?.role !== 'maintainer') {
                res.status(403).json({
                    success: false,
                    message: 'You can only update your own profile'
                });
                return;
            }
            
            // ইমেইল চেক করুন (অন্য ইউজার ব্যবহার করছে কিনা)
            if (email && email !== existingUser.email) {
                const emailExists = await userService.isEmailExist(email, userId);
                if (emailExists) {
                    res.status(409).json({
                        success: false,
                        message: 'Email already exists'
                    });
                    return;
                }
            }
            
            // ইউজার আপডেট করুন
            const updatedUser = await userService.updateUser(userId, { name, email, password, role });
            
            res.status(200).json({
                success: true,
                message: 'User updated successfully',
                data: updatedUser
            });
            
        } catch (error: any) {
            console.error('Update user error:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to update user'
            });
        }
    }
    
    // ইউজার ডিলিট করুন (শুধু maintainer)
    async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.params.id);
            
            if (isNaN(userId)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid user ID'
                });
                return;
            }
            
            // চেক করুন ইউজার আছে কিনা
            const existingUser = await userService.findUserById(userId);
            if (!existingUser) {
                res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
                return;
            }
            
            // পারমিশন চেক: শুধু maintainer ডিলিট করতে পারবে
            if (req.user?.role !== 'maintainer') {
                res.status(403).json({
                    success: false,
                    message: 'Only maintainers can delete users'
                });
                return;
            }
            
            // ইউজার ডিলিট করুন
            await userService.deleteUser(userId);
            
            res.status(200).json({
                success: true,
                message: 'User deleted successfully'
            });
            
        } catch (error: any) {
            console.error('Delete user error:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to delete user'
            });
        }
    }
}