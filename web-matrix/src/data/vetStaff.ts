/** Справочник ветслужбы Матрикс (демо). */

export const veterinarians = [
  'Забиров Г.И.',
  'Мухаметшин Р.А.',
  'Ибрагимов Т.В.',
  'Сафин А.Р.',
  'Хабибуллин М.Ф.',
] as const

/** Зоотехники / подтверждение рациона (кормление · DTM) */
export const zootechnicians = [
  'Забиров Г.И.',
  'Кузнецов П.С.',
  'Ямалетдинов И.Р.',
  'Валеев Р.Н.',
  'Гарифуллин А.Х.',
  'Мухаметшин Р.А.',
  'Сафин А.Р.',
  'Хабибуллин М.Ф.',
] as const

/** Принимающие по коровнику — зоотехники и старшие по секциям */
export const barnReceivers = [
  'Кузнецов П.С.',
  'Ямалетдинов И.Р.',
  'Валеев Р.Н.',
  'Гарифуллин А.Х.',
  'Мухаметшин Р.А.',
  'Сафин А.Р.',
] as const

export type VeterinarianName = (typeof veterinarians)[number]
export type BarnReceiverName = (typeof barnReceivers)[number]

const LAST_VET_HANDOVER_KEY = 'matrix-barn-last-vet-handover'
const ACTIVE_VET_KEY = 'matrix-active-vet'
const ZOOTECH_KEY = 'matrix-zootech-name'

export function loadZootech(): string {
  try {
    const saved = localStorage.getItem(ZOOTECH_KEY)
    if (saved && (zootechnicians as readonly string[]).includes(saved)) return saved
  } catch {
    /* ignore */
  }
  const active = loadActiveVet()
  if ((zootechnicians as readonly string[]).includes(active)) return active
  return zootechnicians[0]
}

export function saveZootech(name: string) {
  localStorage.setItem(ZOOTECH_KEY, name)
}

export function loadActiveVet(): string {
  try {
    const v = localStorage.getItem(ACTIVE_VET_KEY)
    if (v && veterinarians.includes(v as VeterinarianName)) return v
  } catch {
    /* ignore */
  }
  return veterinarians[0]
}

export function saveActiveVet(name: string) {
  localStorage.setItem(ACTIVE_VET_KEY, name)
}

export function loadLastVetHandover(): { handedBy: string; receivedBy: string } {
  try {
    const raw = localStorage.getItem(LAST_VET_HANDOVER_KEY)
    if (!raw) return { handedBy: veterinarians[0], receivedBy: '' }
    return JSON.parse(raw) as { handedBy: string; receivedBy: string }
  } catch {
    return { handedBy: veterinarians[0], receivedBy: '' }
  }
}

export function saveLastVetHandover(handedBy: string, receivedBy: string) {
  localStorage.setItem(LAST_VET_HANDOVER_KEY, JSON.stringify({ handedBy, receivedBy }))
}
