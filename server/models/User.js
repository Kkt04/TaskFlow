const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const { MemoryUser } = require('../memoryStore');

const userSchema = new mongoose.Schema(
    {
        username:     { type: String, required: true, unique: true, trim: true, lowercase: true },
        passwordHash: { type: String, required: true },
    },
    { timestamps: true }
);

userSchema.methods.comparePassword = function (plain) {
    return bcrypt.compare(plain, this.passwordHash);
};

const MongooseUser = mongoose.model('User', userSchema);

module.exports = {
    async findOne(query) {
        if (global.__is_mongo_connected) {
            try {
                return await MongooseUser.findOne(query);
            } catch (err) {
                console.warn('Mongoose User.findOne failed, using memory fallback:', err.message);
            }
        }
        return MemoryUser.findOne(query);
    },
    async create(data) {
        if (global.__is_mongo_connected) {
            try {
                return await MongooseUser.create(data);
            } catch (err) {
                console.warn('Mongoose User.create failed, using memory fallback:', err.message);
            }
        }
        return MemoryUser.create(data);
    }
};
