const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        username:     { type: String, required: true, unique: true, trim: true, lowercase: true },
        passwordHash: { type: String, required: true },
    },
    { timestamps: true }   // adds createdAt + updatedAt automatically
);

// Instance method — compare a plain-text password against the stored hash
userSchema.methods.comparePassword = function (plain) {
    return bcrypt.compare(plain, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
