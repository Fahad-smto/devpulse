// src/app.ts
import express from 'express';
import userRouter from './modules/user/user.route.js';
 

const app = express();

// Middleware
app.use(express.json());

// Home route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'DevPulse API is running!',
        endpoints: {
            getAllUsers: 'GET  /api/v1/users',
            getUserById: 'GET  /api/v1/users/:id',
            createUser: 'POST /api/v1/users',
            updateUser: 'PUT  /api/v1/users/:id',
            deleteUser: 'DELETE /api/v1/users/:id'
        }
    });
});

// User routes
app.use('/api/v1/users', userRouter);

// 404 handler
// app.use((req, res) => {
//     res.status(404).json({
//         success: false,
//         message: 'Route not found'
//     });
// });

export default app;