---
tags: [project, neral-agrocenter, automation, presentation]
date: 2026-05-11
updated: 2026-05-11 (v3 — synchronized with automation-roadmap v3 rigorous ROI)
audience: executive board (Исаев Э.Ф., Узбеков Э.Д., Шигаповы, Козлов Ю.В.)
---
# Группа НЕРАЛ — AI/Автоматизация: pitch для исполнительного совета

> Программа двух уровней: **Per-entity** (10 initiatives + 4 EX-блока для specific entities) + **Group-level** (G1-G5). Совокупный Y1 capex **~70 млн ₽**, run-rate annual benefit к концу Y1 **~287 млн ₽** (mid). Группа выручкой 2,33 млрд ₽ (без БМК) / 12,79 млрд ₽ (исторически с БМК) удваивает чистую прибыль через 12-18 мес.
>
> Детальная ROI×Effort математика — [[automation-roadmap]]; финансовые анкоры — [[financial-deep-dive]]; технические детали Initiative #1 — [[dashboard-concept]].

## Slide 1 — One-line pitch

> **За 12 месяцев построим единый AI/data-контур для всей группы НЕРАЛ: 4 quick-win initiatives запускаются за 90 дней с payback ≤ 5 мес, в Phase 2 (90-180 дней) — операционные AI для 3 СХП и Башк. Мор., в Phase 3 (180-365 дней) — group-level ERP и Treasury. Capex 70 млн ₽ → run-rate бенефит 287 млн ₽/год. Это удваивает чистую прибыль группы.**

## Slide 2 — Where we are

- **Группа:** 13 действующих юрлиц, 2 600+ сотрудников, выручка ~14 млрд ₽ (с БМК) или 2,33 млрд ₽ (без БМК); см. [[subsidiaries-full-map]].
- **Бенефициар:** Исаев Э.Ф. (51% Концерна + 99-100% всех СХП) + Шигаповы (40%) + Козлов (9%).
- **Текущий ИТ-уровень:** decentralized 1С по entities; no shared data lake; no group treasury; финотчёт T+3..T+7 у ИД; реактивное обслуживание техники.
- **Триггер от ИД:** real-time TG-дашборд + voice queries — это **Initiative #1** программы.
- **Финансовые сигналы 2025** (фактическая отчётность ГИРБО):
  - Σ группы без БМК: 2,33 млрд ₽ выручки / 712 млн ₽ ЧП / 8,42 млрд ₽ активов
  - **Чишмы — обвал выручки -45% YoY** (884 → 488 млн), кр.обяз. 728 млн vs капитал 659 → ликвидный риск ⚠️
  - **Буздяк — net margin 55%** (332 млн ЧП на 605 млн выручки) — крупнейший cash generator
  - **БМК — выручка +31% до 10,5 млрд, но активное банкротное дело А07-3960/2024 на 1,91 млрд ₽** ⚠️
  - Концерн ЧП -90% YoY (450 → 46 млн) — общая операционная просадка

## Slide 3 — Strategic logic программы

1. **Агроцентр (35 млн выручки, 0,3% группы) = proof-of-concept лаборатория**, не источник денег. Цель: доказать ROI на маленькой компании за 90 дней → каскадировать на 12 остальных entities.
2. **Group-wide инициативы (G1-G5) дают порядок выше ROI**: 70-100 млн ₽ capex → 350-500 млн ₽/год экономии после полного roll-out. Запускаются после M2 (Day 180), когда per-entity layer уже работает.
3. **Срочный target — БМК** (10,5 млрд ₽, активное банкротство, новый кризис-CEO Шаманов 5 мес назад). **EX1a Restructuring dashboard за 1,8 млн ₽ может снять угрозу банкротства** = absolute highest-value первая инициатива на periметре БМК.
4. **Семейная группа с единым контролем** → решение Узбекова по поручению Исаева масштабирует пилот на 12 entities за месяцы (а не годы как в loose alliance).
5. **Группа не растёт, а ищет efficiency-плечи** (5-летний CAGR группы около 0%). AI-программа ложится в логику: «удержать маржу при стагнирующей выручке через -20% операционных затрат и +10% производственных метрик».

## Slide 4 — Top-5 initiatives по ₽/man-day ratio (Phase 1+2 quick wins)

Ниже — initiatives с наивысшим **ROI per unit of effort** из 25 в [[automation-roadmap]]. Все имеют payback ≤ 6 мес.

| Rank | Initiative | Entity | Effort (MD) | One-time (млн ₽) | Annual benefit (млн ₽) | Payback (мес) | Confidence |
|---:|---|---|---:|---:|---:|---:|---|
| 1 | **EX1d AR collection bot БМК** | БМК | 60 | 2,5 | **25-40** (mid 32) | 1,5 | medium-high |
| 2 | **#9 Погодные триггеры** | 3 СХП | 15 | 0,3 | 5-10 (mid 7,5) | **0,5** | medium-high |
| 3 | **EX3a Demand forecast Башк. Мор.** | Башк. Мор. | 90 | 3,8 | **30-55** (mid 42) | 2 | medium-high |
| 4 | **#3 NDVI variable-rate** | 3 СХП | 65 | 1,8 | 14-21 (mid 17,5) | 2 | medium |
| 5 | **#2 Predictive maintenance техники** | Чишмы+Буздяк+Матрикс | 150 | 8,5 | 15-22 (mid 18,5) | 6 | high |

**Cumulative Phase 1+2 quick-wins:** **~17 млн ₽ capex → ~117 млн ₽/год run-rate бенефита, ~3 мес payback.**

## Slide 5 — Roadmap по фазам

### Phase 1 (Days 0-90): Quick wins + foundation

| Initiative | Capex | Annual benefit | Notes |
|---|---:|---:|---|
| #1 TG exec-дашборд (Концерн + Агроцентр + 1 СХП MVP) | 3,2 млн ₽ | 7-10 млн | Базис для всех остальных |
| #9 Погодные триггеры | 0,3 млн ₽ | 5-10 млн | Модуль того же бота |
| EX1a БМК Restructuring dashboard | 1,8 млн ₽ | risk-prevention | Силами Шаманова |
| EX1d БМК AR collection | 2,5 млн ₽ | 25-40 млн | Самый высокий single-ROI |
| **Phase 1 total** | **7,8 млн ₽** | **~48 млн ₽/год run-rate** | **payback ≈ 2 мес** |

### Phase 2 (Days 90-180): Operational AI

| Initiative | Capex | Annual benefit |
|---|---:|---:|
| #3 NDVI variable-rate (3 СХП) | 1,8 млн | 14-21 млн |
| #2 Predictive maintenance техники (50 ед.) | 8,5 млн | 15-22 млн |
| EX3a Demand forecast Башк. Мор. | 3,8 млн | 30-55 млн |
| #10 Умные склады зерна | 4,5 млн | 8-15 млн |
| EX2c Уф.Гипс. AI legal assistant | 0,7 млн | 4-7 млн |
| **Phase 2 total** | **19,3 млн ₽** | **+71-120 млн ₽/год** |
| **Cumulative through Day 180** | **27,1 млн ₽** | **~119-168 млн ₽/год run-rate** |

### Phase 3 (Days 180-365): Strategic + Group-level

| Initiative | Capex | Annual benefit |
|---|---:|---:|
| #7 RPA documents (all 5 entities) | 2,5 млн | 3,5-5 млн |
| EX2a/b Predictive maint. + Energy печей Уф. Гипс. | 7,5 млн | 32-50 млн |
| #5 Logistics Башхолод | 5 млн | 11-18 млн |
| **G1 Group ERP+MDM (start, partial)** | 12 млн | partial |
| **G2 Group Treasury (start)** | 5 млн | 18-30 млн |
| EX1b MES/SCADA БМК (если Шаманов go) | 11 млн | 50-80 млн |
| **Phase 3 total** | **~43 млн ₽** | **+115-180 млн ₽/год** |
| **Cumulative through Day 365** | **70 млн ₽** | **~234-348 млн ₽/год run-rate** |

### Gate criteria

- **Gate 1→2 (Day 90):** ≥2 of 3: дашборд live; weather triggers сгенерировали ≥3 actionable alerts; AR collection БМК показал DSO -5 days на пилоте.
- **Gate 2→3 (Day 180):** ≥1 entity показывает измеримый ROI на 50%+ от underwriten. Если да — green light на G1+G2.
- **Gate 3 review (Day 365):** full review; решение о следующем горизонте (M&A AI, экспансия в регионы, deepening).

## Slide 6 — Что делаем с initiatives confidence: low

**Эти 5 initiatives не идут в Phase 1 underwriting — требуют либо pilot scope для замера baseline, либо additional benchmarks:**

| # | Initiative | Почему low confidence | Действие |
|---|---|---|---|
| #4 | IoT КРС молочного | Нет точного размера стада (можем быть в диапазоне 800-2 000 голов → ROI ±50%) | **Уточнить у Махиянова перед commit**; иначе пилот на 100 головах за 0,7 млн ₽ |
| #6 | ML-прогноз урожайности | "Soft" benefit, трудно изолировать; нет direct benchmark в russian agro | **Пилот на 1 поле Чишмы за 1,3 млн ₽** — измерить delta к baseline в одном сезоне |
| G3 | Group BI совет | Soft бенефиты только; зависит от engagement совета | Внутри G1 — start with engagement-tracking, не отдельный capex |
| EX4a | Нерал-Строй CRM lead-qual | Нет direct benchmark под девелопмент в [[ai-benchmarks]] | **Pilot на 1 проекте за 1,1 млн ₽** перед commit на full scope |
| EX4b | Сметная аналитика | Same as EX4a | Combine с EX4a в один pilot |

## Slide 7 — Expected impact summary

| Метрика | Y0 (текущее) | Y1 end-state | Y2 (full run-rate) |
|---|---|---|---|
| **Group revenue (без БМК)** | 2,33 млрд ₽ | 2,4-2,5 млрд (+3-7%) | 2,5-2,7 млрд (+8-15%) |
| **Group net profit** | 712 млн ₽ | 950-1 100 млн | **1 100-1 350 млн (+55-90%)** |
| **EBITDA margin (estim)** | ~30% | ~36% | ~42% |
| **Cash cycle (DSO + DIO − DPO)** | ~110 дней (estim) | ~95 дней | ~85 дней |
| **Время на close-of-period** | 14 дней | 8 дней | 4 дня |
| **Время реакции ИД на отклонения** | 3-7 дней | <12 ч | <2 ч |

**Метрика #1 для совета:** **программа удваивает чистую прибыль группы за 18 мес** (712 → ~1 350 млн ₽/год).

## Slide 8 — Что нужно от leadership

| Что | Что именно | Кто sign-off |
|---|---|---|
| **Бюджет** | Capex Y1: **70 млн ₽** (gated по фазам: 7,8 + 19,3 + 43); Opex Y1+: **9-12 млн ₽/год** | Управляющий совет |
| **Sponsor** | Executive sponsor программы — **Узбеков Э.Д.** (CEO Концерна, нейтрален к Исаев/Шигапов политике) | Исаев Э.Ф. (Президент) |
| **Product owner** | Phase 1: **Бердина Т.Д.** (Агроцентр) — заказчик дашборда; Phase 2-3: расширение на Махиянова (СХП), Шаманова (БМК), Зеленкину (Башк. Мор.) | Узбеков |
| **Доступы** | API/ODBC к 1С всех 5 entities Концерн-периметра + 3 СХП; банк-данные для G2 (Phase 3) | Каждый GD entity |
| **Кадры** | Day 0: 3 dev + 1 ML eng + 1 интегратор 1С (внешняя команда). Day 90: + 1 data engineer; Day 180: + 1 DevOps | Узбеков + HR |
| **Change mgmt** | Коммуникация полевому персоналу СХП и бухгалтерии: "AI приходит в помощь, не на контроль". Без этого adoption #2/#7 провалится | Каждый GD entity |

## Slide 9 — Risks + Mitigations (top 5 from full register в roadmap)

| # | Риск | Влияние | Mitigation |
|---|---|---|---|
| R1 | **Политика Исаев ↔ Шигаповы** на shared services (G1-G5) | G1/G2/G3 затягиваются 12+ мес | Sponsor через Узбекова; transparency — никто не выглядит хуже другого; пилот на блоке СХП Махиянова (politically neutral) |
| R2 | **Качество данных в 1С** — справочники не нормализованы | Все group-level инициативы ломаются | Phase 1 включает 4-нед data audit как первую задачу |
| R3 | **Savencia блокирует** интеграции в БМК | #8 + EX1b/c заблокированы | EX1a (внутренний AR-дашборд) не требует Savencia; полные production AI — only with sign-off |
| R4 | **Чишмы financial distress** (кр.обяз. 728M, выручка -45%) | Если defaults — теряем pilot site для #2/#3/#10 | Diversify pilots — Буздяк primary, Матрикс backup |
| R5 | **Низкая confidence по 5 initiatives** — overestimation на 30-50% | Cumulative Y1 ROI может быть на 40-70 млн ниже underwriten | Pilot scopes до commit полного бюджета; gate-reviews на M2/M3 |

Полный 10-risk register — [[automation-roadmap#Risk register]].

## Slide 10 — Decision points для Управляющего Совета

1. **Now (5-2026):** Одобрить Phase 1 budget **7,8 млн ₽ + opex 2 млн ₽** (3 мес). Exec sponsor — Узбеков. Product owner — Бердина.
2. **+3 мес (8-2026, Gate 1):** Если ≥2 of 3 deliverables зелёные → Phase 2 budget 19,3 млн ₽.
3. **+6 мес (11-2026, Gate 2):** Если ≥1 entity ROI ≥ 50% от плана → Phase 3 budget 43 млн ₽ + green light G1/G2.
4. **+12 мес (5-2027, Year 1 close):** Full program review → решение о Y2 (deepening + M&A AI + регионы).

---

## Cross-links

- [[automation-roadmap]] — детальная ROI×Effort математика 25 initiatives + sorted backlog
- [[financial-deep-dive]] — фактические multi-year финансовые анкоры (ГИРБО 2021-2025)
- [[subsidiaries-full-map]] — owner-карта 13 entities группы
- [[ai-benchmarks]] — international references (John Deere, Cargill, Climate FieldView, Cognitive Pilot)
- [[dashboard-concept]] — детали Initiative #1 (UX/метрики/триггеры/tech stack)
- [[court-cases]] — judicial exposure (для контекста БМК)
