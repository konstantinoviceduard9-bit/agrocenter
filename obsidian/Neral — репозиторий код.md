---
tags: [neral, dev, paths]
date: 2026-05-12
---

# Neral — репозиторий код

## Путь к проекту на диске

Измените строку ниже, если у вас другой каталог:

`c:\Users\ufa-n\Projects\Neral-Agrocenter-ai`

## Структура (важное)

| Путь | Назначение |
|------|------------|
| `web/` | Фронтенд дашборда (Vite + React) |
| `web/src/data/companies.ts` | Мок по юрлицам |
| `docs/plan-dalneyshaya-razrabotka.md` | План развития (дублируется в заметке [[Neral — план разработки]]) |
| `docs/neral-vault/` | Ресёрч по группе (импорт из архива) |

## Запуск дашборда локально

В терминале:

```bash
cd web
npm install
npm run dev
```

Браузер: `http://localhost:5173/`

Подробнее: файл `web/README.md` в репозитории.

## Git

Если заведёте git в корне `Neral-Agrocenter-ai` — не коммитьте секреты и тяжёлые артефакты без `.gitignore`.
