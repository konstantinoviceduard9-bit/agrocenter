---
tags: [project, automation, agro, moc]
date: 2026-05-11
status: research-in-progress
branch: automation
---
# Neral-Agrocenter

> Новая ветка проектов: **автоматизация** (отдельно от AlgoFy / DMTG / dev).
> Клиент: ООО «НЕРАЛ-АГРОЦЕНТР» (ИНН **0278068097**). Запрос исполнительного директора — умный дашборд + AI-чатбот для real-time мониторинга + триггеров + голосовых запросов.
> Деплой будущей инфры: **OVH1** (изолированно от OVH2/DMTG).

## Цели исследования (research phase)

1. **Сводка по компании** — OGRN, регистрация, OKVED, учредители, директора, финансы (выручка/прибыль), численность сотрудников
2. **Связанные компании** — entities через общих учредителей/директоров
3. **International AI/automation benchmarks в агро** — 3-5 кейсов (Cargill, John Deere, Climate Corp, Indigo, …), что сделали, какие результаты, transferable patterns
4. **Применение для Neral** — 5-10 конкретных AI/automation initiatives под profile компании, prioritize по ROI × effort
5. **Концепция дашборда** — какие метрики, какие триггеры, какие голосовые запросы (без implementation на этом этапе)

## Ресурсы

- [rusprofile.ru/id/4064780](https://www.rusprofile.ru/id/4064780) — primary corp data
- Login: `voloffme7@gmail.com` (creds в private notes session)
- API для rusprofile **отсутствует** — данные через UI или scraping
- Public pages не требуют login; платные отчёты — через session cookies

## Future infra

- **OVH1** (отдельно от OVH2 DMTG/marketing) — TG dashboard, voice chatbot, ETL pipeline для real-time данных Neral
- **На текущем этапе НЕ строим** — только research + roadmap

## Документы (заполняются research-агентом)

- [[company-snapshot]] — базовая корпоративная сводка
- [[related-companies]] — связанные entities (v1, 6 компаний)
- [[related-entities]] — **расширенная карта группы (v2, 13 юрлиц + 10 физлиц, group-aware)**
- [[subsidiaries-full-map]] — 🆕 топология группы Концерн Интел КО + выручка 2025 по entities (Σ 2,33 млрд ₽ группы)
- [[financial-deep-dive]] — 🆕 глубокий разбор финансов entities
- [[court-cases]] — 🆕 судебные дела
- [[paywalled-data]] — 🆕 что доступно только за деньги (Контур.Фокус / СПАРК)
- [[ai-benchmarks]] — международные кейсы AI/automation в агро
- [[automation-roadmap]] — конкретные applications для Neral (Часть A — per-Agrocenter, Часть B — group-level G1-G5)
- [[dashboard-concept]] — что должно быть в TG-дашборде
- [[presentation]] — pitch deck для исполнительного совета (с group context slide 2.5)

## Связано

- [[Marketing OS]] (другая ветка — не пересекается)
- [[Servers & SSH]] §OVH1 (когда дойдём до деплоя)
