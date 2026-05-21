/** Демо-цифры из Neral-Matrix-1pager / presentation (май 2026). */

export type HerdSegment = {
  id: string
  label: string
  count: number
  pct: number
  color: string
}

export const farmMeta = {
  siteCode: 'NERALMATRIX-11-930',
  afifarmVersion: 'AfiFarm 5.6.3 (демо)',
  barnCount: 17,
  updatedAt: '2026-05-21T06:42:00',
} as const

export const milkProduction = {
  lastSessionLiters: 8833,
  previousDayLiters: 33614,
  dailyLiters: 33600,
  cowsMilkedLastSession: 982,
  avgPerCowLiters: 33.6,
  fatPct: 3.63,
  proteinPct: 3.38,
} as const

export const herdInventory: HerdSegment[] = [
  { id: 'total', label: 'Всего коров', count: 1152, pct: 100, color: '#64748b' },
  { id: 'milking', label: 'Дойные в производстве', count: 1000, pct: 86.8, color: '#2563eb' },
  { id: 'pregnant', label: 'Стельные / дойные', count: 558, pct: 48.4, color: '#7c3aed' },
  { id: 'open', label: 'Нестельные', count: 444, pct: 38.5, color: '#ca8a04' },
  { id: 'dry', label: 'Сухостой', count: 150, pct: 13.0, color: '#0d9488' },
]

export const healthAlerts = [
  { id: 'mastitis', label: 'Мастит (подозрение)', count: 18, severity: 'high' as const },
  { id: 'digest', label: 'Проблемы пищеварения', count: 7, severity: 'medium' as const },
  { id: 'ketosis', label: 'Кетоз', count: 6, severity: 'high' as const },
  { id: 'fresh', label: 'Новотельные — осмотр', count: 15, severity: 'medium' as const },
  { id: 'check', label: 'Подозрительные на проверку', count: 15, severity: 'low' as const },
  { id: 'report', label: 'Отчёт контроля здоровья', count: 26, severity: 'low' as const },
]

export const reproduction = [
  { label: 'На осеменение', count: 3 },
  { label: 'Подозрение на аборт', count: 2 },
  { label: 'Аноэструс', count: 18 },
]

export const groups = [
  { label: 'Комфорт группы', count: 2 },
  { label: 'Алерты по кормлению', count: 4 },
]

export const todayTasks = [
  { label: 'Ожидаемый запуск в сухостой', count: 41 },
  { label: 'Ожидаемый отёл', count: 12 },
  { label: 'Сортировка животных', count: 8 },
  { label: 'Проверка стельности (рекоменд.)', count: 3 },
]

export const malfunctions = [
  { label: 'Метки не прикреплены', count: 9 },
  { label: 'Не идентифицированы в дойке', count: 188, highlight: true },
  { label: 'Неверная группа', count: 2 },
  { label: 'Неисправные метки', count: 37, highlight: true },
]

export const feedingKpi = {
  recipeName: 'дойные разд. 5,7,10,8',
  totalWeightKg: 63.21,
  dryMatterKg: 29.29,
  costPerCowRub: 341.31,
  revision: '96.0',
  revisionDate: '07.05.2026',
  currentMix: 'Замес № 14 · Силокинг',
  nextMix: 'Замес № 15 через ~18 мин',
  mixingSec: 0,
} as const

export const vetTasks = [
  {
    id: 't1',
    barn: 'Коровник 5',
    cow: '2964',
    issue: 'Мастит (ранний сигнал 78%)',
    priority: 'high' as const,
    status: 'open' as const,
  },
  {
    id: 't2',
    barn: 'Коровник 5',
    cow: '231112',
    issue: 'Кетоз (65%)',
    priority: 'high' as const,
    status: 'open' as const,
  },
  {
    id: 't3',
    barn: 'Коровник 7',
    cow: '240146',
    issue: 'Тренд хромоты',
    priority: 'medium' as const,
    status: 'in_progress' as const,
  },
  {
    id: 't4',
    barn: 'Коровник 3',
    cow: '18902',
    issue: 'Новотельная — осмотр',
    priority: 'medium' as const,
    status: 'done' as const,
  },
]

export const machines = [
  { name: 'Силокинг', status: 'На маршруте · кормление', lat: 54.12, lng: 55.98 },
  { name: 'Погрузчик FEL-2', status: 'Стоит · кормоцех', lat: 54.11, lng: 55.97 },
  { name: 'Трактор МТЗ-82', status: 'В движении · поле №4', lat: 54.14, lng: 56.01 },
]

export const feedingIngredients = [
  { code: '101', name: 'Кукуруза дробл.', kg: 12.5, dmPct: 88, dmKg: 11.0, cost: 42.1 },
  { code: '102', name: 'Ячмень дробл.', kg: 8.2, dmPct: 87, dmKg: 7.1, cost: 28.4 },
  { code: '201', name: 'Силос кукурузный', kg: 22.0, dmPct: 32, dmKg: 7.0, cost: 18.2 },
  { code: '301', name: 'Соя экструд.', kg: 4.1, dmPct: 90, dmKg: 3.7, cost: 55.0 },
  { code: 'W01', name: 'Вода', kg: 16.4, dmPct: 0, dmKg: 0, cost: 0 },
]
