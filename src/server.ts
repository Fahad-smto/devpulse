// src/server.ts
import app from './app.js';
 import { initDb } from './db/index.js';

const PORT = 3000;

const startServer = async () => {
    try {
        await initDb();
        
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();