# Watchlist

![Demo](watchlist.png)

A fullstack movie tracking app built with React, TypeScript, and Node.js.

Search movies, build your personal watchlist, and open trailers from one app.

🔗 **[Live Demo](https://watchlist-sigma-jade.vercel.app)**

> The backend runs on Railway's free tier and may take a few seconds to wake up after inactivity.

---

## Why this exists

Most movie apps are just storage tools — a flat list of titles with no structure.

This project is built around a simple idea: your watchlist should feel like a personal media system, not a pile of bookmarks.

- Separate what you want to watch from what you have already seen
- Discover and save movies without jumping between apps
- Open trailers from search results and saved movies
- User-specific data stored per account, not in local storage

---

## Features

### Movie Search

Real-time search powered by the TMDB API. Results appear as you type.

### Personal Watchlist

Add and remove movies from your watchlist. Data is stored per user in MongoDB — not in localStorage, not shared between accounts.

### Trailer Playback
Open YouTube trailers from search results and saved movies.

### Authentication

JWT-based registration and login. Each user has their own isolated data.

### State Management

Global state handled with Redux Toolkit. Auth and watchlist data live in separate slices; async API calls use `createAsyncThunk`.

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

| Layer    | Technologies                                                          |
|----------|-----------------------------------------------------------------------|
| Frontend | React, TypeScript, Redux Toolkit, Axios, TMDB API                    |
| Backend  | Node.js, Express, TypeScript, MongoDB Atlas, Mongoose, JWT, bcryptjs |
| Deploy   | Vercel (frontend) · Railway (backend)                                 |

**Why MongoDB here vs PostgreSQL in job-tracker?**
Movie metadata from TMDB is flexible and document-shaped — no fixed schema needed. MongoDB with Mongoose fits naturally. Job-tracker uses relational data (applications, activity logs, tokens) where PostgreSQL and strict schema give more control.

---

## Project Structure

```text
watchlist/
├── backend/
│   └── src/
│       ├── middleware/    # Auth middleware
│       ├── models/        # Mongoose schemas
│       ├── routes/        # API endpoints
│       └── app.ts
└── frontend/
    └── src/
        ├── api/           # Axios instance
        ├── app/           # Redux store setup
        ├── components/
        ├── features/
        │   ├── auth/      # Auth slice
        │   ├── movies/    # Search + TMDB integration
        │   └── watchlist/ # Watchlist slice + thunks
        └── styles/
```

---

## Local Setup

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

Get a TMDB API key at https://www.themoviedb.org/settings/api.

---

[Читать на русском](READMERU.md)
