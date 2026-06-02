import { Router, type Request, type Response } from "express";
import { userController } from "./user.controller.js";


const router = Router()

router.post('/', userController.userCreate)




export const userRouter = router