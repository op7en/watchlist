# Watchlist

![Demo](watchlist.png)

A fullstack movie tracking app built with React, TypeScript, and Node.js.

Search movies, build your personal watchlist, and watch trailers — all in one place.

🔗 **[Live Demo](https://watchlist-sigma-jade.vercel.app)**

> The backend runs on Railway's free tier and may take a few seconds to wake up after inactivity.

---

## Why this exists

Most movie apps are just storage tools — a flat list of titles with no structure.

This project is built around a simple idea: your watchlist should feel like a personal media system, not a pile of bookmarks.

- Separate what you want to watch from what you have already seen
- Discover and save movies without jumping between apps
- Watch trailers without leaving the app
- User-specific data stored per account, not in local storage

---

## Core Features

### Movie Search
Real-time search powered by the TMDB API. Results appear as you type.

### Personal Watchlist
Add and remove movies from your watchlist. Data is stored per user in the database.

### Trailer Playback
Watch YouTube trailers directly inside the app.

### Authentication
JWT-based registration and login. Each user has their own isolated data.

### Responsive Design
Works on mobile and desktop.

---

## Screenshots

### Search
![Search](search.png)

### Watchlist
![Watchlist](watchlist.png)

### Auth
![Auth](auth.png)

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React, TypeScript, Redux Toolkit, Axios, TMDB API |
| Backend | Node.js, Express, TypeScript, MongoDB Atlas, Mongoose, JWT, bcryptjs |
| Deploy | Vercel (frontend) · Railway (backend) |

---

## Project Structure

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

---

## Getting Started

**Backend**
```bash
cd backend
npm install
npm run dev
```

**Frontend**
```bash
cd frontend
npm install
npm start
```

**Environment variables**

Backend `.env`:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

Frontend `.env`:
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_TMDB_API_KEY=your_tmdb_api_key
REACT_APP_TMDB_URL=https://api.themoviedb.org/3
```

---

[Читать на русском](README.ru.md)
