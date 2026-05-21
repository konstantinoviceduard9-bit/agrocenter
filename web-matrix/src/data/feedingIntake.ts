/**
 * Два канала загрузки: цифровые файлы и фото с планшета (демо-OCR).
 * В продакшене фото уходит на сервер OCR; здесь — шаблон по типу бланка.
 */

import {
  amtsIngredients,
  dtmProposal,
  labIndicators,
  type AmtsIngredient,
  type DtmIngredientRow,
  type LabIndicator,
} from './feedingPipeline'

export type IntakeMode = 'digital' | 'photo'

export type PhotoDocType = 'agroplem' | 'amts'

export type ExtractedLabRow = LabIndicator & { confidence: number }

export type ExtractedAmtsRow = AmtsIngredient & { confidence: number }

export type PhotoIntakeRecord = {
  id: string
  docType: PhotoDocType
  fileName: string
  capturedAt: string
  appliedAt: string | null
  rowsLab: ExtractedLabRow[]
  rowsAmts: ExtractedAmtsRow[]
}

const PHOTO_STORAGE = 'matrix-feeding-photo-intake-v1'

/** Демо-результат «распознавания» Агроплем (по бланку с фото) */
export function demoOcrAgroplem(): ExtractedLabRow[] {
  return labIndicators.map((r) => ({
    ...r,
    confidence: r.inRange ? 0.92 + Math.random() * 0.06 : 0.78 + Math.random() * 0.1,
  }))
}

/** Демо-результат «распознавания» AMTS */
export function demoOcrAmts(): ExtractedAmtsRow[] {
  return amtsIngredients.map((r) => ({
    ...r,
    confidence: 0.85 + Math.random() * 0.12,
  }))
}

export function simulateOcrDelay(ms = 1800): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Парсер простого CSV Агроплем: Показатель;Единица;Результат;Мин;Макс */
export function parseAgroplemCsv(text: string): ExtractedLabRow[] | null {
  const lines = text
    .trim()
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
  if (lines.length < 2) return null
  const sep = lines[0].includes(';') ? ';' : ','
  const rows: ExtractedLabRow[] = []
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(sep).map((p) => p.trim())
    if (parts.length < 5) continue
    const [name, unit, result, min, max] = parts
    const num = parseFloat(result.replace(',', '.').replace(/[^\d.]/g, ''))
    const minN = parseFloat(min.replace(',', '.'))
    const maxN = parseFloat(max.replace(',', '.'))
    const inRange = !Number.isNaN(num) && !Number.isNaN(minN) && !Number.isNaN(maxN) && num >= minN && num <= maxN
    rows.push({ name, unit, result, min, max, inRange, confidence: 0.99 })
  }
  return rows.length ? rows : null
}

/** Парсер CSV AMTS: Ингредиент;%СВ;СВ кг;КС кг */
export function parseAmtsCsv(text: string): ExtractedAmtsRow[] | null {
  const lines = text
    .trim()
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
  if (lines.length < 2) return null
  const sep = lines[0].includes(';') ? ';' : ','
  const rows: ExtractedAmtsRow[] = []
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(sep).map((p) => p.trim())
    if (parts.length < 4) continue
    const [name, dmPct, dmKg, asFed] = parts
    rows.push({
      name,
      dmPct: parseFloat(dmPct.replace(',', '.')) || 0,
      dmKgDay: parseFloat(dmKg.replace(',', '.')) || 0,
      asFedKgDay: parseFloat(asFed.replace(',', '.')) || 0,
      confidence: 0.99,
    })
  }
  return rows.length ? rows : null
}

const amtsToDtmCode: Record<string, { code: string; name: string; costRub: number }> = {
  'Силос кукурузный 14 ма': { code: '201', name: 'Силос кукурузный', costRub: 18.2 },
  'Сенаж люцерны 3 яма': { code: '202', name: 'Сенаж люцерны (ямка 3)', costRub: 9.5 },
  'Зерно кукурузы': { code: '101', name: 'Кукуруза дробл.', costRub: 42.1 },
  'Ячмень зерно': { code: '102', name: 'Ячмень дробл.', costRub: 28.4 },
  'Шрот подсолнечный': { code: '301', name: 'Соя экструд.', costRub: 55.0 },
}

/** Пересборка черновика DTM из AMTS + %СВ из лаборатории для сенажа */
export function rebuildDtmProposal(amts: AmtsIngredient[], lab: LabIndicator[]): DtmIngredientRow[] {
  const haylageDm = lab.find((r) => r.name.includes('Сухое вещество'))
  const haylagePct = haylageDm ? parseFloat(haylageDm.result.replace(',', '.')) || 39 : 39

  const fromAmts: DtmIngredientRow[] = amts.map((a) => {
    const map = amtsToDtmCode[a.name]
    const dmPct = a.name.includes('Сенаж') ? haylagePct : a.dmPct
    const existing = dtmProposal.find((d) => d.code === map?.code)
    const dtmCurrentKg = existing?.dtmCurrentKg ?? 0
    const proposedKg = a.asFedKgDay
    const dmKg = a.dmKgDay
    let flag: DtmIngredientRow['flag'] = 'changed'
    if (!existing) flag = 'new'
    else if (Math.abs(proposedKg - dtmCurrentKg) < 0.05) flag = 'ok'
    else if (existing.flag === 'warn') flag = 'warn'
    return {
      code: map?.code ?? `X${a.name.slice(0, 3)}`,
      name: map?.name ?? a.name,
      kgPerCow: proposedKg,
      dmPct,
      dmKg,
      costRub: map?.costRub ?? 0,
      dtmCurrentKg,
      proposedKg,
      source: a.name.includes('Сенаж') ? 'lab' : 'amts',
      flag,
    } as DtmIngredientRow
  })

  const water = dtmProposal.find((r) => r.code === 'W01')
  if (water) fromAmts.push({ ...water, proposedKg: water.dtmCurrentKg, flag: 'ok' })
  return fromAmts
}

export function loadLastPhotoIntake(): PhotoIntakeRecord | null {
  try {
    const raw = localStorage.getItem(PHOTO_STORAGE)
    if (!raw) return null
    return JSON.parse(raw) as PhotoIntakeRecord
  } catch {
    return null
  }
}

export function savePhotoIntake(record: PhotoIntakeRecord) {
  localStorage.setItem(PHOTO_STORAGE, JSON.stringify(record))
}

export const agroplemCsvTemplate = `Показатель;Единица;Результат;Мин;Макс
Сухое вещество;%;39;30;50
Сырой протеин;г/кг СВ;179;170;230
Крахмал;г/кг СВ;< 0,1;4;81
НДКорг;г/кг СВ;422;350;490`

export const amtsCsvTemplate = `Ингредиент;%СВ;СВ кг;КС кг
Силос кукурузный 14 ма;32;8.2;25.6
Сенаж люцерны 3 яма;39;4.1;10.5
Зерно кукурузы;88;3.2;3.6
Ячмень зерно;87;2.8;3.2`
