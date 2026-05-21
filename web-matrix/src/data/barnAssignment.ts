/**
 * Разделение по коровникам — демо по бланку AfiFarm «Телята · группа 701»
 * и ручным пометкам T-30 / T-35 / T-38 (сдал / принял).
 */

export type BarnTarget = {
  code: string
  label: string
  capacity?: number
}

export const barnTargets: BarnTarget[] = [
  { code: 'T-30', label: 'Телячник T-30', capacity: 120 },
  { code: 'T-35', label: 'Телячник T-35', capacity: 95 },
  { code: 'T-38', label: 'Телячник T-38', capacity: 110 },
  { code: 'K-12', label: 'Коровник 12 (молодняк)', capacity: 80 },
  { code: 'K-14', label: 'Коровник 14 (больничная)', capacity: 40 },
]

export type RoutingGroup = {
  id: string
  label: string
  afifarmGroup: string
  reportTitle: string
  reportDate: string
  reportTime: string
}

export const routingGroups: RoutingGroup[] = [
  {
    id: 'calves-701',
    label: 'Телята · группа 701',
    afifarmGroup: '701',
    reportTitle: 'Отчёт по телятам',
    reportDate: '17.05.2026',
    reportTime: '17:03',
  },
  {
    id: 'fresh-move',
    label: 'Новотельные · перевод',
    afifarmGroup: 'новотельные',
    reportTitle: 'Перевод после отёла',
    reportDate: '21.05.2026',
    reportTime: '08:15',
  },
]

export type AnimalToRoute = {
  id: string
  index: number
  number: string
  sex: 'Бычок' | 'Тёлочка'
  birthDate: string
  ageDays: number
  sire: string
  dam: string
  weightKg: number
  proteinControl?: string
  /** Откуда сейчас (дойный зал / родильное) */
  fromLocation: string
  /** Подсказка с прошлого раза (демо) */
  suggestedBarn?: string
}

/** Строки с бланка 17.05.2026 + ручные № из пометок */
export const animalsCalves701: AnimalToRoute[] = [
  { id: 'c1', index: 1, number: '26111', sex: 'Бычок', birthDate: '17.05.2026', ageDays: 0, sire: 'ДРОУ-М', dam: '258901', weightKg: 41, fromLocation: 'Родильное', suggestedBarn: 'T-30' },
  { id: 'c2', index: 2, number: '260523', sex: 'Тёлочка', birthDate: '16.05.2026', ageDays: 1, sire: 'БАНЗАЙ', dam: '240512', weightKg: 38, fromLocation: 'Родильное', suggestedBarn: 'T-30' },
  { id: 'c3', index: 3, number: '260418', sex: 'Бычок', birthDate: '15.05.2026', ageDays: 2, sire: 'DICTATOR', dam: '239881', weightKg: 42, proteinControl: '6,2', fromLocation: 'Родильное' },
  { id: 'c4', index: 4, number: '260307', sex: 'Тёлочка', birthDate: '14.05.2026', ageDays: 3, sire: 'RAMSEY', dam: '238102', weightKg: 39, fromLocation: 'Родильное', suggestedBarn: 'T-35' },
  { id: 'c5', index: 5, number: '260198', sex: 'Тёлочка', birthDate: '13.05.2026', ageDays: 4, sire: 'ДРОУ-М', dam: '237455', weightKg: 37, fromLocation: 'Родильное' },
  { id: 'c6', index: 6, number: '259876', sex: 'Бычок', birthDate: '12.05.2026', ageDays: 5, sire: 'БАНЗАЙ', dam: '236901', weightKg: 45, fromLocation: 'Родильное', suggestedBarn: 'T-38' },
  { id: 'c7', index: 7, number: '259801', sex: 'Тёлочка', birthDate: '12.05.2026', ageDays: 5, sire: 'DICTATOR', dam: '235622', weightKg: 36, fromLocation: 'Родильное' },
  { id: 'c8', index: 8, number: '259702', sex: 'Бычок', birthDate: '12.05.2026', ageDays: 5, sire: 'RAMSEY', dam: '234118', weightKg: 40, fromLocation: 'Родильное' },
  { id: 'c9', index: 9, number: '259601', sex: 'Тёлочка', birthDate: '12.05.2026', ageDays: 5, sire: 'ДРОУ-М', dam: '233009', weightKg: 33, fromLocation: 'Родильное' },
  { id: 'c10', index: 10, number: '2589', sex: 'Тёлочка', birthDate: '11.05.2026', ageDays: 6, sire: 'БАНЗАЙ', dam: '231200', weightKg: 38, fromLocation: 'T-30 (временно)', suggestedBarn: 'T-35' },
  { id: 'c11', index: 11, number: '240735', sex: 'Бычок', birthDate: '10.05.2026', ageDays: 7, sire: 'DICTATOR', dam: '228441', weightKg: 44, fromLocation: 'Родильное', suggestedBarn: 'T-30' },
  { id: 'c12', index: 12, number: '240618', sex: 'Тёлочка', birthDate: '09.05.2026', ageDays: 8, sire: 'RAMSEY', dam: '227300', weightKg: 35, fromLocation: 'Родильное', suggestedBarn: 'T-38' },
]

export const animalsFreshMove: AnimalToRoute[] = [
  { id: 'f1', index: 1, number: '288401', sex: 'Тёлочка', birthDate: '01.05.2026', ageDays: 20, sire: 'ДРОУ-М', dam: '265100', weightKg: 52, fromLocation: 'Родильное №2', suggestedBarn: 'K-12' },
  { id: 'f2', index: 2, number: '288302', sex: 'Тёлочка', birthDate: '02.05.2026', ageDays: 19, sire: 'БАНЗАЙ', dam: '264880', weightKg: 48, fromLocation: 'Родильное №2' },
  { id: 'f3', index: 3, number: '287901', sex: 'Тёлочка', birthDate: '03.05.2026', ageDays: 18, sire: 'DICTATOR', dam: '263401', weightKg: 50, fromLocation: 'Родильное №2', suggestedBarn: 'K-12' },
  { id: 'f4', index: 4, number: '287655', sex: 'Тёлочка', birthDate: '04.05.2026', ageDays: 17, sire: 'RAMSEY', dam: '262900', weightKg: 47, fromLocation: 'Больничная', suggestedBarn: 'K-14' },
]

const GROUP_ANIMALS: Record<string, AnimalToRoute[]> = {
  'calves-701': animalsCalves701,
  'fresh-move': animalsFreshMove,
}

const ASSIGN_KEY = 'matrix-barn-assign-v1'
const HANDOVER_KEY = 'matrix-barn-handover-v1'

export type HandoverState = {
  handedBy: string
  receivedBy: string
  confirmedAt: string | null
}

export function getAnimalsForGroup(groupId: string): AnimalToRoute[] {
  return GROUP_ANIMALS[groupId] ?? []
}

export function loadAssignments(groupId: string): Record<string, string> {
  try {
    const raw = localStorage.getItem(`${ASSIGN_KEY}-${groupId}`)
    if (!raw) return {}
    return JSON.parse(raw) as Record<string, string>
  } catch {
    return {}
  }
}

export function saveAssignments(groupId: string, map: Record<string, string>) {
  localStorage.setItem(`${ASSIGN_KEY}-${groupId}`, JSON.stringify(map))
}

export function loadHandover(groupId: string): HandoverState {
  const empty = { handedBy: '', receivedBy: '', confirmedAt: null }
  try {
    const raw = localStorage.getItem(`${HANDOVER_KEY}-${groupId}`)
    if (!raw) return empty
    return { ...empty, ...(JSON.parse(raw) as HandoverState) }
  } catch {
    return empty
  }
}

export function saveHandover(groupId: string, state: HandoverState) {
  localStorage.setItem(`${HANDOVER_KEY}-${groupId}`, JSON.stringify(state))
}

export function countUnassigned(groupId: string): number {
  const animals = getAnimalsForGroup(groupId)
  const assign = loadAssignments(groupId)
  return animals.filter((a) => !assign[a.id]).length
}

export function countAllUnassigned(): number {
  return routingGroups.reduce((s, g) => s + countUnassigned(g.id), 0)
}

export const BARN_ROUTING_CATEGORY = 'barn-routing'
