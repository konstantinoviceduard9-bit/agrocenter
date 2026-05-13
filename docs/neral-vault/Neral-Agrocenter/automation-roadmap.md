---
tags: [project, neral-agrocenter, roadmap, automation, group]
date: 2026-05-11
updated: 2026-05-11 (v3 — rigorous ROI×Effort, sorted backlog, confidence tags)
---

# Дорожная карта AI/автоматизации для Группы НЕРАЛ — v3

> **Что нового в v3.** Раньше initiatives оценивались "vibes-based" (High/Medium/Low). В v3 — прозрачная ROI-математика по каждой: effort в man-days, one-time/recurring cost в ₽, конкретный mechanism окупаемости, payback в месяцах, риск, dependencies, confidence-тэг. В конце — sorted backlog по `(ROI/Effort)` и phasing 90/180/365.
>
> **Базис цифр:** [[financial-deep-dive]] §2 (фактические данные ГИРБО 2021–2025), [[subsidiaries-full-map]] (структура группы), [[ai-benchmarks]] (international references).
>
> **Анкоры (для ROI калибровки):**
> - Σ группы 2025 без BMK: выручка 2,33 млрд ₽ / прибыль 712 млн ₽ / активы 8,42 млрд ₽ / 464 чел.
> - Σ с BMK (исторически в группе): выручка 12,79 млрд ₽ / активы 16,19 млрд ₽ / 1 157 чел.
> - Крупнейший внутренний entity: СХП Нерал-Матрикс (1 041 млн ₽ выручки, 318 млн ₽ ЧП, 174 чел).
> - Самая прибыльная: СХП Нерал-Буздяк (605 млн ₽ выручки, 331 млн ₽ ЧП, net margin 55%).
> - Самая рискованная: СХП Нерал-Чишмы (488 млн ₽, -45% YoY, краткосрочные обязательства 728 млн ₽ vs капитал 659 млн ₽).
> - Внешний (Savencia-контролируемый, но исторически в группе): АО Белебеевский молком — 10 466 млн ₽ выручки, активное банкротное дело 1,91 млрд ₽.

## Методология оценки

Каждой инициативе присвоены:

- **Effort (man-days):** дискавери + разработка + интеграции + обучение пользователей (P50 оценка, не оптимистическая).
- **One-time cost (₽):** discovery + dev + лицензии + hardware. Включает 20% buffer на change requests.
- **Recurring cost (₽/год):** SaaS лицензии + cloud + maintenance (ML retraining + bug fixes 10-15% от one-time/год).
- **ROI mechanism:** конкретный механизм. Не "повышаем эффективность" а либо (а) "снижаем X% от Y затрат → Z ₽/год", либо (б) "увеличиваем Y кг/га / шт. на партию → +Z ₽ выручки/год".
- **Annual benefit (₽):** численная привязка к актуальным финансовым цифрам entity.
- **Payback (months):** one-time / (annual benefit − annual recurring), округлено до целых.
- **Risk:** что может сорвать или сильно сократить ROI (organizational / technical / regulatory).
- **Dependencies:** что должно быть готово до старта.
- **Priority tier:**
  - **P0 (Quick win):** payback ≤ 6 мес, effort ≤ 60 man-days, high confidence
  - **P1 (Strategic):** payback 6–18 мес, effort 60–250 man-days, medium-high confidence
  - **P2 (R&D / bet):** payback > 18 мес или confidence low, effort > 250 man-days, либо требует partner alignment

- **Confidence:** **high** (есть direct benchmark в [[ai-benchmarks]] + Russian implementation) / **medium** (benchmark есть, но для другой geo/scale) / **low** (extrapolation без direct case).

---

## Часть A — Per-entity initiatives (1–10)

### Initiative #1. Telegram exec-дашборд + voice queries (LLM) [Концерн + Агроцентр + 3 СХП]

| Поле | Значение |
|---|---|
| Что внедряем | TG-бот: real-time метрики из 1С 5 entities + триггерные алерты + голосовые запросы → text/chart. Подробно: [[dashboard-concept]]. |
| Задача | ИД сейчас получает разрозненные отчёты T+3..T+7. Нет единого экрана. Поздняя реакция на кэш-разрывы (см. Чишмы — 728 млн краткосроч. обязательств), просрочки дебиторки и т.д. |
| Tech stack | aiogram + Whisper/YandexSpeechKit + Qwen2.5-32B on-prem + pgvector + ClickHouse + Airflow ETL из 1С |
| **Effort** | **85 man-days** (15 dev discovery, 35 backend+ETL, 15 LLM/RAG, 10 frontend bot, 10 UAT/training) |
| **One-time cost** | **3,2 млн ₽** (dev 2,4 + 1× GPU на OVH1 0,5 + лицензии 0,3) |
| **Recurring** | **0,8 млн ₽/год** (cloud + LLM API/inference + maintenance) |
| **ROI mechanism** | (а) экономия 6 ч/нед × 4 топа × 1,5 года ставка = 0,8 млн/год прямой; (б) **раньше детекция кэш-разрыва на 14 дней** на Чишмах (728 млн кр.обяз.) → -0,5% упущенных дисконтов и штрафов = 3,6 млн/год; (в) DSO -3-5 дней при дебиторке группы ~600 млн → ускорение CCC и -0,5–1% cost of capital → 3-6 млн/год |
| **Annual benefit** | **7–10 млн ₽/год** (mid 8,5) — confidence medium-high (бенчмарк John Deere Ops Center + Cognitive Pilot, но русская команда внедрения и кастомизация на 1С) |
| **Payback** | 3,2M / (8,5M − 0,8M) ≈ **5 мес** |
| Risk | Качество 1С-данных (справочники не нормализованы); сопротивление финдиректоров отдельных юрлиц к sharing данных; LLM hallucinations на финансовых запросах (mitigate: SQL-агент с whitelisting запросов, ответы со ссылкой на source row) |
| Dependencies | OVH1 GPU-сервер; доступ к 1С через ODBC/REST; allowlist Telegram ID |
| Priority | **P0** |
| Confidence | **medium-high** |

### Initiative #2. Predictive maintenance парка с/х техники [Чишмы + Буздяк + Матрикс]

| Поле | Значение |
|---|---|
| Что внедряем | OBD-телематика на ~50 единиц (тракторы К-744, комбайны Acros/Torum, опрыскиватели) + ML на CAN-bus и моторесурсе + интеграция в TG-дашборд из #1 |
| Задача | Простой техники в посев/уборку — главный killer урожайности. Сейчас обслуживание реактивное. |
| Tech stack | Российские OBD-D-trackers (Cognitive Pilot) или Агросигнал SaaS + ML (изолирующий лес/LSTM на телеметрии масла, температуры, оборотов) |
| **Effort** | **150 man-days** (40 железо+установка на 50 ед, 60 ML/data pipeline, 30 интеграция с #1, 20 driver training) |
| **One-time cost** | **8,5 млн ₽** (50 × ~100 тыс/единица OBD + ML dev 2,5 + установка/training 1,0) |
| **Recurring** | **1,2 млн ₽/год** (500 ₽/га × ~2 000 га × 1 платформа + connectivity) |
| **ROI mechanism** | Бенчмарк John Deere: −50–70% незапланированных простоев, −15% топлива. На парк ~50 машин у Чишмы+Буздяк+Матрикс: (а) топливо ~30–40 млн ₽/год × −12% (conservative vs −15%) = **3,6–4,8 млн/год**; (б) downtime в уборку: 5 машин × 3 дня простой × 50 га/день × 30 ц/га × 1 200 ₽/ц = 27 млн ₽ упущенной уборки/сезон × −50% = **13,5 млн/год**; (в) +10% жизни машин на парке балансом ~200 млн ₽ × 8% амортизация/год × 10% продление = **1,6 млн/год** |
| **Annual benefit** | **15–22 млн ₽/год** (mid 18,5) — confidence high (Cognitive Pilot имеет direct refs в Башкирии 2,6 млн ₽/1000 га) |
| **Payback** | 8,5M / (18,5M − 1,2M) ≈ **6 мес** |
| Risk | Несовместимость старой техники с CAN-bus (часть парка возможно 2010-х) → нужны внешние OBD-tracker'ы (дешевле, но менее точные); сопротивление водителей к "слежке" |
| Dependencies | Инвентаризация парка по моделям; sponsor от Махиянова (Чишмы+Матрикс) |
| Priority | **P0** |
| Confidence | **high** |

### Initiative #3. Спутниковый мониторинг полей + NDVI variable-rate [3 СХП]

| Поле | Значение |
|---|---|
| Что внедряем | Sentinel-2 imagery + NDVI/NDWI зональный анализ + variable-rate скрипты на удобрения и СЗР, экспорт картограмм в борткомпы |
| Задача | Однородная обработка → перерасход удобрений/СЗР на низкопродуктивных зонах, недозамечание проблемных пятен. |
| Tech stack | Sentinel Hub API + ExactFarming / Cropwise RU / Агросигнал + GIS-полигоны |
| **Effort** | **65 man-days** (20 GIS-разметка полей, 25 платформа+ML, 10 интеграция с борттехникой, 10 agronomist training) |
| **One-time cost** | **1,8 млн ₽** (dev + платформа setup + GIS-консалтинг) |
| **Recurring** | **0,9 млн ₽/год** (subscription Агросигнал ~500 ₽/га × ~2 000 га хорошо засеянных площадей) |
| **ROI mechanism** | Climate FieldView ref: −15% инпуты, +5 bu/acre. Для зерновых ~7 000–10 000 га (грубая оценка по выручке СХП): (а) удобрения ~50 млн ₽/год × −12% (conservative) = **6 млн/год**; (б) урожайность +3–5% на 7 000 га × 30 ц/га × 1 200 ₽/ц = **7,5–13 млн/год**; (в) СЗР −10% = 1–2 млн/год |
| **Annual benefit** | **14–21 млн ₽/год** (mid 17,5) — confidence medium (Climate FieldView западный, в РФ работают local аналоги, но без сопоставимого scale benchmark) |
| **Payback** | 1,8M / (17,5M − 0,9M) ≈ **2 мес** |
| Risk | Часть техники Чишмы/Буздяка без variable-rate hardware → benefit обрезается до advisory layer (−40% от расчёта); точность Sentinel-2 (10 м/пиксель) недостаточна для мелких пятен — нужны дрон-выезды (но это уже см. Taranis-style, P2) |
| Dependencies | Полевые границы в GeoJSON; список техники с поддержкой variable-rate |
| Priority | **P0** |
| Confidence | **medium** |

### Initiative #4. IoT-мониторинг КРС молочного [Чишмы + Буздяк + Матрикс]

| Поле | Значение |
|---|---|
| Что внедряем | Болюсы/ошейники на стадо: t°, активность, румен; ML alerts на мастит/хромоту/охоту |
| Задача | Поздняя детекция болезней снижает удои и повышает выбраковку. Ручной мониторинг охоты пропускает циклы (-1 теленок = -150 тыс ₽). |
| Tech stack | Mustang/АгроРИВС (РФ) или Allflex (китайская копия) ошейники + LoRaWAN + ML heat-detection (готовые модели на рынке) |
| **Effort** | **120 man-days** (15 ферма-аудит, 40 hardware install ~1500 голов, 30 ML/dashboard, 20 vet training, 15 интеграция с дашб) |
| **One-time cost** | **7 млн ₽** (~1 500 голов × 3 000 ₽ + 2 шлюза + setup + интеграция) |
| **Recurring** | **0,7 млн ₽/год** (replacement collars + SaaS) |
| **ROI mechanism** | На стаде ~1 500 голов (грубая оценка): (а) +5% надой на 1 500 × 6 000 л/год × 35 ₽/л = +15,75 млн ₽; **but** Cargill Prosense ref ближе к +3% → conservative +9,5 млн; (б) −30% случаев мастита: ~50 случаев/год × 15 тыс ₽ ущерб = **0,75 млн/год**; (в) +1 теленок/100 коров через лучшую heat-detection = 15 × 150 тыс = **2,2 млн/год** |
| **Annual benefit** | **10–18 млн ₽/год** (mid 13) — confidence **low** (нет точного размера стада — нужно уточнение; benchmark ProBeef/CattleView западный) |
| **Payback** | 7M / (13M − 0,7M) ≈ **7 мес** |
| Risk | Нет публичной информации о реальном размере стада — может быть 800–2 000 голов, ROI ±50%; износ ошейников в условиях РФ-фермы (грязь, мороз); ветврач должен реагировать на alerts (а не только система их генерировать) |
| Dependencies | **Точный размер стада** (открытый вопрос к клиенту); готовность зооветслужбы реагировать |
| Priority | **P1** |
| Confidence | **low** → **уточнить с клиентом перед commit** |

### Initiative #5. Логистика + supply-chain optimization [Башк. Холод + Милк Трейд + Нерал-Продукт]

| Поле | Значение |
|---|---|
| Что внедряем | Optimizer маршрутов рефрижераторов (cold-chain, окна доставки, заполненность) + ML demand forecast по SKU/каналу |
| Задача | Холодовая цепь дорогая; пустые пробеги и temp-нарушения бьют по марже FMCG-блока. |
| Tech stack | OR-tools или Yandex Routing API + Prophet/LightGBM forecast + интеграция с 1С:УТ Башхолода |
| **Effort** | **140 man-days** (30 data audit Башхолод+Милк Трейд, 50 routing engine, 40 demand forecast, 20 интеграция с 1С) |
| **One-time cost** | **5 млн ₽** |
| **Recurring** | **1,2 млн ₽/год** (Yandex Routing API + maintenance моделей) |
| **ROI mechanism** | Башк. Мороженое выручка ~1 300 млн ₽: (а) транспортные издержки FMCG-блока ~100 млн ₽/год × −7% (conservative vs Cargill 30× ROI) = **7 млн/год**; (б) demand forecast уменьшает overstock на 15% × средние запасы 80 млн ₽ × 20% holding cost = **2,4 млн/год**; (в) −10% OOS на горячих SKU летом = +1,5–3% выручки = **2–4 млн ₽** |
| **Annual benefit** | **11–18 млн ₽/год** (mid 14,5) — confidence medium (Cargill ref сильный, но Башхолод меньше масштабом) |
| **Payback** | 5M / (14,5M − 1,2M) ≈ **5 мес** |
| Risk | Башхолод/Милк Трейд могут отказать в data sharing (отдельный owner Зеленкина); качество мастер-данных по SKU; маршруты не оптимизируются если регулярные → нужен dispatcher buy-in |
| Dependencies | Согласие Зеленкиной (Башк. Мор) на доступ к ERP; data audit 1С |
| Priority | **P1** |
| Confidence | **medium** |

### Initiative #6. ML-прогноз урожайности по полям [3 СХП]

| Поле | Значение |
|---|---|
| Что внедряем | XGBoost/CatBoost модель на NDVI + Open-Meteo + history → прогноз урожайности каждого поля за 30-60 дней до уборки |
| Задача | Планирование уборки, контрактов сбыта, кэш-флоу. Чишмы потеряла -45% выручки в 2025 — late warning мог снять часть downside. |
| Tech stack | XGBoost + Sentinel-2 + Open-Meteo + историч. сбор с СХП за 3-5 лет |
| **Effort** | **55 man-days** (10 data collection, 30 ML, 10 интеграция с #1, 5 validation) |
| **One-time cost** | **1,3 млн ₽** |
| **Recurring** | **0,3 млн ₽/год** |
| **ROI mechanism** | (а) **Hedging revenue risk:** ранний прогноз −20% урожайности → forward-contracts могут зафиксировать цену → на 488 млн выручке Чишмы 1% спасения = **5 млн/год**; (б) переговорная позиция перед банками/клиентами; (в) лучшее планирование cap kapas (хранение зерна) — экономия аренды |
| **Annual benefit** | **4–8 млн ₽/год** (mid 6) — confidence **low** (нет точного benchmark; "soft" value, сложно изолировать от других факторов) |
| **Payback** | 1,3M / (6M − 0,3M) ≈ **3 мес** (но фактический payback может уехать вправо если urожайность стабильна) |
| Risk | Данных за 3-5 лет может не оказаться в нормализованном виде; модель улучшает решения, но решения принимаются вне системы (директор СХП); confidence low |
| Dependencies | Доступ к историч. yield-данным; Initiative #3 (NDVI) как feature source |
| Priority | **P1** |
| Confidence | **low** |

### Initiative #7. RPA + OCR + LLM-классификатор документов [Концерн + Агроцентр + 3 СХП, потом группа]

| Поле | Значение |
|---|---|
| Что внедряем | OCR + LLM-классификация входящих УПД/счетов/ТТН/актов сверки → авто-заведение в 1С + контроль соответствия договорам |
| Задача | На 5 entities Concern-периметра — десятки тысяч документов в год; ручная обработка дорогая. Group-wide (G1+) — сотни тысяч. |
| Tech stack | Yandex Vision OCR / Dbrain + GPT-4-class / Qwen LLM-классификатор + 1С API |
| **Effort** | **75 man-days** (15 типизация документов, 35 OCR+LLM dev, 15 1С интеграция, 10 user training) |
| **One-time cost** | **2,5 млн ₽** |
| **Recurring** | **0,9 млн ₽/год** (Yandex Vision API + maintenance) |
| **ROI mechanism** | Бухгалтерия 5 entities ~12-15 человек (взносы Концерна+Агроцентра+3 СХП ≈57 млн → пропорция бухгалтерии). −25% FTE рутинной обработки = **3,5–4,5 млн ₽/год**; ускорение close-of-period с 10 до 3 дней = soft benefit (cleaner CFO reporting) |
| **Annual benefit** | **3,5–5 млн ₽/год** (mid 4,2) — confidence medium-high (стандартный RPA use-case, есть много РФ-имплементаций) |
| **Payback** | 2,5M / (4,2M − 0,9M) ≈ **9 мес** |
| Risk | Нестандартизированные шапки 1С между entities → нужен MDM (см. G1); сопротивление бухгалтерии (страх увольнений) — mitigate через перевод сэкономленного времени на аналитику, не cuts |
| Dependencies | Стандартизация контрагентов в 1С (минимум); инфраструктура от #1 |
| Priority | **P1** |
| Confidence | **medium-high** |

### Initiative #8. Computer Vision на линиях переработки [Белебеевский молком — только если Шаманов одобрит]

| Поле | Значение |
|---|---|
| Что внедряем | Камеры + ML на линиях сыра: дефекты головок, корка, форма; счётчики; HACCP-фиксация |
| Задача | Снижение брака сыра, прослеживаемость, automation HACCP. |
| Tech stack | IP-камеры + NVIDIA Jetson Edge AI + дообученный YOLOv8/Detectron2 |
| **Effort** | **200 man-days** (40 line audit + camera placement, 100 ML training на дефектах, 40 интеграция с MES, 20 HACCP compliance) |
| **One-time cost** | **8 млн ₽** (камеры + Jetson nodes + dev) |
| **Recurring** | **1,5 млн ₽/год** (edge replacement + ML retraining) |
| **ROI mechanism** | Cargill CarVe: −15-30% брака. БМК выручка 10,5 млрд ₽, себестоимость 9,4 млрд ₽; predполагаем брак ~2% от себестоимости = ~190 млн ₽/год; −15% = **28 млн/год**. Conservative −10% = **19 млн/год**. |
| **Annual benefit** | **19–28 млн ₽/год** (mid 23,5) — confidence medium (Cargill ref strong, но не публикует exact figures) |
| **Payback** | 8M / (23,5M − 1,5M) ≈ **5 мес** |
| Risk | **Контроль Savencia 51% — нужно их согласие** (показывает данные французскому головному); идёт банкротное дело 1,91 млрд ₽ — приоритет управления другой; integration с MES возможно проприетарной |
| Dependencies | **Sign-off от Шаманова И Savencia** (organizational gate); инвентаризация линий; HACCP-фрейм |
| Priority | **P2** (P1 only if Savencia approves — иначе блокировка) |
| Confidence | **medium** |

### Initiative #9. Погодная триггерная система [3 СХП]

| Поле | Значение |
|---|---|
| Что внедряем | Алерты в TG: "7 дней до дождя по полям A/B/C — окно для уборки", "Заморозки -3°C завтра". Модуль бота #1. |
| Задача | Решения о выходе техники, защите, удобрении сейчас "по агроному". Прозевал окно → 5-10% потерь урожая. |
| Tech stack | Open-Meteo / Meteoblue API + правила на полигоны GeoJSON + TG-бот из #1 |
| **Effort** | **15 man-days** (5 GeoJSON setup, 5 rules engine, 5 integration с #1) |
| **One-time cost** | **0,3 млн ₽** |
| **Recurring** | **0,1 млн ₽/год** (Meteoblue subscription) |
| **ROI mechanism** | Спасение **одного** запоротого окна на 1 СХП = 100 га × 30 ц/га × 1 200 ₽/ц × 30% потерь = **1,1 млн ₽** за один кейс. Реалистично 2-3 spasenных кейса/сезон × 3 СХП = **6–10 млн ₽/год**. |
| **Annual benefit** | **5–10 млн ₽/год** (mid 7,5) — confidence medium (логика очевидна, но кейсы трудно изолировать пост-фактум) |
| **Payback** | 0,3M / (7,5M − 0,1M) ≈ **0,5 мес = 2 недели** (на сезон) |
| Risk | Минимальный. Только если агрономы игнорируют alerts. |
| Dependencies | **Только #1 (бот) и GeoJSON полей.** Самый дешёвый quick win. |
| Priority | **P0** (быстрейший payback всей программы) |
| Confidence | **medium-high** |

### Initiative #10. Умные склады зерна [3 СХП] — сенсорные косы

| Поле | Значение |
|---|---|
| Что внедряем | Сенсорные косы (t°+влажность) в силосы/зернохранилища + alerts на самосогревание/плесень в TG |
| Задача | Потери зерна при хранении в РФ — 5–10%. Очаг самосогревания часто детектируется поздно. |
| Tech stack | Российские косы Дозор/АгроРусь + LoRaWAN + интеграция с #1 |
| **Effort** | **60 man-days** (20 установка на ~15 силосов, 25 software/integration, 15 training) |
| **One-time cost** | **4,5 млн ₽** (15 силосов × ~300 тыс ₽/силос среднее) |
| **Recurring** | **0,3 млн ₽/год** |
| **ROI mechanism** | Объём хранения 3 СХП оценочно ~30 000 т зерна (по выручке зерновой части). Текущие потери ~5-8% = 1 500–2 400 т × 12 000 ₽/т = **18–29 млн ₽/год потерь**. Снижение до 2% = **сэкономлено 9–17 млн ₽/год**. Conservative: **8 млн/год**. |
| **Annual benefit** | **8–15 млн ₽/год** (mid 11) — confidence medium (бенчмарки потерь по РФ публикуются Россельхозом, но конкретный объём хранения Нерала требует уточнения) |
| **Payback** | 4,5M / (11M − 0,3M) ≈ **5 мес** |
| Risk | Точный объём хранения неизвестен → ROI ±40%; косы могут давать false positives зимой |
| Dependencies | Карта силосов и объёмов; #1 для alert routing |
| Priority | **P1** |
| Confidence | **medium** |

---

## Часть B — Group-level initiatives (G1–G5)

> Активация: **после M2 уровня 1** (per-entity #1+#9 уже работают, есть proof point для совета).

### G1. Group-wide ERP + MDM (Master Data Management)

| Поле | Значение |
|---|---|
| Что внедряем | Единый MDM-слой поверх 13 инстансов 1С (контрагенты/SKU/счета/сотрудники) + data lake на OVH1 + поэтапное приведение справочников к единому виду |
| Задача | Сейчас inter-company reconciliation ручной; невозможно построить consolidated reporting за <2 недели; дубли контрагентов раздувают AR/AP. |
| Tech stack | ClickHouse data lake + dbt + custom MDM-сервис + 1С коннекторы (через ODBC/OData/REST) |
| **Effort** | **600 man-days** (40 architecture, 200 коннекторы × 13 entities, 200 data cleanup, 120 MDM service, 40 training) |
| **One-time cost** | **30 млн ₽** |
| **Recurring** | **4,5 млн ₽/год** (DevOps + лицензии + поддержка) |
| **ROI mechanism** | (а) **−15-20% admin FTE** в финблоке группы. Финблок 13 entities ~50-70 чел × 1,0 млн ₽/год средний полный cost = 50-70 млн × −18% = **9–13 млн ₽/год**; (б) **eliminate inter-company reconciliation errors** на 14 млрд ₽ оборота × 0,8% (conservative vs 1-2% ref) = **110 млн ₽/год**; (в) ускорение close-of-period с 14 до 4 дней — soft benefit |
| **Annual benefit** | **120–180 млн ₽/год** (mid 150) — confidence **medium** (downscaled от исходной оценки 220-400 млн — конс. % для underwriting) |
| **Payback** | 30M / (150M − 4,5M) ≈ **3 мес** (после полного roll-out, который сам по себе 12 мес) |
| Risk | **Политика между Исаевым и Шигаповыми** — главный риск; кастомизации 1С разные между entities (особенно у Уф. Гипс., новый менеджмент); требуется sponsor у Узбекова |
| Dependencies | #1 live (showed value); buy-in Управляющего совета |
| Priority | **P1** (Phase 2) |
| Confidence | **medium** |

### G2. Group Treasury + consolidated cash flow

| Поле | Значение |
|---|---|
| Что внедряем | Единое отображение cash-позиции 13 entities + auto-sweep избытка ликвидности в межфирменные займы + forecast cash gap 30/60/90 дней |
| Задача | Группа платит проценты по внешним кредитам пока на счетах сестринских entities висит cash. Чишмы critically illiquid (728M кр.обяз. vs 0 cash), Буздяк cash-positive — внутригрупповой займ оптимизирует. |
| Tech stack | Bank API integration (Открытие, ВТБ, СБ) + treasury workflow + dashboard layer на #1 |
| **Effort** | **180 man-days** |
| **One-time cost** | **9 млн ₽** |
| **Recurring** | **1,5 млн ₽/год** |
| **ROI mechanism** | (а) Снижение внешней кредитной нагрузки 5-8% при долге группы ~2-3 млрд ₽, ставка 18%; экономия = **18–43 млн ₽/год**; (б) **strategic upside: рефинансирование 1,9 млрд ₽ долга БМК** через внутригрупповой займ → снять угрозу банкротства (value: priceless, но не считаем в ROI) |
| **Annual benefit** | **30–50 млн ₽/год** (mid 40) — confidence medium-high |
| **Payback** | 9M / (40M − 1,5M) ≈ **3 мес** |
| Risk | Юр. оформление inter-company займов требует careful tax planning; разные банки у разных entities; политика (Шигаповы могут не согласовать займ "своих" entities на покрытие Исаевских) |
| Dependencies | G1 (минимум master-каталог контрагентов и счетов); legal sponsor |
| Priority | **P1** (Phase 2) — strategic |
| Confidence | **medium-high** |

### G3. Group BI / shared dashboard для Управляющего Совета

| Поле | Значение |
|---|---|
| Что внедряем | Дашборд C-level: KPI каждого entity на одном экране, drill-down, voice ассистент уровня "Покажи cash burn БМК", "Прогноз молока Чишмы на июнь" |
| Задача | Сейчас совет (Исаев+Шигаповы+Козлов) встречается ежемесячно; данные готовятся по 3-5 дней. Voice-ассистент с RAG по корпорат. данным снимает 80% инфо-запросов. |
| Tech stack | Расширение #1 на C-level role + Metabase/Superset слой; voice assistant на тех же tools |
| **Effort** | **120 man-days** |
| **One-time cost** | **7 млн ₽** |
| **Recurring** | **1,8 млн ₽/год** |
| **ROI mechanism** | (а) Hard: −50% времени топов на data prep × 5 топов × 200 ч/год × 5 тыс ₽/ч = **2,5 млн/год** — soft; (б) **ранняя детекция операционных проблем** 0,5-1% от выручки 14 млрд × prevention = **70–140 млн ₽/год** — но confidence low |
| **Annual benefit** | **50–100 млн ₽/год** (mid 75) — confidence **low** (soft benefits только) → пометить как `confidence: low` |
| **Payback** | 7M / (75M − 1,8M) ≈ **2 мес** при mid, но downside 10-15 мес |
| Risk | "Soft" benefits — трудно underwrite; зависит от того, реально ли совет начнёт пользоваться; политика — кто-то увидит свои KPI на чужом экране |
| Dependencies | G1 + #1 |
| Priority | **P1** (Phase 2-3) |
| Confidence | **low** |

### G4. Unified HR + workforce analytics

| Поле | Значение |
|---|---|
| Что внедряем | Единая HR-платформа для 2 600 сотрудников; ATS, payroll, perf reviews, обучение; AI-аналитика текучести (особенно БМК где штат -36%) |
| Задача | Сейчас HR раздельный 13 entities; нет единой workforce analytics; высокая текучесть в БМК — недопонимание причин |
| Tech stack | 1С:ЗУП-расширение или внешний (Талантикс/HR Link) + ML-аналитика поверх |
| **Effort** | **400 man-days** (12-мес проект) |
| **One-time cost** | **15 млн ₽** |
| **Recurring** | **3,5 млн ₽/год** (HR-SaaS лицензии 2 600 users) |
| **ROI mechanism** | (а) −20-25% HR-FTE: текущий ~20 HR-специалистов × 0,7 млн ₽ полный cost = 14 млн × −22% = **3 млн/год**; (б) −2 п.п. текучести: при ~20% базе и cost замены 100 тыс ₽/чел на 2 600 × 2 п.п. = **5,2 млн/год** |
| **Annual benefit** | **6–10 млн ₽/год** (mid 8) — confidence medium |
| **Payback** | 15M / (8M − 3,5M) ≈ **40 мес** |
| Risk | Long payback; политика; зачем платить 15M если HR-блок группы decentralized по природе |
| Dependencies | G1 (master-каталог сотрудников) |
| Priority | **P2** (Phase 3+) — низкий приоритет с текущим payback |
| Confidence | **medium** |

### G5. Group supply-chain & cold-chain telemetry

| Поле | Значение |
|---|---|
| Что внедряем | IoT-телеметрия товаропотока поле → переработка → дистрибуция → касса; ML на потери и cold-chain нарушения |
| Задача | Молоко из СХП Чишмы/Буздяк/Матрикс → БМК → Нерал-Продукт/Милк Трейд → ритейл. Сейчас нет end-to-end видимости. |
| Tech stack | IoT-датчики на 50-100 машин + MQTT/Kafka на OVH1 + ML loss-detection |
| **Effort** | **350 man-days** |
| **One-time cost** | **20 млн ₽** |
| **Recurring** | **3 млн ₽/год** |
| **ROI mechanism** | (а) Молоко-потери в цепи СХП→БМК: 150-200 т/день × 35 ₽/кг × 365 × конс.−2% потерь = **40–50 млн ₽/год**; (б) cold-chain нарушения FMCG-блока: 1,3 млрд (Башк. Мор.) × −0,8% (conservative vs 1-2% ref) = **10 млн ₽/год**; (в) −10% пробега Милк Трейд+Нерал-Продукт |
| **Annual benefit** | **55–95 млн ₽/год** (mid 75) — confidence medium |
| **Payback** | 20M / (75M − 3M) ≈ **3 мес** при mid |
| Risk | Нужно согласие БМК (Savencia/Шаманов) — без них цепь рвётся; complex integration с 5+ entities |
| Dependencies | G1 (мастер-каталог SKU и партнёров); БМК sign-off |
| Priority | **P1-P2** (Phase 3) |
| Confidence | **medium** |

---

## Часть C — Per-entity specialist initiatives (EX1–EX4)

### EX1. Белебеевский молком — кризис-менеджмент + production AI

| Под-инициатива | Effort, MD | One-time | Recurring/год | Annual benefit | Payback | Priority | Confidence |
|---|---:|---:|---:|---:|---:|---|---|
| EX1a. AI Restructuring dashboard (cash, debt, OpEx by dept) | 40 | 1,8 млн | 0,3 млн | risk-reduction (priceless если работает) | n/a | **P0** | medium |
| EX1b. MES/SCADA-аналитика на сыр (35 SKU) | 250 | 11 млн | 1,8 млн | 50–80 млн (−2-3% потерь молока на переработке от 9,4 млрд себестоимости) | 5 мес | **P1** | medium |
| EX1c. AI quality control CV (расширение #8) | см. #8 | см. #8 | см. #8 | см. #8 | см. #8 | **P2** | medium |
| EX1d. AR collection + анти-fraud (на 10,5 млрд оборота) | 60 | 2,5 млн | 0,5 млн | 25–40 млн (−15% bad debt на ~250 млн просрочки) | 1,5 мес | **P0** | medium-high |

> **Recommendation:** запуск EX1a + EX1d (dashboard + AR) силами Шаманова + Бердиной — суммарно **4,3 млн ₽ capex / 0,8 млн ₽ recurring / 25-40 млн ₽/год**. EX1a без hardware capex может быть запущен за 6 недель. Если получится снять угрозу банкротства → дальше G1-G5.

### EX2. Уф. Гипсовая Компания — predictive maintenance + legal AI

| Под-инициатива | Effort, MD | One-time | Recurring/год | Annual benefit | Payback | Priority | Confidence |
|---|---:|---:|---:|---:|---:|---|---|
| EX2a. Predictive maintenance печей | 130 | 5 млн | 0,8 млн | 20–30 млн (−25% простоев печи) | 3 мес | **P1** | medium |
| EX2b. Energy optimization печей | 70 | 2,5 млн | 0,4 млн | 12–20 млн (−5% энергии) | 3 мес | **P1** | medium |
| EX2c. AI-юр. ассистент для 82 арбитражей | 25 | 0,7 млн | 0,2 млн | 4–7 млн (экономия юр. фирм) | 2,5 мес | **P0** | medium |

### EX3. Башкирское Мороженое — demand forecast + HoReCa

| Под-инициатива | Effort, MD | One-time | Recurring/год | Annual benefit | Payback | Priority | Confidence |
|---|---:|---:|---:|---:|---:|---|---|
| EX3a. ML-прогноз спроса по SKU/региону/каналу + weather features | 90 | 3,8 млн | 0,8 млн | 30–55 млн (−15% overstock + −8% OOS на 1,3 млрд выручке) | 2 мес | **P0** | medium-high |
| EX3b. HoReCa channel analytics | 35 | 1,3 млн | 0,3 млн | 6–12 млн | 2 мес | **P1** | medium |

### EX4. Нерал-Строй — CRM + AI lead-qual

| Под-инициатива | Effort, MD | One-time | Recurring/год | Annual benefit | Payback | Priority | Confidence |
|---|---:|---:|---:|---:|---:|---|---|
| EX4a. CRM + AI-чатбот для квалификации лидов | 30 | 1,1 млн | 0,4 млн | 4–8 млн (+25% conversion) | 2 мес | **P1** | low |
| EX4b. Сметная аналитика + контроль подрядчиков | 50 | 1,7 млн | 0,3 млн | 6–12 млн | 2 мес | **P1** | low |

> EX4 confidence низкий — нет direct benchmark в [[ai-benchmarks]] для девелопмента, нужен либо pilot scope (2 проекта) либо отдельный refresh бенчмарков под недвижку.

---

## Sorted backlog по `(Annual benefit / Effort)` ratio

Метрика: **₽ годового бенефита на 1 man-day усилий**. Чем выше — тем эффективнее.

| Rank | Initiative | Benefit/год (mid, млн ₽) | Effort (MD) | **₽/MD (тыс ₽)** | Payback (мес) | Confidence | Priority |
|---:|---|---:|---:|---:|---:|---|---|
| 1 | **#9 Погодные триггеры** | 7,5 | 15 | **500** | 0,5 | medium-high | **P0** |
| 2 | **#3 NDVI variable-rate** | 17,5 | 65 | **269** | 2 | medium | **P0** |
| 3 | **EX1d AR collection БМК** | 32 | 60 | **533** | 1,5 | medium-high | **P0** |
| 4 | **#2 Predictive maintenance техники** | 18,5 | 150 | **123** | 6 | high | **P0** |
| 5 | **EX3a Demand forecast Башк. Мор.** | 42 | 90 | **467** | 2 | medium-high | **P0** |
| 6 | **#10 Умные склады зерна** | 11 | 60 | **183** | 5 | medium | **P1** |
| 7 | **#1 TG exec-дашборд** | 8,5 | 85 | **100** | 5 | medium-high | **P0** |
| 8 | **EX2a Predictive maint. печей** | 25 | 130 | **192** | 3 | medium | **P1** |
| 9 | **EX1a Restructuring dashboard БМК** | risk-only | 40 | n/a | n/a | medium | **P0** (стратегический) |
| 10 | **EX2c AI legal assistant** | 5,5 | 25 | **220** | 2,5 | medium | **P0** |
| 11 | **#5 Logistics Башхолод** | 14,5 | 140 | **104** | 5 | medium | **P1** |
| 12 | **EX2b Energy печей** | 16 | 70 | **229** | 3 | medium | **P1** |
| 13 | **#7 RPA documents** | 4,2 | 75 | **56** | 9 | medium-high | **P1** |
| 14 | **#4 IoT КРС** | 13 | 120 | **108** | 7 | **low** ⚠️ | **P1** |
| 15 | **#6 ML-прогноз урожайности** | 6 | 55 | **109** | 3 | **low** ⚠️ | **P1** |
| 16 | **#8 CV переработка БМК** | 23,5 | 200 | **118** | 5 | medium | **P2** (Savencia gate) |
| 17 | **EX1b MES/SCADA БМК** | 65 | 250 | **260** | 5 | medium | **P1** (после EX1a) |
| 18 | **G1 Group ERP+MDM** | 150 | 600 | **250** | 3 | medium | **P1** (Phase 2) |
| 19 | **G2 Group Treasury** | 40 | 180 | **222** | 3 | medium-high | **P1** (Phase 2) |
| 20 | **G3 Group BI совет** | 75 | 120 | **625** | 2 | **low** ⚠️ | **P1** |
| 21 | **G5 Supply chain telemetry** | 75 | 350 | **214** | 3 | medium | **P2** (Phase 3) |
| 22 | **EX3b HoReCa analytics** | 9 | 35 | **257** | 2 | medium | **P1** |
| 23 | **EX4a CRM AI lead-qual** | 6 | 30 | **200** | 2 | **low** ⚠️ | **P1** |
| 24 | **EX4b Сметная аналитика** | 9 | 50 | **180** | 2 | **low** ⚠️ | **P1** |
| 25 | **G4 Unified HR** | 8 | 400 | **20** | 40 | medium | **P2** |

**Что отфильтровано:**
- **#8 CV переработка** — переведён в P2 (зависит от Savencia approval, organizational gate); если sign-off — переходит в Wave 2.
- **G4 Unified HR** — переведён в P2 как deferred (payback 40 мес — не подходит для underwriting в текущем горизонте); ревизит после M3.
- **#6 ML-прогноз урожайности** — оставлен в P1 но помечен `confidence: low` (soft benefit); рекомендуем пилот на одной СХП за 1,3 млн ₽ как proof.
- **#4 IoT КРС** — оставлен в P1 но помечен `confidence: low` (требует уточнения размера стада).
- **EX4a/b Нерал-Строй** — `confidence: low` (нет direct benchmark под девелопмент в [[ai-benchmarks]]); рекомендуем pilot scope.
- **G3 BI совет** — `confidence: low` (мягкие бенефиты); benefit будет реальный только если совет реально начнёт пользоваться, метрика — engagement-tracking.

---

## Recommended phasing (Wave-based)

### Phase 1 — Days 0–90 (Quick wins + foundation)

**Цель:** показать работающий продукт за 90 дней; получить green light на Phase 2.

| Initiative | Effort (MD) | One-time (млн ₽) | Annual benefit (млн ₽) |
|---|---:|---:|---:|
| #1 TG exec-дашборд MVP (Концерн + Агроцентр + 1 СХП) | 85 | 3,2 | 8,5 |
| #9 Погодные триггеры | 15 | 0,3 | 7,5 |
| EX1a БМК Restructuring dashboard (без hardware) | 40 | 1,8 | risk-prevention |
| EX1d БМК AR collection bot | 60 | 2,5 | 32 |
| **Phase 1 total** | **200 MD** | **7,8 млн ₽** | **~48 млн ₽/год run-rate** |

Phase 1 fits в **~3 разработчика × 3 мес = 195 MD** + 1 ML/data engineer + 1 интегратор 1С.

### Phase 2 — Days 90–180 (Core operational AI)

| Initiative | Effort (MD) | One-time (млн ₽) | Annual benefit (млн ₽) |
|---|---:|---:|---:|
| #3 NDVI variable-rate (1 СХП пилот → 3 СХП) | 65 | 1,8 | 17,5 |
| #2 Predictive maintenance техники (5-10 единиц pilot) | 150 | 8,5 | 18,5 |
| EX3a Demand forecast Башк. Мор. | 90 | 3,8 | 42 |
| #10 Умные склады зерна (3 силоса pilot) | 60 | 4,5 | 11 |
| EX2c Уф.Гипс. AI legal assistant | 25 | 0,7 | 5,5 |
| **Phase 2 total** | **390 MD** | **19,3 млн ₽** | **+94 млн ₽/год run-rate (cum 142 млн)** |

### Phase 3 — Days 180–365 (Strategic + group-level)

| Initiative | Effort (MD) | One-time (млн ₽) | Annual benefit (млн ₽) |
|---|---:|---:|---:|
| #7 RPA documents (расширение на всю группу) | 75 | 2,5 | 4,2 |
| EX2a Predictive maint. печей Уф. Гипс. | 130 | 5 | 25 |
| EX2b Energy optimization печей | 70 | 2,5 | 16 |
| #5 Logistics Башхолод | 140 | 5 | 14,5 |
| G1 Group ERP+MDM (start) | 200 (из 600) | 12 (из 30) | (partial) |
| G2 Group Treasury (start) | 90 (из 180) | 5 (из 9) | 20 (partial) |
| EX1b MES/SCADA БМК (if Шаманов go) | 250 | 11 | 65 |
| **Phase 3 total** | **~955 MD** | **~43 млн ₽** | **+145 млн ₽/год** |

### Gate criteria между phases

- **Gate 1→2 (Day 90):** дашборд live; weather triggers сгенерировали ≥3 actionable alerts; AR collection БМК показал DSO improvement ≥5 days на пилот-сегменте. Если ≥2 из 3 — go.
- **Gate 2→3 (Day 180):** ≥1 entity показывает измеримый ROI (любая из Phase 2 на 50%+ from underwritten). Если да — green light на G1+G2.
- **Gate 3 review (Day 365):** full program review; решение о следующем горизонте (M&A AI, экспансия в регионы, либо deepening current entities).

---

## Cumulative ROI summary

| Phase | One-time capex (млн ₽) | Run-rate annual benefit (mid, млн ₽) | Cumulative payback |
|---|---:|---:|---:|
| Phase 1 (Days 0–90) | 7,8 | 48 | ~2 мес |
| Phase 2 (Days 90–180) | 19,3 (cum 27,1) | +94 (cum 142) | ~3 мес cum |
| Phase 3 (Days 180–365) | 43 (cum 70) | +145 (cum 287) | ~4 мес cum |
| **Год 1 total** | **70 млн ₽** | **287 млн ₽/год run-rate к концу Y1** | **3 мес weighted avg** |

Для группы с консолидированной выручкой 2,33 млрд ₽ (без БМК) или 12,79 млрд ₽ (исторически с БМК):
- Capex 70 млн ₽ = **3% от Y1 выручки без БМК / 0,5% с БМК** — well within reasonable digital transformation envelope
- Run-rate бенефит 287 млн ₽/год = **12% от Y1 выручки без БМК / 2,2% с БМК** — это **удваивает группой чистую прибыль** (712 млн → ~1 000 млн)

---

## Assumptions требующие валидации с клиентом

1. **Размер стада КРС** (для #4): сейчас grossed 1 500 голов — может быть 800–2 000, что меняет ROI #4 в 1,5× range.
2. **Парк техники** для #2: предполагаем ~50 единиц совокупно по 3 СХП — нужна точная инвентаризация и доля CAN-bus совместимых.
3. **Объём хранения зерна** для #10: предположение 30 000 т — может быть 15 000–60 000.
4. **Площадь полей под variable-rate** для #3: предположение 7 000–10 000 га — нужна точная карта.
5. **Базовый уровень брака сыра на БМК** для #8 и EX1b: предположение 2% от себестоимости — нужна реальная цифра от Шаманова.
6. **Текущая дебиторка БМК** для EX1d: предположение ~250 млн просрочки — нужна сверка.
7. **Текущий transport spend FMCG-блока** для #5: предположение 100 млн ₽/год Башхолод — нужно подтвердить.
8. **Готовность Savencia** разрешить интеграцию в БМК для #8 и EX1b/c — критический organizational gate.

При расхождении actuals от assumptions на ±30% — пересмотр phasing требуется (особенно если #2/#4/#10 unhealthy).

---

## Risk register (расширенный)

| # | Риск | Влияние | Митигация |
|---|---|---|---|
| R1 | **Качество данных в 1С** — справочники не нормализованы | Все group-level initiatives ломаются | Phase 1 включает data audit как первую задачу |
| R2 | **Сопротивление полевого персонала** к телематике (#2) | ROI #2 −30% если водители выводят датчики из строя | Champion-агроном; не привязывать к KPI первые 6 мес; positive framing — "помощь" а не "контроль" |
| R3 | **Vendor lock-in** на LLM-провайдере (санкции/цены) | Recurring cost #1, EX1, G3 может вырасти 2-3× | Abstraction-слой между бизнес-логикой и LLM; on-prem Qwen2.5 как fallback |
| R4 | **Savencia блокирует** БМК-интеграции | #8 + EX1b/c + часть G5 заморожены | Pilot только non-production контур БМК (dashboard, AR); production CV/MES — only with sign-off |
| R5 | **Политика Исаев ↔ Шигаповы** на shared services | G1, G2, G3 могут затянуться 12+ мес | Sponsor через Узбекова (нейтральный CEO); transparency — никто не выглядит хуже другого |
| R6 | **Чишмы financial distress** — кр.обяз. 728 млн ₽, выручка -45% | Если Чишмы defaults — теряем pilot site для #2/#3/#4/#10 | Diversify pilots — Буздяк as primary, Матрикс as backup |
| R7 | **Банкротство БМК** ускоряется | Теряется 71% потенциала G1-G5 в первый год | EX1a-AR-restructuring как top priority; остальная программа продолжается на 5 entities группы |
| R8 | **ML hallucinations** на финансовых запросах #1 | Несколько wrong-answer кейсов могут уронить trust совета | SQL-агент с whitelisting; ответы со ссылкой на source row; LLM only для NL→SQL, не для генерации фактов |
| R9 | **Key-person risk: Исаев 70+** | Программа может застопориться при наследственной фазе | Документировать процессы; делать system usable for Узбекова и Шигаповых независимо |
| R10 | **Низкая confidence по 5 initiatives** (#4, #6, EX4a, EX4b, G3) | Может быть overestimation на 30-50% | Pilot scopes до commit полного бюджета; gate-reviews на M2/M3 |

---

## Связано

- [[financial-deep-dive]] — фактические финансовые анкоры (multi-year)
- [[subsidiaries-full-map]] — структура группы и owners
- [[ai-benchmarks]] — international references для ROI mechanism
- [[dashboard-concept]] — детали Initiative #1
- [[presentation.md]] — pitch deck для исполнительного совета (синхронизирован с v3 цифрами)
