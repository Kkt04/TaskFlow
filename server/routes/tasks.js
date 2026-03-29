const router = require('express').Router();
const authMw = require('../middleware/auth');
const Task   = require('../models/Task');

// All routes require a valid JWT
router.use(authMw);

// ─── GET /api/tasks ───────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: 'Could not fetch tasks' });
    }
});

// ─── POST /api/tasks ──────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
    try {
        const { title, description, tag, dueDate } = req.body;
        if (!title) return res.status(400).json({ error: 'Title is required' });

        const task = await Task.create({
            userId: req.userId,
            title,
            description: description || '',
            tag: tag || 'personal',
            dueDate: dueDate || null,
        });
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ error: 'Could not create task' });
    }
});

// ─── PATCH /api/tasks/:id ─────────────────────────────────────────────────────
router.patch('/:id', async (req, res) => {
    try {
        const allowed = ['title', 'description', 'tag', 'dueDate', 'done'];
        const updates = Object.fromEntries(
            Object.entries(req.body).filter(([k]) => allowed.includes(k))
        );
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            updates,
            { new: true, runValidators: true }
        );
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: 'Could not update task' });
    }
});

// ─── DELETE /api/tasks/:id ────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Could not delete task' });
    }
});

module.exports = router;