# Демо-дашборд в интернете (бесплатно)

Фронт в папке `web/` — обычный **статический** билд Vite (`dist/`). Подойдут бесплатные тарифы с HTTPS и своим поддоменом.

---

## Пошагово: GitHub + Vercel (рекомендуемый путь)

Ниже — полный маршрут, если репозитория ещё нет или вы хотите заново связать проект с демо-ссылкой.

### 1. Репозиторий на GitHub

1. Войти на [github.com](https://github.com) → **New repository**.
2. Имя, например: `Neral-Agrocenter-ai` (или любое). Репозиторий **Public** достаточно для бесплатного Vercel.
3. **Не** ставьте галочки «Add README / .gitignore» (чтобы не мешали первому push), либо потом сделайте `git pull --rebase` перед push.
4. Скопируйте URL репозитория, например: `https://github.com/ВАШ_ЛОГИН/Neral-Agrocenter-ai.git`.

### 2. Git в папке проекта (Windows, PowerShell)

Команды из **корня** репозитория (где лежат папки `web/`, `docs/`):

```powershell
cd c:\Users\ufa-n\Projects\Neral-Agrocenter-ai

git init
git branch -M main
git add .
git status
git commit -m "chore: initial project for dashboard demo"
git remote add origin https://github.com/ВАШ_ЛОГИН/ИМЯ-РЕПО.git
git push -u origin main
```

Если Git пишет, что нет `user.name` / `user.email`:

```powershell
git config --global user.email "you@example.com"
git config --global user.name "Your Name"
```

В корне уже есть `.gitignore`: в Git не попадут `web/node_modules/` и `web/dist/`.

### 3. Проект на Vercel

1. [vercel.com](https://vercel.com) → **Sign up** → **Continue with GitHub** → разрешить доступ к репозиториям (можно только к выбранному репо).
2. **Add New…** → **Project** → **Import** ваш репозиторий.
3. Настройки сборки (главное):

| Поле | Значение |
|------|----------|
| **Root Directory** | `web` (нажать Edit → выбрать папку `web`) |
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` (по умолчанию для Vite) |
| **Output Directory** | `dist` |
| **Install Command** | оставить по умолчанию (`npm install` в `web/`) |

4. **Environment Variables** для чистого демо не нужны.
5. **Deploy**. Через 1–2 минуты появится ссылка вида `имя-проекта.vercel.app`.

### 4. Проверка после деплоя

- Откройте главную и перейдите в **Касса** или **Дебиторка**.
- Скопируйте URL вида `https://….vercel.app/finance/cash` и откройте в **новой вкладке** или обновите страницу (**F5**). Если страница открывается, SPA-настройка (`vercel.json`) работает.

### 5. Обновления демо

После каждого `git push` в ветку, которую Vercel считает **Production** (обычно `main`), сайт пересоберётся сам. Если включили **Preview** для других веток — у каждой будет своя временная ссылка.

### 6. Имя сайта (опционально)

В Vercel: **Project** → **Settings** → **Domains** — можно задать другое имя поддомена `*.vercel.app` или подключить свой домен позже.

---

## Что важно

1. В панели хостинга укажите **корень проекта** `web` (не весь репозиторий), если репозиторий монолитный.
2. **Сборка:** `npm ci` (или `npm install`), затем `npm run build`.
3. **Папка публикации:** `dist`.
4. **Node:** 20 LTS (или 22), как у вас локально.

Уже лежат файлы для SPA (чтобы работали прямые ссылки и обновление страницы):

| Сервис            | Файл в `web/`                          |
|-------------------|----------------------------------------|
| Vercel            | `vercel.json`                          |
| Netlify           | `netlify.toml`                         |
| Cloudflare Pages  | `public/_redirects` (копируется в dist) |

---

## Vercel (кратко)

Полная пошаговая инструкция — в разделе **«Пошагово: GitHub + Vercel»** выше. Критично только: **Root Directory = `web`**, preset **Vite**, выход **`dist`**.

---

## Netlify (`*.netlify.app`)

1. [app.netlify.com](https://app.netlify.com) → **Add new site** → Import from Git.
2. Base directory: **`web`**.
3. Build: `npm run build`, Publish: **`dist`** (дублируется в `netlify.toml`).

---

## Cloudflare Pages (`*.pages.dev`)

1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → Pages → Connect to Git.
2. Build command: `npm run build`, Output: **`dist`**, Root path: **`web`**.

---

## GitHub Pages

Нужен `base` в Vite вида `/имя-репозитория/` и отдельная настройка — для быстрого демо проще **Vercel / Netlify / Cloudflare**.

---

## Данные `dashboard.snapshot.json`

Файл `web/public/data/dashboard.snapshot.json` попадает в билд как `/data/dashboard.snapshot.json`. Чтобы обновить цифры на демо, меняйте файл в репозитории и делайте redeploy (или правьте через PR).

---

## Ограничения демо

- «Вход (демо)» и данные работают в браузере; **секреты не кладите** в репозиторий.
- Вебхуки Telegram / MAX должны смотреть на **отдельный сервер с URL**, не на этот статический хостинг.
