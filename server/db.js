const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskflow';

async function connectDB() {
    try {
        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
        });
        console.log(`MongoDB connected`);
    } catch (err) {
        console.error('MongoDB connection failed:', err.message);
    }
}

module.exports = connectDB;