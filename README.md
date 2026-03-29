# ⚡ TaskFlow — Smart Task Manager

A clean, full-stack task management web app built with **Node.js**, **Express**, **MongoDB**, and a vanilla JS frontend. TaskFlow lets you register/login, create tasks with categories and due dates, mark them done, and delete them — all in a slick dark-themed UI.

---

## 🚀 Features

- **Authentication** — JWT-based register & login with bcrypt password hashing
- **Task CRUD** — Create, read, update (toggle done), and delete tasks
- **Categories** — Tag tasks as `personal`, `work`, `urgent`, `learning`, or `health`
- **Due Dates** — Set due dates with overdue/soon indicators
- **Live Stats** — Dashboard showing total, in-progress, completed, and overdue counts
- **Filters** — Filter tasks by status or category
- **Auto-Polling** — Task list refreshes every 10 seconds in the background
- **Responsive UI** — Works on mobile and desktop
- **Toast Notifications** — Instant feedback on every action

---

## 🛠 Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Runtime    | Node.js                           |
| Framework  | Express.js                        |
| Database   | MongoDB + Mongoose                |
| Auth       | JSON Web Tokens (JWT) + bcryptjs  |
| Frontend   | Vanilla JS, HTML, CSS             |
| Dev Tools  | nodemon, dotenv                   |

---

## 📁 Project Structure

```
taskflow/
├── public/
│   ├── index.html       # SPA entry point
│   ├── app.js           # Frontend logic (auth, task CRUD, rendering)
│   └── style.css        # Dark-themed UI styles
├── server/
│   ├── index.js         # Express app entry point
│   ├── db.js            # MongoDB connection
│   ├── middleware/
│   │   └── auth.js      # JWT verification middleware
│   ├── models/
│   │   ├── User.js      # User schema (username + hashed password)
│   │   └── Task.js      # Task schema
│   └── routes/
│       ├── auth.js      # POST /api/auth/register & /login
│       └── tasks.js     # GET/POST/PATCH/DELETE /api/tasks
├── .env                 # Environment variables (not committed)
├── .gitignore
└── package.json
```

---

## ⚙️ Setup & Installation

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) running locally on port `27017`

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/your-username/taskflow.git
cd taskflow

# 2. Install dependencies
npm install

# 3. Create your .env file
cp .env.example .env
# Then edit .env with your values (see Environment Variables below)

# 4. Start the development server
npm run dev

# Or for production
npm start
```

The app will be available at **http://localhost:3000**

---

## 🔐 Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
JWT_SECRET=your_super_secret_key_here
MONGO_URI=mongodb://127.0.0.1:27017/taskflow
```

| Variable     | Description                              | Default                                   |
|--------------|------------------------------------------|-------------------------------------------|
| `PORT`       | Port the server listens on               | `3000`                                    |
| `JWT_SECRET` | Secret key used to sign JWT tokens       | *(required)*                              |
| `MONGO_URI`  | MongoDB connection string                | `mongodb://127.0.0.1:27017/taskflow`      |

> ⚠️ Never commit your `.env` file. It's already listed in `.gitignore`.

---

## 📡 API Reference

All task routes require an `Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint              | Body                          | Description         |
|--------|-----------------------|-------------------------------|---------------------|
| POST   | `/api/auth/register`  | `{ username, password }`      | Register a new user |
| POST   | `/api/auth/login`     | `{ username, password }`      | Login, returns JWT  |

Password must be at least **6 characters**. Usernames are stored lowercase.

### Tasks

| Method | Endpoint           | Body / Params                              | Description          |
|--------|--------------------|--------------------------------------------|----------------------|
| GET    | `/api/tasks`       | —                                          | Fetch all user tasks |
| POST   | `/api/tasks`       | `{ title, description?, tag?, dueDate? }` | Create a new task    |
| PATCH  | `/api/tasks/:id`   | `{ title?, description?, tag?, dueDate?, done? }` | Update a task |
| DELETE | `/api/tasks/:id`   | —                                          | Delete a task        |

**Task fields:**

| Field         | Type      | Values                                              |
|---------------|-----------|-----------------------------------------------------|
| `title`       | String    | Required                                            |
| `description` | String    | Optional                                            |
| `tag`         | String    | `personal` \| `work` \| `urgent` \| `learning` \| `health` |
| `dueDate`     | Date      | Optional ISO date string                            |
| `done`        | Boolean   | `false` by default                                  |

---

## 🧑‍💻 Scripts

```bash
npm start      # Start server with node
npm run dev    # Start server with nodemon (auto-restarts on changes)
```

---

## 🔒 Security Notes

- Passwords are hashed with **bcrypt** (12 salt rounds) — never stored in plain text
- JWT tokens expire after **7 days**
- Login uses constant-time comparison to prevent timing attacks
- Tasks are scoped strictly to the authenticated user — users cannot access each other's data
- Input is validated and sanitised on both the client and server

---

## 📌 Roadmap / Possible Improvements

- [ ] Task priorities (low / medium / high)
- [ ] Search and sort functionality
- [ ] Edit task inline
- [ ] Email/password auth or OAuth (Google)
- [ ] Dark/light theme toggle
- [ ] Drag-and-drop task reordering
- [ ] Subtasks / checklists
- [ ] Notifications for upcoming due dates

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
