Watchlist — Movie Tracking App

A fullstack web application for searching movies and managing a personal watchlist, built with React, Node.js, and TypeScript.

Live Demo

https://watchlist-sigma-jade.vercel.app/

«The backend is hosted on Railway’s free tier and may take a few seconds to wake up after inactivity.»

---

Why this exists

Most movie apps and watchlists are just storage tools. They let you save titles, but they do not give you structure, context, or decision-making support.

This project was built to go slightly beyond that:

- A personal movie space that is structured, not just a flat list
- A way to separate what you want to watch from what you have already seen
- A unified place for discovery, saving, and playback access
- A lightweight system instead of fragmented bookmarks, notes, or streaming platform lists

At its core, it is still simple. But it is designed to behave like a small personal media system rather than a static collection.

---

Core Features

- User registration and authentication (JWT)
- Real-time movie search via TMDB API
- Add and remove movies from a personal watchlist
- User-specific watchlist stored in database
- Watch trailers directly via YouTube
- Responsive UI for mobile and desktop

---

Screenshots

"watchlist" (watchlist.png)
"main" (search.png)
"auth" (auth.png)

---

Tech Stack

Frontend

- React.js
- TypeScript
- Redux Toolkit
- Axios
- TMDB API

Backend

- Node.js
- Express.js
- TypeScript
- MongoDB Atlas
- Mongoose
- bcryptjs
- JSON Web Token (JWT)

Deployment

- Vercel (frontend)
- Railway (backend)

---

Getting Started

Backend

cd backend
npm install
npm run dev

Frontend

cd frontend
npm install
npm start

---

Environment Variables

Backend ".env"

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000

Frontend ".env"

REACT_APP_API_URL=http://localhost:5000
REACT_APP_TMDB_API_KEY=your_tmdb_api_key
REACT_APP_TMDB_URL=https://api.themoviedb.org/3

---

Project Structure

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

---

Documentation

Russian version: "README.ru.md" (READMERU.md)
