# Watchlist

![Demo](watchlist.png)

Fullstack приложение для отслеживания фильмов на React, TypeScript и Node.js.

Ищи фильмы, добавляй в личный вотчлист и открывай трейлеры из одного приложения.

🔗 **[Live Demo](https://watchlist-sigma-jade.vercel.app)**

> Бэкенд работает на бесплатном тарифе Railway и может несколько секунд просыпаться после простоя.

---

## Зачем это сделано

Большинство приложений для фильмов — просто список названий без структуры.

Идея проекта простая: вотчлист должен работать как личная медиасистема, а не куча закладок.

- Разделяй то, что хочешь посмотреть, и то, что уже видел
- Находи и сохраняй фильмы не переключаясь между приложениями
- Открывай трейлеры из результатов поиска и сохранённых фильмов
- Данные хранятся на сервере для каждого пользователя отдельно

---

## Функциональность

### Поиск фильмов

Поиск в реальном времени через TMDB API. Результаты появляются по мере ввода.

### Личный список фильмов

Добавляй и удаляй фильмы. Данные хранятся в MongoDB привязанными к аккаунту — не в localStorage, не общие для всех.

### Просмотр трейлеров
YouTube-трейлеры открываются из результатов поиска и сохранённых фильмов.

### Аутентификация

Регистрация и вход через JWT. У каждого пользователя изолированные данные.

### Управление состоянием

Глобальное состояние через Redux Toolkit. Данные авторизации и вотчлиста хранятся в отдельных слайсах; асинхронные запросы используют `createAsyncThunk`.

### Адаптивный дизайн

Работает на мобильных и десктопе.

---

## Скриншоты

### Поиск
![Search](search.png)

### Список фильмов
![Watchlist](watchlist.png)

### Авторизация
![Auth](auth.png)

---

## Стек технологий

| Слой      | Технологии                                                            |
|-----------|-----------------------------------------------------------------------|
| Фронтенд  | React, TypeScript, Redux Toolkit, Axios, TMDB API                    |
| Бэкенд    | Node.js, Express, TypeScript, MongoDB Atlas, Mongoose, JWT, bcryptjs |
| Деплой    | Vercel (фронтенд) · Railway (бэкенд)                                 |

**Почему MongoDB здесь, а не PostgreSQL как в job-tracker?**
Данные о фильмах из TMDB гибкие и document-shaped — фиксированная схема не нужна. MongoDB с Mongoose подходит естественно. Job-tracker использует реляционные данные (заявки, история активности, токены), где PostgreSQL и строгая схема дают больше контроля.

---

## Структура проекта

```text
watchlist/
├── backend/
│   └── src/
│       ├── middleware/    # Auth middleware
│       ├── models/        # Mongoose схемы
│       ├── routes/        # API эндпоинты
│       └── app.ts
└── frontend/
    └── src/
        ├── api/           # Axios instance
        ├── app/           # Redux store
        ├── components/
        ├── features/
        │   ├── auth/      # Auth слайс
        │   ├── movies/    # Поиск + TMDB интеграция
        │   └── watchlist/ # Watchlist слайс + thunks
        └── styles/
```

---

## Запуск локально

**Бэкенд**
```bash
cd backend
npm install
npm run dev
```

**Фронтенд**
```bash
cd frontend
npm install
npm start
```

**Переменные окружения**

Файл `.env` в папке backend:
```
MONGO_URI=строка_подключения_mongodb
JWT_SECRET=секретный_ключ
PORT=5000
```

Файл `.env` в папке frontend:
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_TMDB_API_KEY=ключ_tmdb
REACT_APP_TMDB_URL=https://api.themoviedb.org/3
```

TMDB API key можно получить на https://www.themoviedb.org/settings/api.

---

[Read in English](README.md)
