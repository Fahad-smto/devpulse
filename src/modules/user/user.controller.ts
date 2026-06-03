import type { Request, Response } from "express";
import { pool } from "../../db/index.js";

const userCreate = async (req: Request, res: Response) => {
    try {

        res.status(200).json({
            message: 'Data received successfully',
            success: true,
            data: {
                name,
                email,
                password
            }
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