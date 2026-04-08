# 🌿 WellNest – Mental Wellness & Smart Journaling Platform

> A modern full-stack mental wellness application designed to help users reflect, track, and improve their mental health through intelligent tools and a calming user experience.

---

## ✨ Overview

**WellNest** is a scalable, production-ready web application that combines **journaling, self-assessment, and mindfulness tools** into a unified platform.

It is built using a **modern full-stack architecture** with a focus on:

* 🧠 Mental wellness
* ⚡ Performance
* 🎨 Clean UI/UX
* 🔐 Security

---

## 🚀 Live Features

* 📝 **Smart Journaling System**

  * Create, edit, delete notes
  * Real-time search & pagination
  * Tag-based organization

* 🧠 **Mental Health Questionnaire**

  * Interactive assessment
  * Dynamic score calculation
  * Personalized insights

* 📊 **Dashboard Analytics**

  * Wellness trends
  * Activity tracking
  * User insights

* 🧘 **Mindfulness Tools**

  * Guided breathing animation
  * Meditation timer

* 👤 **User Profile**

  * Editable profile
  * Personal stats

* 🔐 **Authentication & Security**

  * JWT-based authentication
  * Protected routes
  * Secure password hashing

---

## 🧱 Tech Stack

### Frontend

* ⚛️ React (Vite)
* 🎨 Tailwind CSS
* 🔄 Axios
* 🌐 React Router

### Backend

* ☕ Spring Boot
* 🔐 Spring Security
* 🍃 Spring Data MongoDB
* 🪪 JWT Authentication

### Database

* ☁️ MongoDB Atlas

---

## 📂 Project Structure

```
wellnest/
├── client/        # React frontend
├── server/        # Spring Boot backend
└── README.md
```

---

## ⚙️ Getting Started

### 1️⃣ Clone Repository

```
git clone https://github.com/AdityaElango/WellNest-Mental-Wellness-App.git 
cd wellnest
```

---

### 2️⃣ Setup Environment Variables

Create `.env.local`:

```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
VITE_API_URL=http://localhost:8080
```

---

### 3️⃣ Run Backend

```
cd server
mvn spring-boot:run
```

---

### 4️⃣ Run Frontend

```
cd client
npm install
npm run dev
```

---

### 5️⃣ Open App

```
http://localhost:5173
```

---

## 📡 API Overview

### Public

* `POST /api/auth/register`
* `POST /api/auth/login`

### Protected

* `/api/notes`
* `/api/dashboard`
* `/api/questionnaire`
* `/api/users/me`

---

## 📱 PWA Support

* Installable web app
* Offline-ready (basic caching)
* Mobile-first design

---

## 🚀 Deployment

### Frontend → Vercel

* Root: `client`
* Env: `VITE_API_URL`

### Backend → Render

* Env:

  * `MONGO_URI`
  * `JWT_SECRET`

---

## 🎯 Key Highlights

* ✅ Full-stack architecture (React + Spring Boot)
* ✅ MongoDB Atlas integration
* ✅ JWT authentication system
* ✅ Responsive & mobile-first UI
* ✅ PWA-enabled (installable app)
* ✅ Optimized for performance

---

## 🔮 Future Enhancements

* 📊 Advanced analytics dashboard
* 🔔 Notifications & reminders
* 🌙 Dark mode enhancements
* 🤖 AI-based mental health insights

---

## 👨‍💻 Author

**Aditya Elango**

---

## ⭐ If you found this useful

Give this repo a ⭐ and share feedback!

---
