import express from 'express';
import router from './routes/api/index';  // Ensure this file exists and exports a Router
import db from './config/connection.js';

const startServer = async () => {
    await db();

    const PORT = process.env.PORT || 3001;
    const app = express();

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    // ✅ Ensure routes are mounted correctly at /api
    app.use('/api', router);

    app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
    });
};

startServer();
