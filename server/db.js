const mongoose = require('mongoose');

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectDB() {
    const mongoUri = process.env.MONGO_URI;

    // In Vercel serverless environment, if no cloud URI is provided or it points to localhost,
    // seamlessly use the in-memory store so the live site works out of the box.
    if (!mongoUri || (process.env.VERCEL && (mongoUri.includes('127.0.0.1') || mongoUri.includes('localhost')))) {
        if (!global.__logged_demo_mode) {
            console.log('⚡ [TaskFlow] Running in Demo In-Memory Mode (No external cloud MongoDB URI)');
            global.__logged_demo_mode = true;
        }
        global.__is_mongo_connected = false;
        return null;
    }

    if (cached.conn) {
        global.__is_mongo_connected = true;
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 3000,
            socketTimeoutMS: 20000,
            maxPoolSize: 10,
        });
    }

    try {
        cached.conn = await cached.promise;
        global.__is_mongo_connected = true;
        console.log('MongoDB connected');
        return cached.conn;
    } catch (err) {
        cached.promise = null;
        console.warn('MongoDB connection failed, falling back to Demo In-Memory Mode:', err.message);
        global.__is_mongo_connected = false;
        return null;
    }
}

module.exports = connectDB;
