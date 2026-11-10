require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const path      = require('path');
const connectDB = require('./db');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Ensure database connection or demo in-memory fallback is initialized before handling API routes
app.use('/api', async (req, res, next) => {
    try {
        await connectDB();
    } catch (err) {
        console.warn('[DATABASE] Init error, proceeding with demo fallback:', err.message);
    }
    next();
});

app.use('/api/auth',  authRoutes);
app.use('/api/tasks', taskRoutes);

// Fallback for SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server locally when not running on Vercel serverless platform
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () =>
        console.log(`⚡ TaskFlow running → http://localhost:${PORT}`)
    );
}

module.exports = app;
