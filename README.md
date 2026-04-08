# 🎬 Watchlist — Movie Tracking App

A fullstack web application for searching movies and managing a personal watchlist, built with React + Node.js + TypeScript.

## 🌐 Live Demo

https://watchlist-sigma-jade.vercel.app/

> ⚠️ The backend is hosted on Railway's free tier and may take a few seconds to wake up after inactivity.

## ✨ Features

- User registration and authentication (JWT)
- Real-time movie search via TMDB API
- Add and remove movies from your personal watchlist
- Watchlist data is stored per user in the database
- Watch trailers on YouTube directly from the app
- Responsive design for mobile and desktop

## 📸 Screenshots

![watchlist](watchlist.png)
![main](search.png)
![auth](auth.png)

## 🛠 Tech Stack

**Frontend:**
- React.js
- TypeScript
- Redux Toolkit
- Axios
- TMDB API

**Backend:**
- Node.js
- Express.js
- TypeScript
- MongoDB Atlas
- Mongoose
- bcryptjs
- JSON Web Token (JWT)

**Deployment:**
- Vercel (frontend)
- Railway (backend)

## 🚀 Getting Started

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## ⚙️ Environment Variables

Create a `.env` file in the `backend` folder:
```
MONGO_URI=ваша_строка_подключения_mongodb
JWT_SECRET=ваш_секретный_ключ
PORT=5000
```

Create a `.env` file in the `frontend` folder:
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_TMDB_API_KEY=ваш_ключ_tmdb
REACT_APP_TMDB_URL=https://api.themoviedb.org/3
```

## 📁 Project Structure

```
watchlist/
├── backend/
│   └── src/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       └── app.ts
└── frontend/
    └── src/
        ├── api/
        ├── app/
        ├── components/
        ├── features/
        │   ├── auth/
        │   ├── movies/
        │   └── watchlist/
        ├── pages/
        └── styles/
```


## Документация

[Читать на русском](READMERU.md)
