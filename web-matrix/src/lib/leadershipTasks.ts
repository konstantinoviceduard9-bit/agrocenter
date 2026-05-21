import type { LeadershipTask } from '../data/staff'

export const LEADERSHIP_TASKS_KEY = 'matrix-leadership-tasks-v1'
export const LEADERSHIP_TASKS_CHANGED = 'matrix-leadership-tasks-changed'

const defaultTasks: LeadershipTask[] = [
  {
    id: 'lt1',
    employeeId: 'e4',
    title: 'Проверить идентификацию в дойке 3',
    assignedBy: 'Сафин А.Р.',
    dueDate: '21.05.2026',
    status: 'open',
    createdAt: '21.05.2026 08:00',
  },
  {
    id: 'lt2',
    employeeId: 'e1',
    title: 'Осмотр новотельных · корпус 7',
    assignedBy: 'Сафин А.Р.',
    dueDate: '21.05.2026',
    status: 'in_progress',
    createdAt: '21.05.2026 07:30',
  },
  {
    id: 'lt3',
    employeeId: 'e6',
    title: 'Доставка силоса · маршрут Т-2',
    assignedBy: 'Сафин А.Р.',
    dueDate: '21.05.2026',
    status: 'open',
    createdAt: '21.05.2026 06:00',
  },
]

export function loadLeadershipTasks(): LeadershipTask[] {
  try {
    const raw = localStorage.getItem(LEADERSHIP_TASKS_KEY)
    if (!raw) return [...defaultTasks]
    return JSON.parse(raw) as LeadershipTask[]
  } catch {
    return [...defaultTasks]
  }
}

export function saveLeadershipTasks(tasks: LeadershipTask[]) {
  localStorage.setItem(LEADERSHIP_TASKS_KEY, JSON.stringify(tasks))
  window.dispatchEvent(new Event(LEADERSHIP_TASKS_CHANGED))
}

/** Подписка: другая вкладка, назначение на этом же устройстве, возврат в приложение. */
export function subscribeLeadershipTasks(onChange: () => void): () => void {
  const onCustom = () => onChange()
  const onStorage = (e: StorageEvent) => {
    if (e.key === LEADERSHIP_TASKS_KEY) onChange()
  }
  const onVisible = () => {
    if (document.visibilityState === 'visible') onChange()
  }

  window.addEventListener(LEADERSHIP_TASKS_CHANGED, onCustom)
  window.addEventListener('storage', onStorage)
  document.addEventListener('visibilitychange', onVisible)

  return () => {
    window.removeEventListener(LEADERSHIP_TASKS_CHANGED, onCustom)
    window.removeEventListener('storage', onStorage)
    document.removeEventListener('visibilitychange', onVisible)
  }
}

export function appendLeadershipTask(task: LeadershipTask): LeadershipTask[] {
  const updated = [task, ...loadLeadershipTasks()]
  saveLeadershipTasks(updated)
  return updated
}

export function mergeLeadershipTask(task: LeadershipTask): LeadershipTask[] {
  const existing = loadLeadershipTasks()
  if (existing.some((t) => t.id === task.id)) return existing
  const updated = [task, ...existing]
  saveLeadershipTasks(updated)
  return updated
}

export type TaskSharePayload = {
  employeeId: string
  title: string
  assignedBy: string
  dueDate: string
}

export function encodeTaskShare(payload: TaskSharePayload): string {
  const json = JSON.stringify(payload)
  return btoa(unescape(encodeURIComponent(json)))
}

export function decodeTaskShare(encoded: string): TaskSharePayload | null {
  try {
    const json = decodeURIComponent(escape(atob(encoded)))
    const p = JSON.parse(json) as TaskSharePayload
    if (!p.employeeId || !p.title) return null
    return p
  } catch {
    return null
  }
}

export function taskFromSharePayload(p: TaskSharePayload): LeadershipTask {
  return {
    id: `lt-share-${Date.now()}`,
    employeeId: p.employeeId,
    title: p.title,
    assignedBy: p.assignedBy,
    dueDate: p.dueDate,
    status: 'open',
    createdAt: new Date().toLocaleString('ru-RU'),
  }
}

export function myTasksShareUrl(payload: TaskSharePayload): string {
  const base = import.meta.env.BASE_URL || '/'
  const root = base.endsWith('/') ? base : `${base}/`
  const params = new URLSearchParams({ add: encodeTaskShare(payload) })
  return `${window.location.origin}${root}my-tasks?${params.toString()}`
}
