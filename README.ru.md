# Watchlist

Небольшой fullstack-проект: поиск фильмов через TMDB и личный watchlist в
MongoDB. Делал в основном чтобы попрактиковать JWT-auth, Redux Toolkit с
thunk'ами и интеграцию реального стороннего API.

[Демо](https://watchlist-sigma-jade.vercel.app) · [English README](README.md)

*Бэк на бесплатном Railway - первый запрос после долгого простоя может занять
на несколько секунд дольше.*

![watchlist](./watchlist.png)

## Стек

- **Фронт:** React 19, TypeScript, Redux Toolkit, Axios, react-toastify
- **Бэк:** Node.js, Express 5, TypeScript, Mongoose, JWT, bcryptjs
- **БД:** MongoDB Atlas
- **Деплой:** Vercel (фронт) + Railway (бэк)

## Запуск локально

```bash
# бэк
cd backend
cp .env.example .env
npm install
npm run dev                # :5000

# фронт, в отдельном терминале
cd frontend
cp .env.example .env
npm install
npm start                  # :3000
```

**`backend/.env`:**

```env
MONGO_URI=<строка подключения к Atlas>
JWT_SECRET=<случайные 32+ символов>
PORT=5000
CLIENT_URL=http://localhost:3000
```

**`frontend/.env`:**

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_TMDB_API_KEY=<твой TMDB v3 ключ>
REACT_APP_TMDB_URL=https://api.themoviedb.org/3
```

Ключ TMDB: https://www.themoviedb.org/settings/api

## API

Все `/watchlist/*` требуют `Authorization: Bearer <jwt>`.

| Метод | Путь | Тело | Примечания |
|---|---|---|---|
| POST | `/auth/register` | `{ email, password }` | пароль 6+ символов |
| POST | `/auth/login` | `{ email, password }` | возвращает `{ token, email }` |
| GET | `/watchlist` | - | фильмы текущего юзера |
| POST | `/watchlist` | `{ movieId, title, year?, poster_path? }` | валидация на сервере |
| PATCH | `/watchlist/:id/rating` | `{ rating: 1..5 }` | только integer |
| DELETE | `/watchlist/:id` | - | 404 если не владелец |

## Что реально сделано

- **Auth.** bcrypt с cost 12 для пароля. HS256 JWT, 24 часа жизни. Длина
  `JWT_SECRET` проверяется на старте (должна быть 32+ символов), иначе бэк не
  запускается.
- **Изоляция данных по юзеру.** Чтение watchlist фильтруется по `userId`;
  изменение рейтинга и удаление используют композитный Mongo-фильтр
  `{ _id, userId }`. `userId` берётся из JWT, не из тела запроса. Если угадать
  чужой id, получишь 404, а не 403, чтобы не подтверждать существование объекта.
- **Валидация входа на сервере.** ObjectId проверяется через
  `mongoose.Types.ObjectId.isValid` до обращения к БД. Rating - только integer
  1-5. Тело при добавлении в watchlist проходит через type guard перед записью.
- **Поиск TMDB с защитой от race condition.** Debounce 350мс на инпут. Старые
  запросы в полёте отменяются через `AbortController`. Сверху этого movies
  slice хранит `currentRequestId`: если медленный первый запрос вернётся после
  быстрого второго, его ответ дропается на уровне reducer'а. Двухслойная защита,
  потому что abort на сетевом уровне не страхует от уже летящего ответа.
- **Pending UI для watchlist.** В slice есть `pendingIds` и `removingIds` - они
  блокируют повторные add/remove клики и показывают loading state, пока запрос
  к серверу в полёте.
- **Подключение к БД.** При долгом простое соединение с Mongo закрывается,
  чтобы освободить connection slot на free tier Atlas (там лимит 500).
  Переподключение лениво при следующем запросе. Сам процесс не засыпает -
  `app.listen()` держит event loop.

## Почему так

**MongoDB - честно говоря.** Брал чтобы получить опыт с Mongoose. Две коллекции
без джойнов - Postgres подошёл бы так же. Это не документная задача.

**JWT в localStorage.** Выбрал упрощённый flow. localStorage уязвим к XSS,
httpOnly cookie уязвима к CSRF, плюс нужны CSRF-токены и SameSite. Для pet'а
без реальных PII я принял XSS-риск. В проде сделал бы short-lived access token
в памяти + refresh token в httpOnly cookie с ротацией.

**TMDB key в бандле фронта.** Переменные `REACT_APP_*` инлайнятся при билде,
так что ключ публичен. Это известное ограничение того, как сейчас интегрирован
TMDB: правильное решение - проксировать `/search/movie` и `/movie/:id/videos`
через свой бэк и держать ключ только там. В roadmap.

## Чего не хватает

- Нет `helmet` и rate limiting на `/auth/*`. Credential stuffing никак не
  блокируется.
- Нет composite unique индекса `{ userId, movieId }` на watchlist. Быстрый
  двойной клик в двух вкладках может создать дубли.
- Email не нормализуется: `Vasya@x.com` и `vasya@x.com` регистрируются как два
  разных аккаунта.
- Ключ TMDB виден в бандле фронта.
- Один smoke-тест на фронте, на бэке тестов нет, CI нет.
- Нет retry/backoff на 429 от TMDB; ошибка просто показывается юзеру.

## Roadmap

1. Backend-прокси для TMDB, чтобы убрать ключ из клиента.
2. Composite unique индекс на watchlist + обработка дублей при вставке.
3. Нормализация email при регистрации и логине.
4. `express-rate-limit` на `/auth/*` и `helmet`.
5. Supertest на auth и IDOR-устойчивость + тесты slice'ов на race condition.
6. GitHub Actions: typecheck + build + tests на PR.
7. Refresh-token rotation с httpOnly cookie отдельной веткой.
