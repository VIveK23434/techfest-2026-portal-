# TechFest 2026 Portal - Full Stack MERN Application
**Mar Baselios College of Engineering and Technology (Autonomous)**  
**Department of Computer Science and Engineering**  
**Course Code:** 23CSB40B | Semester 7 | **Experiment 5**

---

## 📌 Project Overview
TechFest 2026 Portal is an enterprise-grade full-stack MERN application (MongoDB, Express, React, Node.js) featuring OWASP Top 10 security hardening, automated CI/CD pipelines with GitHub Actions, and production multi-tier cloud deployment:
- **Frontend SPA:** React 18 + Vite (Hosted on **Netlify**)
- **RESTful API Backend:** Express.js + Node.js (Hosted on **Render**)
- **Cloud Database:** **MongoDB Atlas** (M0 Free Cluster)
- **CI/CD Automation:** **GitHub Actions** (`.github/workflows/ci.yml`)

---

## 🛡️ Security Hardening Implemented
1. **NoSQL Injection Prevention:**
   - Enforced `express-mongo-sanitize` on all incoming requests to strip prohibited operators (`$gt`, `$ne`, `$where`, etc.).
2. **Cross-Site Scripting (XSS) Mitigation:**
   - React JSX automatic contextual escaping for UI output.
   - Server-side entity sanitization for user comments (`/api/feedback`).
   - Content-Security-Policy (CSP) configured via `helmet()`.
3. **Secure Authentication & Session Cookies:**
   - Salted `bcryptjs` password hashing (10 rounds) before saving to MongoDB Atlas.
   - JWT tokens stored in `httpOnly`, `secure`, and `sameSite: Lax` cookies preventing token exfiltration via client scripts.
4. **CORS Security:**
   - Restricted cross-origin access strictly to verified frontend origins (`CLIENT_ORIGIN`).

---

## 📁 Repository Structure
```
c:\63\ (TechFest 2026 Portal)
├── .github/
│   └── workflows/
│       └── ci.yml              # Automated CI workflow (Tests & Build)
├── .gitignore                  # Ignores node_modules, .env, and dist
├── README.md                   # Full documentation & setup guide
├── client/                     # Frontend (React 18 + Vite SPA)
│   ├── public/
│   │   └── _redirects          # Netlify SPA redirect rule (/* /index.html 200)
│   ├── src/
│   │   ├── components/         # Navbar, Footer, EventCard, EventList
│   │   ├── context/            # ThemeContext, AuthContext, CartContext
│   │   ├── pages/              # Home, Events, Register, Login, Gallery, SecurityAudit
│   │   ├── App.jsx             # Main router & lazy loading Suspense
│   │   ├── index.css           # Modern theme styling & responsive layout
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
└── server/                     # Backend API (Node.js + Express + Mongoose)
    ├── middleware/             # auth.js (JWT), security.js (Sanitization)
    ├── models/                 # User.js, Event.js, Registration.js, Feedback.js
    ├── routes/                 # auth.js, events.js, registrations.js, feedback.js
    ├── tests/                  # api.test.js (Jest & Supertest test suite)
    ├── .env.example
    ├── package.json
    └── server.js               # Express application entry point
```

---

## 🚀 Local Development Setup

### 1. Backend Setup
```bash
cd server
npm install
npm run test    # Run automated security & endpoint test suite
npm start       # Starts server on http://localhost:5000
```
Health Check: `http://localhost:5000/api/health`

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev     # Starts Vite dev server on http://localhost:5173
```

---

## ☁️ Cloud Deployment Guide

### A. Database (MongoDB Atlas)
1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/).
2. Create a free M0 cluster and create a database user and password.
3. In **Network Access**, add `0.0.0.0/0` or the outbound IP addresses provided by Render.
4. Copy the connection string: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/techfest?retryWrites=true&w=majority`.

### B. Backend Deployment (Render)
1. Go to [Render](https://render.com/) and click **New Web Service**.
2. Connect your GitHub repository.
3. Settings:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `MONGO_URI`: *(Your MongoDB Atlas connection URI)*
   - `JWT_SECRET`: *(A 32+ character random secret)*
   - `CLIENT_ORIGIN`: `https://YOUR-SITE.netlify.app`

### C. Frontend Deployment (Netlify)
1. Go to [Netlify](https://www.netlify.app/) and choose **Import an existing project** from GitHub.
2. Settings:
   - **Base directory:** `client`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
3. Environment Variables:
   - `VITE_API_URL`: `https://your-render-service.onrender.com`
4. Deploy! Netlify automatically reads `client/public/_redirects` to route all page requests to `index.html`.
