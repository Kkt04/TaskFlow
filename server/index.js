require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const path      = require('path');
const connectDB = require('./db');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── Connect to MongoDB first, then start server ──────────────────────────────
connectDB().then(() => {
    app.use(cors());
    app.use(express.json());
    app.use(express.static(path.join(__dirname, '../public')));

    // API routes
    app.use('/api/auth',  authRoutes);
    app.use('/api/tasks', taskRoutes);

    // Serve frontend for all other routes (SPA fallback)
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });

    app.listen(PORT, () =>
        console.log(`⚡  TaskFlow running → http://localhost:${PORT}`)
    );
});