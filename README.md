<div align="center">

# PrepMate AI

**AI-powered mock interview platform with real-time voice, feedback, and analytics**

[![Live Demo](https://img.shields.io/badge/Live-Demo-a3a6ff?style=flat-square)](https://prepmate-mu.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repo-181717?style=flat-square&logo=github)](https://github.com/sahilnikalje/prepmate)

</div>

---

## What is PrepMate AI?

PrepMate AI is a full-stack MERN application that simulates real job interviews using AI. Users upload their resume, select a role and industry, and get into a live voice-based interview session powered by Groq's LLaMA model. The AI asks tailored questions, listens to spoken answers via the Web Speech API, evaluates responses in real time, and generates detailed analytics over time.

---

## Features

- **AI Interview Sessions** — Groq LLaMA generates 7 role-specific questions from your resume + job description
- **Voice-Based Interaction** — Browser Speech Recognition listens to your answers; Speech Synthesis reads questions aloud
- **Real-Time Evaluation** — Each answer is scored and evaluated live by Groq AI
- **Follow-Up Questions** — Weak answers trigger a contextual follow-up before moving on
- **Analytics Dashboard** — Track performance trends, strengths, growth areas, and session history
- **Resources Hub** — Browse curated interview questions by category, role, and difficulty with search and filters
- **Settings** — Choose AI voice (Aria / Atlas), toggle auto-save, switch dark/light theme
- **Dark + Light Theme** — Full theme system with localStorage persistence and zero flash on refresh
- **Authentication** — JWT cookie-based auth with protected routes
- **Account Management** — Change password, delete account

---

## Tech Stack

### Frontend
| Package | Purpose |
|---------|---------|
| React 19 + Vite | UI framework & build tool |
| Tailwind CSS | Styling |
| React Router DOM | Client-side routing |
| Axios | HTTP requests |
| Web Speech API | Voice recognition & synthesis (browser-native) |

### Backend
| Package | Purpose |
|---------|---------|
| Node.js + Express | Server |
| MongoDB + Mongoose | Database |
| Groq SDK | LLaMA-based question generation & answer evaluation |
| Multer | Resume PDF upload handling |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT auth |
| cookie-parser | HTTP-only cookie management |

---

## Project Structure

```
prepmate/
├── Frontend/
│   └── src/
│       ├── assets/
│       ├── context/
│       │   └── UserContext.jsx         # Global user state
│       ├── features/
│       │   ├── auth/                   # Login, Signup, ProtectedRoute
│       │   ├── dashboard/              # Dashboard, Sidebar, Navbar, Stats
│       │   ├── practice/               # Role filters, JD box, Resume upload
│       │   ├── interview/              # Live interview room, camera, controls
│       │   │   └── hooks/
│       │   │       └── useSpeech.js    # Voice recognition + synthesis
│       │   ├── analytics/              # Charts, strength cards, AI insight
│       │   ├── resources/              # Resource cards, filters, detail modal
│       │   └── settings/               # Preferences, appearance, security
│       ├── index.css                   # Dark + light theme CSS variables
│       └── App.jsx
│
└── Backend/
    ├── config/
    │   └── db.js
    ├── features/
    │   ├── auth/                       # Register, login, logout, getMe
    │   ├── dashboard/                  # Stats + recent interviews
    │   ├── interview/                  # Create session, multer upload
    │   ├── groq/                       # Question generation, evaluation, save results
    │   ├── analytics/                  # Performance data, strengths, growth areas
    │   ├── resources/                  # CRUD + search + category counts
    │   └── settings/                   # Voice, theme, password, delete account
    ├── middlewares/
    │   └── auth.middleware.js
    ├── models/
    │   ├── User.model.js
    │   ├── Interview.model.js
    │   ├── Resource.model.js
    │   └── Settings.model.js
    └── server.js
```

---

## Local Setup

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Groq API key — [console.groq.com](https://console.groq.com)

### 1. Clone

```bash
git clone https://github.com/sahilnikalje/prepmate.git
cd prepmate
```

### 2. Backend

```bash
cd Backend
npm install
```

Create `Backend/.env`:

```env
PORT=3000

MONGO_URI=

JWT_SECRET=

GROQ_API_KEY=

FRONTEND_URL=http://localhost:5173
```

```bash
node server.js
# http://localhost:3000
```

### 3. Frontend

```bash
cd ../Frontend
npm install
```

Create `Frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

```bash
npm run dev
# http://localhost:5173
```

---

## How an Interview Works

```
1. User selects Role + Category + Industry on Practice page
2. Optionally pastes or generates a Job Description
3. Uploads resume PDF
4. Backend creates an Interview session in MongoDB
5. Interview room loads → Groq generates 7 tailored questions from resume + JD
6. AI speaks each question via Speech Synthesis
7. User answers via microphone (Web Speech API)
8. Each answer is sent to Groq for evaluation → score + feedback
9. Weak answers trigger one follow-up question
10. After all questions → results saved → redirect to Dashboard
11. Analytics page aggregates all sessions into trends and insights
```

---

## API Routes Overview

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login | Public |
| POST | `/api/auth/logout` | Logout | Public |
| GET | `/api/auth/me` | Get current user | Protected |
| GET | `/api/dashboard` | Stats + recent interviews | Protected |
| POST | `/api/interview` | Create interview session | Protected |
| GET | `/api/interview/:id` | Get interview by ID | Protected |
| GET | `/api/groq/questions/:id` | Generate AI questions | Protected |
| POST | `/api/groq/evaluate` | Evaluate answer | Protected |
| POST | `/api/groq/results/:id` | Save final results | Protected |
| GET | `/api/analytics` | Analytics data | Protected |
| GET | `/api/resources` | List resources (+ filters) | Protected |
| GET | `/api/resources/:id` | Resource detail | Protected |
| GET | `/api/resources/featured` | Featured resources | Protected |
| GET | `/api/resources/categories` | Category counts | Protected |
| GET | `/api/settings` | Get settings | Protected |
| PUT | `/api/settings` | Update settings | Protected |
| PUT | `/api/settings/change-password` | Change password | Protected |
| DELETE | `/api/settings/delete-account` | Delete account | Protected |

---

## Deployment

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Vercel | https://prepmate-mu.vercel.app |
| Backend | Render / Railway | Port 3000 |

> Make sure `FRONTEND_URL` in backend `.env` matches your deployed frontend URL — used for CORS.

---

<div align="center">
Built by <a href="https://github.com/sahilnikalje">Sahil Nikalje</a>
</div>
