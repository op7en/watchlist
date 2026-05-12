# Watchlist

Small fullstack project: TMDB search + per-user movie watchlist stored in
MongoDB. Built mainly to practice JWT auth, Redux Toolkit thunks, and
integrating a real third-party API.

[Live demo](https://watchlist-sigma-jade.vercel.app) · [README на русском](README.ru.md)

*Backend runs on Railway free tier. If Railway Serverless is enabled, the first
request after long idle may cold-start in ~10 seconds.*

![watchlist](./watchlist.png)

## Stack

- **Frontend:** React 19, TypeScript, Redux Toolkit, Axios, react-toastify
- **Backend:** Node.js, Express 5, TypeScript, Mongoose, JWT, bcryptjs
- **Database:** MongoDB Atlas
- **Deploy:** Vercel (frontend) + Railway (backend)

## Run locally

```bash
# backend
cd backend
cp .env.example .env
npm install
npm run dev                # :5000

# frontend, in a separate terminal
cd frontend
cp .env.example .env
npm install
npm start                  # :3000
```

**Backend `.env`:**

```env
MONGO_URI=<your Atlas connection string>
JWT_SECRET=<random 32+ chars>
PORT=5000
CLIENT_URL=http://localhost:3000
```

**Frontend `.env`:**

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_TMDB_API_KEY=<your TMDB v3 key>
REACT_APP_TMDB_URL=https://api.themoviedb.org/3
```

TMDB key: https://www.themoviedb.org/settings/api

## API

All `/watchlist/*` routes require `Authorization: Bearer <jwt>`.

| Method | Path | Body | Notes |
|---|---|---|---|
| POST | `/auth/register` | `{ email, password }` | password 6+ chars |
| POST | `/auth/login` | `{ email, password }` | returns `{ token, email }` |
| GET | `/watchlist` | - | current user's items |
| POST | `/watchlist` | `{ movieId, title, year?, poster_path? }` | validated server-side |
| PATCH | `/watchlist/:id/rating` | `{ rating: 1..5 }` | integer only |
| DELETE | `/watchlist/:id` | - | returns 404 if not owner |

## What's actually built

- **Auth.** bcrypt cost 12 for password hashing. HS256 JWT, 24h expiry.
  `JWT_SECRET` length is checked at boot (must be 32+ chars) and the backend
  refuses to start otherwise.
- **Per-user data isolation.** Watchlist reads filter by `userId`; rating and
  delete operations use the composite Mongo filter `{ _id, userId }`. The
  `userId` comes from the JWT, not from the request body. If you guess someone
  else's item id, you get a 404, not a 403, so the existence of the item is not
  leaked.
- **Server-side input validation.** ObjectId is checked with
  `mongoose.Types.ObjectId.isValid` before touching the DB. Rating must be an
  integer 1-5. The watchlist payload goes through a type guard before insert.
- **TMDB search with race protection.** 350ms debounce on the input. Old
  in-flight requests are aborted via `AbortController` when a new one starts.
  On top of that, the movies slice tracks `currentRequestId`: if a slow first
  request returns after a fast second one, its result is dropped at the reducer
  level. Two layers because aborting on the network side does not fully protect
  against a response that is already travelling back.
- **Pending UI for watchlist actions.** `pendingIds` and `removingIds` in the
  slice disable duplicate add/remove clicks and show loading states while the
  server request is in flight.
- **DB connection handling.** On long idle, the Mongo connection is closed to
  avoid keeping Atlas/Railway busy through an unused DB connection. It re-opens
  lazily on the next request. This supports Railway Serverless, but Railway
  still controls whether and when the service sleeps.

## Why these choices

**MongoDB, honestly.** I picked Mongo to get hands-on Mongoose experience. Two
collections without joins - Postgres would have worked equally well here. This
is not a document-shaped problem.

**JWT in localStorage.** I went with the simpler flow. localStorage is
vulnerable to XSS, httpOnly cookies are vulnerable to CSRF and need CSRF tokens
+ SameSite handling on top. For a pet project without real PII I accepted the
XSS trade-off. In production I would use a short-lived access token in memory
plus a refresh token in an httpOnly cookie with rotation.

**TMDB key in the frontend bundle.** `REACT_APP_*` variables are inlined at
build time, so the key is public. This is a known limitation of how I integrated
TMDB: the proper fix is to proxy `/search/movie` and `/movie/:id/videos`
through my backend and keep the key in the backend env. It is in the roadmap.

## Known limitations

- No `helmet`, no rate limiting on `/auth/*`. Credential stuffing is not
  blocked.
- No composite unique index `{ userId, movieId }` on watchlist items. A fast
  double-click in two tabs can produce duplicates.
- Email is not normalized: `Vasya@x.com` and `vasya@x.com` register as two
  separate accounts.
- TMDB API key is visible in the frontend bundle.
- One frontend smoke test, no backend tests, no CI yet.
- No retry/backoff on TMDB 429 responses; they surface as a generic error to
  the user.

## Roadmap

1. Backend proxy for TMDB to remove the key from the client.
2. Composite unique index on watchlist items + handling for duplicate inserts.
3. Email normalization on register and login.
4. `express-rate-limit` on `/auth/*` and `helmet`.
5. Supertest suite for auth and IDOR resistance + slice tests for the
   race-condition handling.
6. GitHub Actions: typecheck + build + tests on PR.
7. Refresh-token rotation with httpOnly cookie as a follow-up.
