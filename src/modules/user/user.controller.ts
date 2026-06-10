// src/modules/user/user.controller.ts
// src/modules/user/user.controller.ts
import type { Request, Response } from "express";
import { userServices } from "./user.service.js";
import bcrypt from 'bcrypt';

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const result = await userServices.getAllUsersFromDB();
        return res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getUserById = async (req: Request, res: Response) => {
    try {
        const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

        if (!idParam) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }

        const userId = parseInt(idParam, 10);

        if (isNaN(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }
        
        const result = await userServices.getUserByIdFromDB(userId);
        
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "User retrieved successfully",
            data: result,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;
        
        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required",
            });
        }
        
        // Check if email already exists
        const existingUser = await userServices.findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already exists",
            });
        }
        
        const result = await userServices.createUserInDB({ name, email, password, role });
        
        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: result,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateUser = async (req: Request, res: Response) => {
    try {
        const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

        if (!idParam) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }

        const userId = parseInt(idParam, 10);

        if (isNaN(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }
        
        const updated = await userServices.updateUserInDB(userId, req.body);
        
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updated,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const deleteUser = async (req: Request, res: Response) => {
    try {
        const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

        if (!idParam) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }

        const userId = parseInt(idParam, 10);

        if (isNaN(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }
        
        const deleted = await userServices.deleteUserFromDB(userId);
        
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const userController = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};