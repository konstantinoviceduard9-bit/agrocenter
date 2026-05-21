# Пульт фермы «Нерал-Матрикс»

Отдельное веб-приложение для сотрудников фермы: экран «Сегодня» в духе **AfiFarm**, кормление — **DTM**, задачи ветслужбы. Данные — демо из презентации Matrix (май 2026).

## Запуск

```bash
cd web-matrix
npm install
npm run dev
```

Локально: `http://localhost:5173/` (или следующий свободный порт).

## Сборка и проверка

```bash
npm run check
```

## GitHub Pages (вместе с дашбордом группы)

В одном репозитории публикуется:

| URL | Приложение |
|-----|------------|
| `https://<user>.github.io/<repo>/` | Групповой дашборд (`web/`) |
| `https://<user>.github.io/<repo>/matrix/` | Пульт Матрикс (`web-matrix/`) |

Workflow `.github/workflows/deploy-github-pages.yml` собирает оба проекта и кладёт `web-matrix/dist` в `web/dist/matrix/`.

Локальная сборка под Pages (PowerShell, подставьте имя репо):

```powershell
$repo = "Neral-Agrocenter-ai"
$env:VITE_BASE_PATH="/$repo/matrix/"
cd web-matrix
npm run build
```

## Разделы

- **Сегодня** — сетка виджетов (молоко, стадо, здоровье, задачи, неисправности)
- **Дойка** — смена и идентификация
- **Кормление** — рецепт DTM (таблица ингредиентов)
- **Задачи** — очередь ветслужбы
- **Машины** — телематика (заглушка карты)

Следующий этап: read-only API Afimilk / DTM / Аксента.
