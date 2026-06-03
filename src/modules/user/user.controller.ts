import type { Request, Response } from "express";
import { userService } from "./user.service.js";

const userCreate = async (req: Request, res: Response) => {
    try {
       const result = await userService.createUserIntoDB(req.body)
        res.status(200).json({
            message: 'Data received successfully',
            success: true,
        })
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message || 'Internal server error',
            errors: err.stack
        });
    }
}


export const userController = {
    userCreate
}