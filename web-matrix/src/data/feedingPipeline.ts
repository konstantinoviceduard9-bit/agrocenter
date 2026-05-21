/**
 * Демо-поток «корм → DTM → Afimilk» по материалам фермы:
 * - Агроплем (NIR, сенаж люцерны 3 яма)
 * - AMTS / Кoudijs (выводы рациона «раздой»)
 * - Рецепт DTM (дойные разд. 5,7,10,8)
 */

export type PipelineStepId =
  | 'lab'
  | 'amts'
  | 'draft'
  | 'review'
  | 'dtm'
  | 'afimilk'

export type PipelineStatus =
  | 'pending_review'
  | 'confirmed'
  | 'rejected'
  | 'synced_dtm'
  | 'synced_afimilk'

export type LabIndicator = {
  name: string
  unit: string
  result: string
  min: string
  max: string
  inRange: boolean
}

export type AmtsIngredient = {
  name: string
  dmPct: number
  dmKgDay: number
  asFedKgDay: number
}

export type DtmIngredientRow = {
  code: string
  name: string
  kgPerCow: number
  dmPct: number
  dmKg: number
  costRub: number
  /** Текущее значение в DTM до автозагрузки */
  dtmCurrentKg: number
  /** Предложение из AMTS/лаборатории */
  proposedKg: number
  source: 'amts' | 'lab' | 'unchanged'
  flag: 'ok' | 'changed' | 'warn' | 'new'
}

export type FeedingBatch = {
  id: string
  recipeName: string
  feedGroup: string
  amtsGroup: string
  labSample: string
  labDate: string
  amtsDate: string
  revision: string
  revisionDate: string
  totalWeightKg: number
  dryMatterKg: number
  costPerCowRub: number
  milkTargetKg: number
  dim: number
}

const STORAGE_KEY = 'matrix-feeding-pipeline-v1'

export const demoBatch: FeedingBatch = {
  id: 'batch-razdoy-2026-05-07',
  recipeName: 'дойные разд. 5,7,10,8',
  feedGroup: 'Дойные Н · кормогруппа DTM',
  amtsGroup: 'раздой · МК Урал матрикс',
  labSample: 'Пакет №1 · сенаж люцерны · яма 3 · укос 17.07.2025',
  labDate: '04.02.2026',
  amtsDate: 'с 06.05.2026',
  revision: '96.0',
  revisionDate: '07.05.2026',
  totalWeightKg: 63.21,
  dryMatterKg: 29.29,
  costPerCowRub: 341.31,
  milkTargetKg: 45,
  dim: 120,
}

/** Агроплем — ключевые показатели (демо по бланку) */
export const labIndicators: LabIndicator[] = [
  { name: 'Сухое вещество', unit: '%', result: '39', min: '30', max: '50', inRange: true },
  { name: 'Сырой протеин', unit: 'г/кг СВ', result: '179', min: '170', max: '230', inRange: true },
  { name: 'Растворимый протеин', unit: 'г/кг СВ', result: '145', min: '59', max: '150', inRange: true },
  { name: 'Сырой жир', unit: 'г/кг СВ', result: '27', min: '20', max: '41', inRange: true },
  { name: 'Крахмал', unit: 'г/кг СВ', result: '< 0,1', min: '4', max: '81', inRange: false },
  { name: 'НДКорг', unit: 'г/кг СВ', result: '422', min: '350', max: '490', inRange: true },
  { name: 'Кислотность', unit: 'pH', result: '4,8', min: '4,0', max: '5,5', inRange: true },
]

/** AMTS — фрагмент рациона «скормлен» (кг СВ / кг как скормлено) */
export const amtsIngredients: AmtsIngredient[] = [
  { name: 'Силос кукурузный 14 ма', dmPct: 32, dmKgDay: 8.2, asFedKgDay: 25.6 },
  { name: 'Сенаж люцерны 3 яма', dmPct: 39, dmKgDay: 4.1, asFedKgDay: 10.5 },
  { name: 'Зерно кукурузы', dmPct: 88, dmKgDay: 3.2, asFedKgDay: 3.6 },
  { name: 'Ячмень зерно', dmPct: 87, dmKgDay: 2.8, asFedKgDay: 3.2 },
  { name: 'Шрот подсолнечный', dmPct: 90, dmKgDay: 1.4, asFedKgDay: 1.6 },
  { name: 'Премикс дойный', dmPct: 95, dmKgDay: 0.35, asFedKgDay: 0.37 },
]

/** Сопоставление AMTS → коды DTM с расхождениями для проверки */
export const dtmProposal: DtmIngredientRow[] = [
  {
    code: '201',
    name: 'Силос кукурузный',
    kgPerCow: 25.6,
    dmPct: 32,
    dmKg: 8.2,
    costRub: 18.2,
    dtmCurrentKg: 22.0,
    proposedKg: 25.6,
    source: 'amts',
    flag: 'changed',
  },
  {
    code: '202',
    name: 'Сенаж люцерны (ямка 3)',
    kgPerCow: 10.5,
    dmPct: 39,
    dmKg: 4.1,
    costRub: 9.5,
    dtmCurrentKg: 0,
    proposedKg: 10.5,
    source: 'lab',
    flag: 'new',
  },
  {
    code: '101',
    name: 'Кукуруза дробл.',
    kgPerCow: 3.6,
    dmPct: 88,
    dmKg: 3.2,
    costRub: 42.1,
    dtmCurrentKg: 12.5,
    proposedKg: 3.6,
    source: 'amts',
    flag: 'warn',
  },
  {
    code: '102',
    name: 'Ячмень дробл.',
    kgPerCow: 3.2,
    dmPct: 87,
    dmKg: 2.8,
    costRub: 28.4,
    dtmCurrentKg: 8.2,
    proposedKg: 3.2,
    source: 'amts',
    flag: 'changed',
  },
  {
    code: '301',
    name: 'Соя экструд.',
    kgPerCow: 1.6,
    dmPct: 90,
    dmKg: 1.4,
    costRub: 55.0,
    dtmCurrentKg: 4.1,
    proposedKg: 1.6,
    source: 'amts',
    flag: 'changed',
  },
  {
    code: 'W01',
    name: 'Вода',
    kgPerCow: 16.4,
    dmPct: 0,
    dmKg: 0,
    costRub: 0,
    dtmCurrentKg: 16.4,
    proposedKg: 16.4,
    source: 'unchanged',
    flag: 'ok',
  },
]

export type PipelineState = {
  status: PipelineStatus
  confirmedAt: string | null
  confirmedBy: string | null
  dtmSyncedAt: string | null
  afimilkSyncedAt: string | null
  note: string
}

const defaultState: PipelineState = {
  status: 'pending_review',
  confirmedAt: null,
  confirmedBy: null,
  dtmSyncedAt: null,
  afimilkSyncedAt: null,
  note: '',
}

export function loadPipelineState(batchId: string): PipelineState {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}-${batchId}`)
    if (!raw) return { ...defaultState }
    return { ...defaultState, ...(JSON.parse(raw) as PipelineState) }
  } catch {
    return { ...defaultState }
  }
}

export function savePipelineState(batchId: string, state: PipelineState) {
  localStorage.setItem(`${STORAGE_KEY}-${batchId}`, JSON.stringify(state))
}

export const pipelineSteps: { id: PipelineStepId; label: string }[] = [
  { id: 'lab', label: 'Агроплем' },
  { id: 'amts', label: 'AMTS' },
  { id: 'draft', label: 'Черновик DTM' },
  { id: 'review', label: 'Проверка' },
  { id: 'dtm', label: 'DTM' },
  { id: 'afimilk', label: 'Afimilk' },
]

export function stepIndex(status: PipelineStatus): number {
  switch (status) {
    case 'pending_review':
      return 3
    case 'confirmed':
      return 4
    case 'synced_dtm':
      return 5
    case 'synced_afimilk':
      return 6
    case 'rejected':
      return 3
    default:
      return 3
  }
}
