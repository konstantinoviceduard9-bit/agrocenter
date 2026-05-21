/**
 * Разделение по коровникам — демо по бланку AfiFarm «Телята · группа 701»
 * и ручным пометкам (2589 → Т-35, 240735 → Т-30, 240618 → Т-38).
 */

export type BarnDestination = {
  id: string
  label: string
  hint: string
}

export const barnDestinations: BarnDestination[] = [
  { id: 't-30', label: 'Т-30', hint: 'Телята · секция 30' },
  { id: 't-35', label: 'Т-35', hint: 'Телята · секция 35' },
  { id: 't-38', label: 'Т-38', hint: 'Телята · секция 38' },
  { id: 'mol-1', label: 'Мол-1', hint: 'Молодняк · корпус 1' },
  { id: 'hosp', label: 'Больничная', hint: 'Изолятор / лечение' },
  { id: 'dry-7', label: 'Сух-7', hint: 'Сухостой · коровник 7' },
]

export type TransferGroup = {
  id: string
  label: string
  afifarmGroup: string
  reportDate: string
}

export const transferGroups: TransferGroup[] = [
  { id: '701', label: 'Телята · группа 701', afifarmGroup: '701', reportDate: '17.05.2026' },
  { id: 'fresh', label: 'Новотельные · перевод', afifarmGroup: '412', reportDate: '21.05.2026' },
]

export type TransferAnimal = {
  id: string
  groupId: string
  cowNumber: string
  gender: 'Бычок' | 'Тёлочка'
  birthDate: string
  ageDays: number
  sire: string
  damId: string
  weightKg: number
  proteinControl: string | null
}

/** Животные из отчёта + ручной список */
export const transferAnimals: TransferAnimal[] = [
  {
    id: 'a1',
    groupId: '701',
    cowNumber: '2589',
    gender: 'Тёлочка',
    birthDate: '17.05.2026',
    ageDays: 0,
    sire: 'ДРОУ-М',
    damId: '241102',
    weightKg: 38,
    proteinControl: null,
  },
  {
    id: 'a2',
    groupId: '701',
    cowNumber: '240735',
    gender: 'Бычок',
    birthDate: '16.05.2026',
    ageDays: 1,
    sire: 'БАНЗАЙ',
    damId: '239881',
    weightKg: 40,
    proteinControl: '6,2',
  },
  {
    id: 'a3',
    groupId: '701',
    cowNumber: '240618',
    gender: 'Тёлочка',
    birthDate: '15.05.2026',
    ageDays: 2,
    sire: 'DICTATOR',
    damId: '238440',
    weightKg: 36,
    proteinControl: null,
  },
  {
    id: 'a4',
    groupId: '701',
    cowNumber: '240901',
    gender: 'Тёлочка',
    birthDate: '14.05.2026',
    ageDays: 3,
    sire: 'RAMSEY',
    damId: '240011',
    weightKg: 39,
    proteinControl: null,
  },
  {
    id: 'a5',
    groupId: '701',
    cowNumber: '240512',
    gender: 'Бычок',
    birthDate: '13.05.2026',
    ageDays: 4,
    sire: 'ДРОУ-М',
    damId: '237902',
    weightKg: 42,
    proteinControl: null,
  },
  {
    id: 'a6',
    groupId: '701',
    cowNumber: '240388',
    gender: 'Тёлочка',
    birthDate: '12.05.2026',
    ageDays: 5,
    sire: 'БАНЗАЙ',
    damId: '236701',
    weightKg: 33,
    proteinControl: null,
  },
  {
    id: 'a7',
    groupId: '701',
    cowNumber: '241055',
    gender: 'Тёлочка',
    birthDate: '17.05.2026',
    ageDays: 0,
    sire: 'DICTATOR',
    damId: '241200',
    weightKg: 37,
    proteinControl: null,
  },
  {
    id: 'a8',
    groupId: '701',
    cowNumber: '240799',
    gender: 'Бычок',
    birthDate: '16.05.2026',
    ageDays: 1,
    sire: 'RAMSEY',
    damId: '239550',
    weightKg: 45,
    proteinControl: null,
  },
  {
    id: 'a9',
    groupId: '701',
    cowNumber: '240644',
    gender: 'Тёлочка',
    birthDate: '15.05.2026',
    ageDays: 2,
    sire: 'ДРОУ-М',
    damId: '238901',
    weightKg: 38,
    proteinControl: null,
  },
  {
    id: 'f1',
    groupId: 'fresh',
    cowNumber: '198442',
    gender: 'Тёлочка',
    birthDate: '01.04.2026',
    ageDays: 50,
    sire: 'БАНЗАЙ',
    damId: '195201',
    weightKg: 412,
    proteinControl: null,
  },
  {
    id: 'f2',
    groupId: 'fresh',
    cowNumber: '197881',
    gender: 'Тёлочка',
    birthDate: '10.03.2026',
    ageDays: 72,
    sire: 'RAMSEY',
    damId: '194002',
    weightKg: 438,
    proteinControl: null,
  },
  {
    id: 'f3',
    groupId: 'fresh',
    cowNumber: '199015',
    gender: 'Тёлочка',
    birthDate: '20.04.2026',
    ageDays: 31,
    sire: 'DICTATOR',
    damId: '196440',
    weightKg: 385,
    proteinControl: null,
  },
]

/** Демо-назначения как на рукописном бланке */
export const defaultAssignments: Record<string, string> = {
  '2589': 't-35',
  '240735': 't-30',
  '240618': 't-38',
}

const STORAGE_KEY = 'matrix-barn-assignment-v1'
const HANDOVER_KEY = 'matrix-barn-handover-v1'

export type HandoverRecord = {
  handedBy: string
  receivedBy: string
  confirmedAt: string | null
}

export type AssignmentState = {
  assignments: Record<string, string>
  handover: HandoverRecord
}

import { loadActiveVet, loadLastVetHandover } from './vetStaff'

const lastHandover = loadLastVetHandover()
const defaultHandover: HandoverRecord = {
  handedBy: lastHandover.handedBy || loadActiveVet(),
  receivedBy: lastHandover.receivedBy,
  confirmedAt: null,
}

export function loadAssignmentState(): AssignmentState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const handRaw = localStorage.getItem(HANDOVER_KEY)
    const assignments = raw
      ? { ...defaultAssignments, ...(JSON.parse(raw) as Record<string, string>) }
      : { ...defaultAssignments }
    const handover = handRaw
      ? { ...defaultHandover, ...(JSON.parse(handRaw) as HandoverRecord) }
      : { ...defaultHandover }
    return { assignments, handover }
  } catch {
    return { assignments: { ...defaultAssignments }, handover: { ...defaultHandover } }
  }
}

export function saveAssignments(assignments: Record<string, string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments))
}

export function saveHandover(handover: HandoverRecord) {
  localStorage.setItem(HANDOVER_KEY, JSON.stringify(handover))
}

export function barnLabel(barnId: string | null | undefined): string {
  if (!barnId) return '—'
  return barnDestinations.find((b) => b.id === barnId)?.label ?? barnId
}

export function countUnassigned(groupId: string, assignments: Record<string, string>): number {
  return transferAnimals.filter((a) => a.groupId === groupId && !assignments[a.cowNumber]).length
}

/** Для бейджа в меню — только «без коровника» с учётом сохранённых назначений */
export function countAllUnassigned(): number {
  const { assignments } = loadAssignmentState()
  return transferAnimals.filter((a) => !assignments[a.cowNumber]).length
}

export const BARN_TRANSFER_CATEGORY = 'barn-transfer'
