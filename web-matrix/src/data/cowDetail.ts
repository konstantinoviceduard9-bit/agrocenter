import { getCategoryById, getCowsForCategory, type CowRecord } from './cowLists'

function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h || 1
}

export type TreatmentRecord = {
  date: string
  drug: string
  dose: string
  route: string
  vet: string
  reason: string
}

export type MilkDayPoint = {
  date: string
  liters: number
  fatPct: number
  proteinPct: number
  conductivity: number
}

export type CowDetail = {
  summary: CowRecord
  categoryLabel: string
  earTag: string
  rfidOk: boolean
  birthDate: string
  breed: string
  sire: string
  dam: string
  calvingDate: string
  calvingEase: string
  calfSex: string
  calfWeightKg: number
  colostrumLiters: number
  pregnancyStatus: string
  daysOpen: number
  lastInsemination: string
  inseminationBull: string
  expectedCalving: string | null
  yieldTodayLiters: number
  yield7dAvgLiters: number
  yield305dLiters: number
  fatPct: number
  proteinPct: number
  somaticCells: number
  conductivity: number
  activityIndex: number
  lyingPct: number
  ruminationMin: number
  stepsPerHour: number
  feedGroup: string
  rationName: string
  dmiKg: number
  refusalsKg: number
  lastMilking: string
  milkingsToday: number
  healthStatus: string
  activeAlerts: string[]
  treatments: TreatmentRecord[]
  milkHistory: MilkDayPoint[]
  systemNotes: string[]
}

const DRUGS = [
  { drug: 'Синулокс LC', dose: '10 мл', route: 'в/м' },
  { drug: 'Мастимаст', dose: '12 г', route: 'интрамаммарно' },
  { drug: 'Кетофен', dose: '15 мл', route: 'в/м' },
  { drug: 'Пропиленгликоль 30%', dose: '500 мл', route: 'per os' },
  { drug: 'Окситоцин', dose: '5 мл', route: 'в/м' },
  { drug: 'Пенстреп', dose: '6 мл', route: 'в/м' },
]

const VETS = ['Мухаметшин Р.А.', 'Ибрагимов Т.В.', 'Сафин А.Р.']

function padDate(d: Date): string {
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function cowDetailPath(categoryId: string, cowNumber: string): string {
  return `/animals/${categoryId}/cow/${cowNumber}`
}

export function findCowInCategory(categoryId: string, cowNumber: string): CowRecord | undefined {
  return getCowsForCategory(categoryId).find((c) => c.number === cowNumber)
}

export function buildCowDetail(categoryId: string, cowNumber: string): CowDetail | null {
  const category = getCategoryById(categoryId)
  const summary = findCowInCategory(categoryId, cowNumber)
  if (!category || !summary) return null

  const seed = hash(`${categoryId}:${cowNumber}`)
  const dim = summary.daysInMilk ?? 0
  const today = new Date()

  const calving = new Date(today)
  calving.setDate(calving.getDate() - dim)

  const birth = new Date(calving)
  birth.setFullYear(birth.getFullYear() - (2 + (seed % 4)))

  const treatments: TreatmentRecord[] = Array.from({ length: 3 + (seed % 4) }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (i * 4 + (seed % 3)))
    const pick = DRUGS[(seed + i) % DRUGS.length]!
    return {
      date: padDate(d),
      drug: pick.drug,
      dose: pick.dose,
      route: pick.route,
      vet: VETS[(seed + i) % VETS.length]!,
      reason: i === 0 ? category.label : 'Профилактика / контроль',
    }
  })

  const milkHistory: MilkDayPoint[] = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (13 - i))
    const base = summary.yieldLiters ?? 32
    const drift = ((seed + i * 7) % 10) - 5
    return {
      date: padDate(d),
      liters: Math.round((base + drift / 2) * 10) / 10,
      fatPct: 3.5 + ((seed + i) % 5) / 20,
      proteinPct: 3.2 + ((seed + i) % 4) / 25,
      conductivity: 5.2 + ((seed + i * 3) % 8) / 10,
    }
  })

  const yieldToday = summary.yieldLiters ?? milkHistory[milkHistory.length - 1]!.liters

  return {
    summary,
    categoryLabel: category.label,
    earTag: `RU-${cowNumber}`,
    rfidOk: (seed % 9) !== 0,
    birthDate: padDate(birth),
    breed: 'Голштинская',
    sire: `US-HOL-${1000 + (seed % 900)}`,
    dam: `${420000 + (seed % 50000)}`,
    calvingDate: padDate(calving),
    calvingEase: ['1 — лёгкий', '2 — без осложнений', '3 — умеренный'][seed % 3]!,
    calfSex: seed % 2 === 0 ? 'Тёлка' : 'Бык',
    calfWeightKg: 38 + (seed % 9),
    colostrumLiters: 4 + (seed % 3),
    pregnancyStatus: dim < 60 ? 'Новотельная' : seed % 3 === 0 ? 'Стельная' : 'Открытая',
    daysOpen: dim < 45 ? 0 : 40 + (seed % 120),
    lastInsemination: (() => {
      const d = new Date(today)
      d.setDate(d.getDate() - (20 + (seed % 40)))
      return padDate(d)
    })(),
    inseminationBull: `HOL-${200 + (seed % 80)}`,
    expectedCalving: seed % 3 === 0 ? padDate(new Date(Date.now() + (240 + seed % 60) * 86400000)) : null,
    yieldTodayLiters: yieldToday,
    yield7dAvgLiters: Math.round((milkHistory.slice(-7).reduce((s, p) => s + p.liters, 0) / 7) * 10) / 10,
    yield305dLiters: Math.round(yieldToday * 305 * 0.92),
    fatPct: milkHistory[milkHistory.length - 1]!.fatPct,
    proteinPct: milkHistory[milkHistory.length - 1]!.proteinPct,
    somaticCells: 120 + (seed % 280),
    conductivity: milkHistory[milkHistory.length - 1]!.conductivity,
    activityIndex: 85 + (seed % 30),
    lyingPct: 48 + (seed % 12),
    ruminationMin: 420 + (seed % 90),
    stepsPerHour: 55 + (seed % 40),
    feedGroup: summary.group,
    rationName: 'дойные разд. 5,7,10,8',
    dmiKg: 22 + (seed % 6),
    refusalsKg: Math.round((1 + (seed % 5)) * 10) / 10,
    lastMilking: `Сегодня ${6 + (seed % 3)}:${String(10 + (seed % 40)).padStart(2, '0')}`,
    milkingsToday: 3,
    healthStatus: category.section === 'health' ? 'Под наблюдением' : 'В стаде',
    activeAlerts: [category.label, ...(seed % 2 === 0 ? ['Снижение активности за 48 ч'] : [])],
    treatments,
    milkHistory,
    systemNotes: [
      `Запись Afimilk · лактация ${summary.lactation}`,
      `Группа кормления DTM: ${summary.group}`,
      seed % 4 === 0 ? 'Рекомендована проверка копыт в течение 7 дней' : 'Контрольный осмотр по графику',
    ],
  }
}
