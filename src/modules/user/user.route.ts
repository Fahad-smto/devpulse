// src/modules/users/user.routes.ts

import express from 'express';
import { UserController } from './user.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorize.middleware';

const router = express.Router();
const userController = new UserController();

// পাবলিক রাউটস
router.post('/signup', (req, res) => userController.signup(req, res));
router.post('/login', (req, res) => userController.login(req, res));

// প্রোটেক্টেড রাউটস (JWT প্রয়োজন)
router.get('/profile', authenticate, (req, res) => {
    // নিজের প্রোফাইল দেখার জন্য
    if (req.user) {
        userController.getUserById({ ...req, params: { id: req.user.id.toString() } } as any, res);
    }
});

router.get('/', authenticate, authorize(['maintainer']), (req, res) => 
    userController.getAllUsers(req, res)
);

router.get('/:id', authenticate, (req, res) => 
    userController.getUserById(req, res)
);

router.patch('/:id', authenticate, (req, res) => 
    userController.updateUser(req, res)
);

router.delete('/:id', authenticate, authorize(['maintainer']), (req, res) => 
    userController.deleteUser(req, res)
);

export default router;