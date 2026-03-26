# AlgoQuest  
Gamified platform to practice Data Structures & Algorithms through interactive challenges

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Available-green?style=for-the-badge&logo=vercel)](https://algo-quest-dsa-game.vercel.app)

---

### 🧱 Tech Stack

![React](https://img.shields.io/badge/Frontend-React-20232A?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=nodedotjs)
![Express](https://img.shields.io/badge/API-Express-000000?style=for-the-badge&logo=express)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-316192?style=for-the-badge&logo=postgresql)
![Render](https://img.shields.io/badge/Deployment-Render-46E3B7?style=for-the-badge&logo=render)
![Vercel](https://img.shields.io/badge/Frontend%20Hosting-Vercel-000000?style=for-the-badge&logo=vercel)

---

### 🧠 Problem

Traditional DSA practice platforms are static and lack engagement, making it difficult for learners to stay consistent and track meaningful progress.

---

### 💡 Solution

AlgoQuest transforms DSA practice into a gamified experience where users solve problems, progress through levels, and receive structured feedback.

---

### ✨ Features

- Gamified DSA problem-solving (levels, progression)  
- Categorized questions (arrays, trees, graphs, etc.)  
- User authentication and progress tracking  
- Real-time feedback on submissions  
- Persistent leaderboard / scoring system  

---

### 🏗️ Architecture

Client (React) → API (Node.js / Express) → PostgreSQL

---

### ⚙️ Setup

```bash
git clone https://github.com/your-username/algoquest.git
cd algoquest

# install dependencies
npm install

# setup environment variables
cp .env.example .env

# run backend
npm run server

# run frontend
npm run client
