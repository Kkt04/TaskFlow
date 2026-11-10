const mongoose = require('mongoose');

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectDB() {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        throw new Error('MONGO_URI is not set in environment variables');
    }

    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
        });
    }

    try {
        cached.conn = await cached.promise;
        console.log('MongoDB connected');
    } catch (err) {
        cached.promise = null;
        console.error('MongoDB connection failed:', err.message);
        throw err;
    }

    return cached.conn;
}

module.exports = connectDB;
