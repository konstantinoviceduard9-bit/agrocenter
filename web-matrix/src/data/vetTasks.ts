import type { CowRecord } from './cowLists'

export type VetTaskStatus = 'open' | 'in_progress' | 'done'

export type VetTask = {
  id: string
  categoryId: string
  barn: string
  cow: string
  issue: string
  priority: 'high' | 'medium'
  status: VetTaskStatus
  /** Сводка для карточки коровы, если её нет в списке категории */
  summary: CowRecord
}

export const vetTasks: VetTask[] = [
  {
    id: 't1',
    categoryId: 'mastitis',
    barn: 'Коровник 5',
    cow: '2964',
    issue: 'Мастит (ранний сигнал 78%)',
    priority: 'high',
    status: 'open',
    summary: {
      number: '2964',
      barn: 'Коровник 5',
      group: 'Дойные Н',
      lactation: 2,
      daysInMilk: 186,
      yieldLiters: 34.2,
      note: 'Мастит (ранний сигнал 78%)',
    },
  },
  {
    id: 't2',
    categoryId: 'ketosis',
    barn: 'Коровник 5',
    cow: '231112',
    issue: 'Кетоз (65%)',
    priority: 'high',
    status: 'open',
    summary: {
      number: '231112',
      barn: 'Коровник 5',
      group: 'Новотельные',
      lactation: 3,
      daysInMilk: 12,
      yieldLiters: 28.5,
      note: 'Кетоз (65%)',
    },
  },
  {
    id: 't3',
    categoryId: 'check',
    barn: 'Коровник 7',
    cow: '240146',
    issue: 'Тренд хромоты',
    priority: 'medium',
    status: 'in_progress',
    summary: {
      number: '240146',
      barn: 'Коровник 7',
      group: 'Дойные В',
      lactation: 2,
      daysInMilk: 204,
      yieldLiters: 31.8,
      note: 'Тренд хромоты',
    },
  },
  {
    id: 't4',
    categoryId: 'fresh',
    barn: 'Коровник 3',
    cow: '18902',
    issue: 'Новотельная — осмотр',
    priority: 'medium',
    status: 'done',
    summary: {
      number: '18902',
      barn: 'Коровник 3',
      group: 'Новотельные',
      lactation: 2,
      daysInMilk: 8,
      yieldLiters: 26.1,
      note: 'Новотельная — осмотр',
    },
  },
]

const STATUS_KEY = 'matrix-vet-task-status-'

export function loadTaskStatus(taskId: string, defaultStatus: VetTaskStatus): VetTaskStatus {
  try {
    const raw = localStorage.getItem(`${STATUS_KEY}${taskId}`)
    if (raw === 'open' || raw === 'in_progress' || raw === 'done') return raw
  } catch {
    /* ignore */
  }
  return defaultStatus
}

export function saveTaskStatus(taskId: string, status: VetTaskStatus) {
  localStorage.setItem(`${STATUS_KEY}${taskId}`, status)
}

export function findVetTask(categoryId: string, cowNumber: string): VetTask | undefined {
  return vetTasks.find((t) => t.categoryId === categoryId && t.cow === cowNumber)
}

export function findVetTaskSummary(categoryId: string, cowNumber: string): CowRecord | undefined {
  return findVetTask(categoryId, cowNumber)?.summary
}
