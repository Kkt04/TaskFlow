const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectDB() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGO_URI, {
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