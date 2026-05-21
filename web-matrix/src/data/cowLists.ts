/** Демо-списки коров по категориям (стабильная генерация для прототипа). */

export type CowRecord = {
  number: string
  barn: string
  group: string
  lactation: number
  daysInMilk: number | null
  yieldLiters: number | null
  note: string
}

export type AnimalCategory = {
  id: string
  label: string
  count: number
  highlight?: boolean
  section: 'health' | 'today' | 'reproduction' | 'groups' | 'malfunctions' | 'herd'
  source: string
  hint?: string
}

const BARNS = Array.from({ length: 17 }, (_, i) => `Коровник ${i + 1}`)
const GROUPS = ['Дойные В', 'Дойные Н', 'Новотельные', 'Больничная', 'Сухостой']

function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h || 1
}

function generateCows(categoryId: string, count: number, noteTemplate: string): CowRecord[] {
  let seed = hash(categoryId)
  return Array.from({ length: count }, (_, i) => {
    seed = (seed * 1103515245 + 12345 + i) >>> 0
    const barn = BARNS[seed % BARNS.length] ?? BARNS[0]
    const group = GROUPS[seed % GROUPS.length] ?? GROUPS[0]
    const number = String(1000 + ((seed % 890000) + i * 17) % 890000)
    const lactation = 1 + (seed % 5)
    const dim = group === 'Сухостой' ? null : 20 + (seed % 280)
    const yieldLiters = dim == null ? null : Math.round((24 + (seed % 180) / 10) * 10) / 10
    const note = noteTemplate.replace('{n}', String(i + 1))
    return { number, barn, group, lactation, daysInMilk: dim, yieldLiters, note }
  })
}

export const animalCategories: AnimalCategory[] = [
  {
    id: 'mastitis',
    label: 'Мастит (подозрение)',
    count: 18,
    highlight: true,
    section: 'health',
    source: 'Afimilk',
    hint: 'Проводимость молока / соматика выше порога',
  },
  {
    id: 'digest',
    label: 'Проблемы пищеварения',
    count: 7,
    section: 'health',
    source: 'Afimilk',
    hint: 'Снижение аппетита, отклонение по руминации',
  },
  {
    id: 'ketosis',
    label: 'Кетоз',
    count: 6,
    highlight: true,
    section: 'health',
    source: 'Afimilk',
    hint: 'Новотельные, 1–21 DIM',
  },
  {
    id: 'fresh',
    label: 'Новотельные — осмотр',
    count: 15,
    section: 'health',
    source: 'Afimilk',
  },
  {
    id: 'check',
    label: 'Подозрительные на проверку',
    count: 15,
    section: 'health',
    source: 'Afimilk',
  },
  {
    id: 'report',
    label: 'Отчёт контроля здоровья',
    count: 26,
    section: 'health',
    source: 'Afimilk · сводный отчёт',
  },
  {
    id: 'dry-off',
    label: 'Ожидаемый запуск в сухостой',
    count: 41,
    section: 'today',
    source: 'Afimilk',
  },
  {
    id: 'calving',
    label: 'Ожидаемый отёл',
    count: 12,
    section: 'today',
    source: 'Afimilk',
  },
  {
    id: 'sorting',
    label: 'Сортировка животных',
    count: 8,
    section: 'today',
    source: 'Afimilk',
  },
  {
    id: 'pregnancy-check',
    label: 'Проверка стельности (рекоменд.)',
    count: 3,
    section: 'today',
    source: 'Afimilk',
  },
  {
    id: 'insemination',
    label: 'На осеменение',
    count: 3,
    section: 'reproduction',
    source: 'Afimilk',
  },
  {
    id: 'abort-suspect',
    label: 'Подозрение на аборт',
    count: 2,
    highlight: true,
    section: 'reproduction',
    source: 'Afimilk',
  },
  {
    id: 'anestrus',
    label: 'Аноэструс',
    count: 18,
    section: 'reproduction',
    source: 'Afimilk',
  },
  {
    id: 'comfort-group',
    label: 'Комфорт группы',
    count: 2,
    section: 'groups',
    source: 'DTM / Afimilk',
  },
  {
    id: 'feeding-alert',
    label: 'Алерты по кормлению',
    count: 4,
    section: 'groups',
    source: 'DTM',
  },
  {
    id: 'tags-unattached',
    label: 'Метки не прикреплены',
    count: 9,
    section: 'malfunctions',
    source: 'Afimilk · идентификация',
  },
  {
    id: 'unidentified-milking',
    label: 'Не идентифицированы в дойке',
    count: 188,
    highlight: true,
    section: 'malfunctions',
    source: 'Afimilk · дойка',
    hint: 'Приоритет модуля 4.5 — восстановление ID',
  },
  {
    id: 'wrong-group',
    label: 'Неверная группа',
    count: 2,
    section: 'malfunctions',
    source: 'Afimilk',
  },
  {
    id: 'broken-tags',
    label: 'Неисправные метки',
    count: 37,
    highlight: true,
    section: 'malfunctions',
    source: 'Afimilk · RFID',
  },
  {
    id: 'herd-milking',
    label: 'Дойные в производстве',
    count: 1000,
    section: 'herd',
    source: 'Afimilk · стадо',
  },
  {
    id: 'herd-pregnant',
    label: 'Стельные / дойные',
    count: 558,
    section: 'herd',
    source: 'Afimilk',
  },
  {
    id: 'herd-open',
    label: 'Нестельные',
    count: 444,
    section: 'herd',
    source: 'Afimilk',
  },
  {
    id: 'herd-dry',
    label: 'Сухостой',
    count: 150,
    section: 'herd',
    source: 'Afimilk',
  },
]

const categoryById = new Map(animalCategories.map((c) => [c.id, c]))

const NOTE_BY_SECTION: Record<AnimalCategory['section'], string> = {
  health: 'Сигнал Afimilk · {n}',
  today: 'Задача на сегодня · {n}',
  reproduction: 'Воспроизводство · {n}',
  groups: 'Группа / кормление · {n}',
  malfunctions: 'Неисправность ID · {n}',
  herd: 'Учёт стада · {n}',
}

const cowCache = new Map<string, CowRecord[]>()

export function getCategoryById(id: string | undefined): AnimalCategory | undefined {
  if (!id) return undefined
  return categoryById.get(id)
}

export function getCowsForCategory(id: string): CowRecord[] {
  const cached = cowCache.get(id)
  if (cached) return cached

  const cat = getCategoryById(id)
  if (!cat) return []

  const list = generateCows(id, cat.count, NOTE_BY_SECTION[cat.section])
  cowCache.set(id, list)
  return list
}

export function animalListPath(categoryId: string): string {
  return `/animals/${categoryId}`
}

export type CountListItem = {
  label: string
  count: number
  highlight?: boolean
  to: string
}

export function categoryCountItems(section: AnimalCategory['section']): CountListItem[] {
  return animalCategories
    .filter((c) => c.section === section)
    .map((c) => ({
      label: c.label,
      count: c.count,
      highlight: c.highlight,
      to: animalListPath(c.id),
    }))
}

/** Для больших списков — постраничный показ в UI */
export const COW_LIST_PAGE_SIZE = 50
