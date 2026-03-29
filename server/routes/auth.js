const router   = require('express').Router();
const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');
const User      = require('../models/User');

// ─── POST /api/auth/register ─────────────────────────────────────────────────
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password)
            return res.status(400).json({ error: 'Username and password required' });

        if (password.length < 6)
            return res.status(400).json({ error: 'Password must be at least 6 characters' });

        // Check duplicate
        const existing = await User.findOne({ username: username.toLowerCase().trim() });
        if (existing)
            return res.status(409).json({ error: 'Username already taken' });

        // Hash password with bcrypt (salt rounds = 12)
        const passwordHash = await bcrypt.hash(password, 12);

        const user = await User.create({ username: username.toLowerCase().trim(), passwordHash });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        console.log(`[AUTH] New user registered: ${user.username} (${user._id})`);
        res.status(201).json({ token, username: user.username });

    } catch (err) {
        console.error('[AUTH] Register error:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password)
            return res.status(400).json({ error: 'Username and password required' });

        const user = await User.findOne({ username: username.toLowerCase().trim() });

        // Constant-time compare even when user not found (prevent timing attacks)
        const validPassword = user ? await bcrypt.compare(password, user.passwordHash) : false;

        if (!user || !validPassword)
            return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        console.log(`[AUTH] Login: ${user.username} at ${new Date().toISOString()}`);
        res.json({ token, username: user.username });

    } catch (err) {
        console.error('[AUTH] Login error:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;