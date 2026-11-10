const mongoose = require('mongoose');
const { MemoryTask } = require('../memoryStore');

const taskSchema = new mongoose.Schema(
    {
        userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        title:       { type: String, required: true, trim: true },
        description: { type: String, default: '' },
        tag:         { type: String, enum: ['personal','work','urgent','learning','health'], default: 'personal' },
        dueDate:     { type: Date, default: null },
        done:        { type: Boolean, default: false },
    },
    { timestamps: true }
);

const MongooseTask = mongoose.model('Task', taskSchema);

module.exports = {
    find(query) {
        if (global.__is_mongo_connected) {
            try {
                return MongooseTask.find(query);
            } catch (err) {
                console.warn('Mongoose Task.find failed, using memory fallback:', err.message);
            }
        }
        return MemoryTask.find(query);
    },
    async create(data) {
        if (global.__is_mongo_connected) {
            try {
                return await MongooseTask.create(data);
            } catch (err) {
                console.warn('Mongoose Task.create failed, using memory fallback:', err.message);
            }
        }
        return MemoryTask.create(data);
    },
    async findOneAndUpdate(query, updates, options) {
        if (global.__is_mongo_connected) {
            try {
                return await MongooseTask.findOneAndUpdate(query, updates, options);
            } catch (err) {
                console.warn('Mongoose Task.findOneAndUpdate failed, using memory fallback:', err.message);
            }
        }
        return MemoryTask.findOneAndUpdate(query, updates, options);
    },
    async findOneAndDelete(query) {
        if (global.__is_mongo_connected) {
            try {
                return await MongooseTask.findOneAndDelete(query);
            } catch (err) {
                console.warn('Mongoose Task.findOneAndDelete failed, using memory fallback:', err.message);
            }
        }
        return MemoryTask.findOneAndDelete(query);
    }
};
