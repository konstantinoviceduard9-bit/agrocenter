import type { LeadershipTask } from '../data/staff'

export type ManagerNotification = {
  id: string
  taskId: string
  employeeId: string
  employeeName: string
  taskTitle: string
  assignedBy: string
  completedAt: string
  read: boolean
}

const NOTIFICATIONS_KEY = 'matrix-manager-notifications-v1'
export const MANAGER_NOTIFICATIONS_CHANGED = 'matrix-manager-notifications-changed'

export function loadManagerNotifications(): ManagerNotification[] {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY)
    if (!raw) return []
    return JSON.parse(raw) as ManagerNotification[]
  } catch {
    return []
  }
}

function saveManagerNotifications(list: ManagerNotification[]) {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(list))
  window.dispatchEvent(new Event(MANAGER_NOTIFICATIONS_CHANGED))
}

export function subscribeManagerNotifications(onChange: () => void): () => void {
  const onCustom = () => onChange()
  const onStorage = (e: StorageEvent) => {
    if (e.key === NOTIFICATIONS_KEY) onChange()
  }
  const onVisible = () => {
    if (document.visibilityState === 'visible') onChange()
  }
  window.addEventListener(MANAGER_NOTIFICATIONS_CHANGED, onCustom)
  window.addEventListener('storage', onStorage)
  document.addEventListener('visibilitychange', onVisible)
  return () => {
    window.removeEventListener(MANAGER_NOTIFICATIONS_CHANGED, onCustom)
    window.removeEventListener('storage', onStorage)
    document.removeEventListener('visibilitychange', onVisible)
  }
}

export function unreadManagerCount(): number {
  return loadManagerNotifications().filter((n) => !n.read).length
}

export function markAllManagerNotificationsRead() {
  const list = loadManagerNotifications().map((n) => ({ ...n, read: true }))
  saveManagerNotifications(list)
}

export function notifyManagerTaskCompleted(
  task: LeadershipTask,
  employeeName: string,
): ManagerNotification {
  const note: ManagerNotification = {
    id: `mn-${Date.now()}`,
    taskId: task.id,
    employeeId: task.employeeId,
    employeeName,
    taskTitle: task.title,
    assignedBy: task.assignedBy,
    completedAt: new Date().toLocaleString('ru-RU'),
    read: false,
  }
  const list = [note, ...loadManagerNotifications().filter((n) => n.taskId !== task.id)]
  saveManagerNotifications(list)
  return note
}

export type CompletionSharePayload = {
  taskId: string
  employeeId: string
  employeeName: string
  taskTitle: string
  assignedBy: string
  completedAt: string
}

export function encodeCompletionShare(payload: CompletionSharePayload): string {
  return btoa(unescape(encodeURIComponent(JSON.stringify(payload))))
}

export function decodeCompletionShare(encoded: string): CompletionSharePayload | null {
  try {
    const p = JSON.parse(decodeURIComponent(escape(atob(encoded)))) as CompletionSharePayload
    if (!p.taskId || !p.employeeName || !p.taskTitle) return null
    return p
  } catch {
    return null
  }
}

export function mergeCompletionFromShare(payload: CompletionSharePayload): void {
  const note: ManagerNotification = {
    id: `mn-share-${Date.now()}`,
    taskId: payload.taskId,
    employeeId: payload.employeeId,
    employeeName: payload.employeeName,
    taskTitle: payload.taskTitle,
    assignedBy: payload.assignedBy,
    completedAt: payload.completedAt,
    read: false,
  }
  const list = [note, ...loadManagerNotifications().filter((n) => n.taskId !== payload.taskId)]
  saveManagerNotifications(list)
}

export function staffNotifyShareUrl(payload: CompletionSharePayload): string {
  const base = import.meta.env.BASE_URL || '/'
  const root = base.endsWith('/') ? base : `${base}/`
  const params = new URLSearchParams({ done: encodeCompletionShare(payload) })
  return `${window.location.origin}${root}staff?${params.toString()}`
}

/** Системное уведомление (если разрешено) — на этом же устройстве. */
export async function tryShowCompletionNotification(note: ManagerNotification): Promise<void> {
  if (typeof Notification === 'undefined') return
  if (Notification.permission === 'default') {
    try {
      await Notification.requestPermission()
    } catch {
      return
    }
  }
  if (Notification.permission !== 'granted') return
  try {
    new Notification('Задача выполнена', {
      body: `${note.employeeName}: ${note.taskTitle}`,
      tag: note.taskId,
      lang: 'ru',
    })
  } catch {
    /* ignore */
  }
}
