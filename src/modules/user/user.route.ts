// src/modules/user/user.routes.ts
import express from 'express';
import { userController } from './user.controller.js';
 

const router = express.Router();

// Routes
router.get('/', userController.getAllUsers);      // GET /api/v1/users
router.get('/:id', userController.getUserById);   // GET /api/v1/users/1
router.post('/', userController.createUser);      // POST /api/v1/users
router.put('/:id', userController.updateUser);    // PUT /api/v1/users/1
router.delete('/:id', userController.deleteUser); // DELETE /api/v1/users/1

// export default router;