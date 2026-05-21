/** Демо-данные дойки: 3 дойки за день, списки, жир/белок. */

import { milkProduction } from './matrixMocks'

export type MilkingSession = {
  id: number
  label: string
  time: string
  liters: number
  cowsMilked: number
  avgPerCow: number
  isCurrent: boolean
}

/** Три дойки за сегодня; последняя = «текущая смена» из сводки */
export const todayMilkingSessions: MilkingSession[] = [
  {
    id: 1,
    label: 'Дойка 1',
    time: '04:30 – 07:15',
    liters: 2654,
    cowsMilked: 318,
    avgPerCow: 8.3,
    isCurrent: false,
  },
  {
    id: 2,
    label: 'Дойка 2',
    time: '12:05 – 14:50',
    liters: 2886,
    cowsMilked: 328,
    avgPerCow: 8.8,
    isCurrent: false,
  },
  {
    id: 3,
    label: 'Дойка 3',
    time: '19:35 – 22:05',
    liters: milkProduction.lastSessionLiters,
    cowsMilked: milkProduction.cowsMilkedLastSession,
    avgPerCow: Math.round((milkProduction.lastSessionLiters / milkProduction.cowsMilkedLastSession) * 10) / 10,
    isCurrent: true,
  },
]

export const todayMilkingTotalLiters = todayMilkingSessions.reduce((s, m) => s + m.liters, 0)

export type FatProteinSession = {
  session: string
  liters: number
  fatPct: number
  proteinPct: number
  fatKg: number
  proteinKg: number
}

export const fatProteinBySession: FatProteinSession[] = todayMilkingSessions.map((s) => {
  const fatPct = s.id === 3 ? milkProduction.fatPct : 3.55 + s.id * 0.02
  const proteinPct = s.id === 3 ? milkProduction.proteinPct : 3.32 + s.id * 0.02
  const fatKg = Math.round(s.liters * (fatPct / 100) * 10) / 10
  const proteinKg = Math.round(s.liters * (proteinPct / 100) * 10) / 10
  return {
    session: s.label,
    liters: s.liters,
    fatPct,
    proteinPct,
    fatKg,
    proteinKg,
  }
})

export type FatProteinDay = {
  date: string
  dayLabel: string
  liters: number
  fatPct: number
  proteinPct: number
  fatKg: number
  proteinKg: number
}

export const fatProteinByDay: FatProteinDay[] = [
  { date: '2026-05-15', dayLabel: '15 мая', liters: 33120, fatPct: 3.61, proteinPct: 3.36, fatKg: 1196, proteinKg: 1113 },
  { date: '2026-05-16', dayLabel: '16 мая', liters: 33480, fatPct: 3.59, proteinPct: 3.37, fatKg: 1202, proteinKg: 1128 },
  { date: '2026-05-17', dayLabel: '17 мая', liters: 32950, fatPct: 3.64, proteinPct: 3.35, fatKg: 1199, proteinKg: 1104 },
  { date: '2026-05-18', dayLabel: '18 мая', liters: 33600, fatPct: 3.62, proteinPct: 3.39, fatKg: 1216, proteinKg: 1139 },
  { date: '2026-05-19', dayLabel: '19 мая', liters: 33210, fatPct: 3.6, proteinPct: 3.38, fatKg: 1196, proteinKg: 1122 },
  { date: '2026-05-20', dayLabel: '20 мая', liters: 33540, fatPct: 3.63, proteinPct: 3.37, fatKg: 1217, proteinKg: 1130 },
  {
    date: '2026-05-21',
    dayLabel: 'Сегодня',
    liters: todayMilkingTotalLiters,
    fatPct: milkProduction.fatPct,
    proteinPct: milkProduction.proteinPct,
    fatKg: Math.round(todayMilkingTotalLiters * (milkProduction.fatPct / 100)),
    proteinKg: Math.round(todayMilkingTotalLiters * (milkProduction.proteinPct / 100)),
  },
]

export type YieldByBarn = { barn: string; avgLiters: number; cows: number }

export const avgYieldByBarn: YieldByBarn[] = [
  { barn: 'Коровник 3', avgLiters: 35.2, cows: 68 },
  { barn: 'Коровник 7', avgLiters: 34.8, cows: 72 },
  { barn: 'Коровник 1', avgLiters: 34.1, cows: 65 },
  { barn: 'Коровник 11', avgLiters: 33.9, cows: 58 },
  { barn: 'Коровник 5', avgLiters: 32.4, cows: 61 },
  { barn: 'Коровник 14', avgLiters: 31.2, cows: 55 },
]

export type YieldBucket = { range: string; count: number }

export const yieldDistribution: YieldBucket[] = [
  { range: '< 25 л', count: 42 },
  { range: '25–30 л', count: 186 },
  { range: '30–35 л', count: 412 },
  { range: '35–40 л', count: 268 },
  { range: '> 40 л', count: 74 },
]

export const yieldTargetLiters = 34

export const MILKING_SHIFT_COWS_CATEGORY = 'milking-shift-cows'
