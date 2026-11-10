const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// Pre-seed a demo account with sample tasks for instant live testing
const demoUserId = '6730c440e0a4f5b1c8e12340';
const demoPasswordHash = bcrypt.hashSync('demo123', 10);

if (!global.__taskflow_memory_db) {
    global.__taskflow_memory_db = {
        users: [
            {
                _id: demoUserId,
                username: 'demo',
                passwordHash: demoPasswordHash,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ],
        tasks: [
            {
                _id: '6730c458e0a4f5b1c8e12341',
                userId: demoUserId,
                title: 'Welcome to TaskFlow! 🎉',
                description: 'Explore the dashboard, create tasks, and test filtering.',
                tag: 'learning',
                dueDate: new Date(Date.now() + 86400000),
                done: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                _id: '6730c458e0a4f5b1c8e12342',
                userId: demoUserId,
                title: 'Review project features & documentation',
                description: 'Check out the README and modern dark-mode UI.',
                tag: 'work',
                dueDate: new Date(Date.now() + 2 * 86400000),
                done: true,
                createdAt: new Date(Date.now() - 3600000),
                updatedAt: new Date(),
            },
            {
                _id: '6730c458e0a4f5b1c8e12343',
                userId: demoUserId,
                title: 'Plan next product milestone',
                description: 'Set up high-priority tasks and deadlines.',
                tag: 'urgent',
                dueDate: new Date(Date.now() - 86400000),
                done: false,
                createdAt: new Date(Date.now() - 7200000),
                updatedAt: new Date(),
            }
        ]
    };
}

const db = global.__taskflow_memory_db;

const MemoryUser = {
    async findOne(query) {
        if (query.username) {
            const user = db.users.find(u => u.username === query.username.toLowerCase().trim());
            return user || null;
        }
        if (query._id) {
            const user = db.users.find(u => String(u._id) === String(query._id));
            return user || null;
        }
        return null;
    },
    async create(data) {
        const user = {
            _id: crypto.randomBytes(12).toString('hex'),
            username: data.username.toLowerCase().trim(),
            passwordHash: data.passwordHash,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        db.users.push(user);
        return user;
    }
};

const MemoryTask = {
    find(query) {
        const userId = String(query.userId);
        const list = db.tasks.filter(t => String(t.userId) === userId);
        return {
            sort(sortObj) {
                return [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            }
        };
    },
    async create(data) {
        const task = {
            _id: crypto.randomBytes(12).toString('hex'),
            userId: data.userId,
            title: data.title,
            description: data.description || '',
            tag: data.tag || 'personal',
            dueDate: data.dueDate ? new Date(data.dueDate) : null,
            done: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        db.tasks.push(task);
        return task;
    },
    async findOneAndUpdate(query, updates, options) {
        const taskId = String(query._id);
        const userId = String(query.userId);
        const index = db.tasks.findIndex(t => String(t._id) === taskId && String(t.userId) === userId);
        if (index === -1) return null;
        db.tasks[index] = {
            ...db.tasks[index],
            ...updates,
            updatedAt: new Date()
        };
        return db.tasks[index];
    },
    async findOneAndDelete(query) {
        const taskId = String(query._id);
        const userId = String(query.userId);
        const index = db.tasks.findIndex(t => String(t._id) === taskId && String(t.userId) === userId);
        if (index === -1) return null;
        const deleted = db.tasks.splice(index, 1)[0];
        return deleted;
    }
};

module.exports = {
    MemoryUser,
    MemoryTask
};
