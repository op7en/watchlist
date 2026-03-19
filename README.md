# 🎬 Watchlist — Список фильмов

Полноценное веб-приложение для поиска фильмов и формирования личного списка просмотра, построенное на стеке React + Node.js + TypeScript.

## 🌐 Демо

[https://watchlist-184c0gx28-olegs-projects-dbc9c07d.vercel.app/](https://watchlist-184c0gx28-olegs-projects-dbc9c07d.vercel.app/)

> ⚠️ Информация для пользователя:
> Бэкенд развёрнут на бесплатном хостинге Railway.
> Из-за ограничений платформы сервер может «засыпать» после периода бездействия.
> Время ответа на первый запрос после простоя может быть увеличено.

## ✨ Функциональность

- Регистрация и авторизация пользователей (JWT)
- Поиск фильмов в реальном времени через TMDB API
- Добавление и удаление фильмов из личного списка просмотра
- Данные сохраняются в базе данных для каждого пользователя отдельно
- Просмотр трейлеров на YouTube прямо из приложения
- Адаптивный дизайн для мобильных и десктоп устройств

## 🛠 Технологии

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

**Деплой:**
- Vercel (фронтенд)
- Railway (бэкенд)

## 🚀 Локальный запуск

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

## ⚙️ Переменные окружения

Создайте файл `.env` в папке `backend`:
```
MONGO_URI=ваша_строка_подключения_mongodb
JWT_SECRET=ваш_секретный_ключ
PORT=5000
```

Создайте файл `.env` в папке `frontend`:
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_TMDB_API_KEY=ваш_ключ_tmdb
REACT_APP_TMDB_URL=https://api.themoviedb.org/3
```

## 📁 Структура проекта

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
