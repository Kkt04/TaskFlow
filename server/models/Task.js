const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
    {
        userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        title:       { type: String, required: true, trim: true },
        description: { type: String, default: '' },
        tag:         { type: String, enum: ['personal','work','urgent','learning','health'], default: 'personal' },
        dueDate:     { type: Date, default: null },
        done:        { type: Boolean, default: false },
    },
    { timestamps: true }   // createdAt + updatedAt
);

module.exports = mongoose.model('Task', taskSchema);
