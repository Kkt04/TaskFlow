<div align="center">

# ⚡ TaskFlow — Smart Task Manager

**A modern, full-stack task management web application engineered for speed, simplicity, and focus.**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FKkt04%2FTaskFlow&env=MONGO_URI,JWT_SECRET&envDescription=MongoDB%20Atlas%20connection%20string%20and%20JWT%20secret%20key)
[![Node.js Version](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%2F%20Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[Live Demo](#-deploying-to-vercel) • [Features](#-features) • [Getting Started](#-getting-started) • [Deployment](#-deploying-to-vercel) • [API Reference](#-api-reference)

</div>

---

## 📖 Overview

**TaskFlow** is an intuitive, full-stack productivity tool designed to help individuals and teams organize their day with zero friction. Built with a responsive dark-mode UI and a lightweight Node.js/Express backend, TaskFlow delivers real-time task tracking, instant status filtering, dynamic category tags, and automated overdue tracking.

Ready to run locally in seconds or deploy serverlessly to **Vercel** with **MongoDB Atlas**.

---

## ✨ Features

- 🔐 **Secure User Authentication**
  - Registration and login powered by JSON Web Tokens (JWT)
  - Passwords hashed using `bcryptjs` with 12 salt rounds
  - User-scoped tasks: strict data isolation per account

- 📋 **Intuitive Task Management**
  - Instant task creation with optional descriptions and due dates
  - One-click completion toggle and quick deletion
  - Dynamic categorization: `Personal`, `Work`, `Urgent`, `Learning`, `Health`

- 📊 **Real-Time Analytics & Dashboard**
  - Live metric counters: Total Tasks, In-Progress, Completed, and Overdue
  - Color-coded badges with dynamic due date status (`Due today`, `X days left`, `Overdue`)

- 🎯 **Smart Filtering & Search**
  - Filter by completion status (`All`, `Pending`, `Completed`)
  - Filter by category tag
  - Background polling every 10 seconds to keep tabs in sync

- 💎 **Polished User Experience**
  - Sleek dark aesthetic with smooth CSS transitions
  - Non-blocking toast notifications for all interactions
  - Mobile-first, fully responsive layout

- ☁️ **Cloud & Serverless Ready**
  - Pre-configured for seamless deployment to **Vercel**
  - Optimized MongoDB connection caching for serverless environments

---

## 🛠 Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | Vanilla HTML5, CSS3, JavaScript (ES6+) | Lightweight SPA, zero build tool overhead |
| **Backend** | Node.js, Express.js | RESTful API server with modular routing |
| **Database** | MongoDB, Mongoose 9 | Document database with cached connection pooling |
| **Security** | JWT (`jsonwebtoken`), `bcryptjs` | Stateless token authentication & password encryption |
| **Hosting** | Vercel Serverless Functions | Autoscaling global edge deployment |

---

## 📁 Project Structure

```text
TaskFlow/
├── public/                 # Client-side single-page application
│   ├── index.html          # HTML entry point with semantic markup
│   ├── app.js              # Application logic, auth state & API calls
│   └── style.css           # Custom dark-mode styles & responsive layout
├── server/                 # Express backend application
│   ├── index.js            # Server entry point & Express configuration
│   ├── db.js               # MongoDB connection helper with connection caching
│   ├── middleware/
│   │   └── auth.js         # JWT bearer token verification middleware
│   ├── models/
│   │   ├── User.js         # User Mongoose schema
│   │   └── Task.js         # Task Mongoose schema
│   └── routes/
│       ├── auth.js         # /api/auth routes (register, login)
│       └── tasks.js        # /api/tasks routes (CRUD operations)
├── .env.example            # Sample environment variables
├── .gitignore              # Files and folders excluded from Git
├── package.json            # Node.js dependencies and scripts
└── vercel.json             # Vercel deployment configuration
```

---

## 🚀 Getting Started

Follow these steps to set up and run TaskFlow on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or higher)
- [npm](https://www.npmjs.com/) (installed with Node)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally on port `27017` (or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Kkt04/TaskFlow.git
   cd TaskFlow
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Open `.env` in your text editor and verify the values:
   ```env
   PORT=3000
   JWT_SECRET=super_secret_jwt_key_here
   MONGO_URI=mongodb://127.0.0.1:27017/taskflow
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   *Or for standard production mode:*
   ```bash
   npm start
   ```

5. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to start managing tasks!

---

## ☁️ Deploying to Vercel

TaskFlow is optimized to run out-of-the-box on [Vercel](https://vercel.com). Because Vercel functions are serverless, you need a cloud MongoDB database such as **MongoDB Atlas**.

### Step 1: Set Up MongoDB Atlas (Free Tier)
1. Sign in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free **M0 Sandbox** cluster.
3. In **Database Access**, create a user with read and write permissions. Note the username and password.
4. In **Network Access**, add IP Address `0.0.0.0/0` (allow access from anywhere) so Vercel serverless functions can connect.
5. Click **Connect** → **Drivers** (Node.js) and copy your connection string:
   ```text
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/taskflow?retryWrites=true&w=majority
   ```

### Step 2: Deploy to Vercel

#### Option A: One-Click Deploy (Fastest)
Click the button below to import the repo and deploy instantly:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FKkt04%2FTaskFlow&env=MONGO_URI,JWT_SECRET&envDescription=MongoDB%20Atlas%20connection%20string%20and%20JWT%20secret%20key)

#### Option B: Deploy via Vercel Dashboard (GitHub Integration)
1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "Configure TaskFlow for Vercel deployment"
   git push origin main
   ```
2. Go to your [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New...** → **Project**.
3. Import your `TaskFlow` repository.
4. Under **Environment Variables**, add:
   - `MONGO_URI`: Your MongoDB Atlas connection URI
   - `JWT_SECRET`: A secure random secret string (e.g. generate via `openssl rand -hex 32`)
5. Click **Deploy**. Vercel will build and assign you a live `.vercel.app` URL!

#### Option C: Deploy using Vercel CLI
```bash
# Install Vercel CLI globally
npm install -g vercel

# Log in to your Vercel account
vercel login

# Link and deploy
vercel

# Add environment variables
vercel env add MONGO_URI
vercel env add JWT_SECRET

# Deploy to production
vercel --prod
```

---

## 📡 API Reference

All `/api/tasks` routes require an `Authorization` header containing the JWT token received upon login:
```http
Authorization: Bearer <your-jwt-token>
```

### Authentication Endpoints

#### Register a New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "janedoe",
  "password": "secretpassword"
}
```
**Response (`201 Created`):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "janedoe"
}
```

#### Log In
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "janedoe",
  "password": "secretpassword"
}
```
**Response (`200 OK`):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "janedoe"
}
```

---

### Task Endpoints

#### Fetch All Tasks
```http
GET /api/tasks
```
**Response (`200 OK`):**
```json
[
  {
    "_id": "6730c458e0a4f5b1c8e12345",
    "userId": "6730c440e0a4f5b1c8e12340",
    "title": "Prepare Sprint Demo",
    "description": "Outline key deliverables and architectural upgrades",
    "tag": "work",
    "dueDate": "2026-11-15T00:00:00.000Z",
    "done": false,
    "createdAt": "2026-11-10T15:30:00.000Z",
    "updatedAt": "2026-11-10T15:30:00.000Z"
  }
]
```

#### Create a Task
```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Complete Quarterly Review",
  "description": "Review sprint metrics and team OKRs",
  "tag": "work",
  "dueDate": "2026-11-20"
}
```
**Response (`201 Created`):** Returns the created task object.

#### Update a Task
```http
PATCH /api/tasks/:id
Content-Type: application/json

{
  "done": true
}
```
**Response (`200 OK`):** Returns the updated task object.

#### Delete a Task
```http
DELETE /api/tasks/:id
```
**Response (`200 OK`):**
```json
{
  "message": "Task deleted successfully"
}
```

---

## 🔒 Security & Best Practices

- **Password Hashing:** Passwords are never stored in plaintext. They are salted and hashed using `bcryptjs` with a cost factor of 12.
- **Timing Attack Resistance:** User login comparisons maintain constant-time checking even when users are not found.
- **Data Scoping:** Every database query filters by `userId`, ensuring users can never inspect, alter, or delete tasks belonging to others.
- **Serverless Connection Pooling:** The Mongoose client caches the connection promise across invocations to avoid exhausting database socket limits during traffic spikes.
- **Protected Environment Variables:** Critical credentials like database strings and JWT secrets are kept isolated and excluded from version control.

---

## 🤝 Contributing

Contributions, bug reports, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/Kkt04">Kkt04</a></sub>
</div>
