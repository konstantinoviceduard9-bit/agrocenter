import type { LeadershipTask, StaffRoleId } from '../data/staff'
import type { NotificationKind } from './notificationRouting'
import { targetsForTaskAssigned, targetsForTaskCompleted } from './notificationRouting'
import { uploadNotifications } from './matrixSync'

export type AppNotification = {
  id: string
  kind: NotificationKind
  taskId: string
  employeeId: string
  employeeName: string
  taskTitle: string
  assignedBy: string
  targetEmployeeId?: string
  targetRoles?: StaffRoleId[]
  createdAt: string
  read: boolean
}

/** @deprecated используйте AppNotification */
export type ManagerNotification = AppNotification & { completedAt?: string }

const NOTIFICATIONS_KEY = 'matrix-manager-notifications-v1'
export const MANAGER_NOTIFICATIONS_CHANGED = 'matrix-manager-notifications-changed'

export function loadManagerNotifications(): AppNotification[] {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as AppNotification[]
    return parsed.map((n) => ({
      ...n,
      kind: n.kind ?? 'task_completed',
      createdAt: n.createdAt ?? (n as ManagerNotification).completedAt ?? '',
    }))
  } catch {
    return []
  }
}

function saveManagerNotifications(list: AppNotification[]) {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(list))
  window.dispatchEvent(new Event(MANAGER_NOTIFICATIONS_CHANGED))
}

export function applyCloudNotifications(list: AppNotification[]) {
  saveManagerNotifications(list)
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

function pushNotifications(notes: AppNotification[]) {
  const merged = [...notes, ...loadManagerNotifications()]
  const seen = new Set<string>()
  const unique = merged.filter((n) => {
    const key = `${n.kind}-${n.taskId}-${n.targetEmployeeId ?? ''}-${n.targetRoles?.join(',') ?? ''}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
  saveManagerNotifications(unique)
  void uploadNotifications(unique)
  return notes
}

function buildNote(
  task: LeadershipTask,
  employeeName: string,
  kind: NotificationKind,
  target: { targetEmployeeId?: string; targetRoles?: StaffRoleId[] },
): AppNotification {
  return {
    id: `mn-${kind}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    kind,
    taskId: task.id,
    employeeId: task.employeeId,
    employeeName,
    taskTitle: task.title,
    assignedBy: task.assignedBy,
    targetEmployeeId: target.targetEmployeeId,
    targetRoles: target.targetRoles,
    createdAt: new Date().toLocaleString('ru-RU'),
    read: false,
  }
}

/** Уведомления по ролям: сотруднику + руководству. */
export function notifyTaskAssigned(task: LeadershipTask, employeeName: string): AppNotification[] {
  const notes = targetsForTaskAssigned(task).map((t) => buildNote(task, employeeName, 'task_assigned', t))
  return pushNotifications(notes)
}

export function notifyTaskCompleted(task: LeadershipTask, employeeName: string): AppNotification[] {
  const notes = targetsForTaskCompleted(task).map((t) => buildNote(task, employeeName, 'task_completed', t))
  return pushNotifications(notes)
}

/** @deprecated */
export function notifyManagerTaskCompleted(task: LeadershipTask, employeeName: string): AppNotification {
  return notifyTaskCompleted(task, employeeName)[0]!
}

export function markAllManagerNotificationsRead() {
  const list = loadManagerNotifications().map((n) => ({ ...n, read: true }))
  saveManagerNotifications(list)
  void uploadNotifications(list)
}

export function markNotificationsReadForViewer(viewerId: string | null, roleId: StaffRoleId | null) {
  const list = loadManagerNotifications().map((n) => {
    const forMe =
      (viewerId && n.targetEmployeeId === viewerId) ||
      (roleId && n.targetRoles?.includes(roleId))
    return forMe ? { ...n, read: true } : n
  })
  saveManagerNotifications(list)
  void uploadNotifications(list)
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
  notifyTaskCompleted(
    {
      id: payload.taskId,
      employeeId: payload.employeeId,
      title: payload.taskTitle,
      assignedBy: payload.assignedBy,
      dueDate: '',
      status: 'done',
      createdAt: payload.completedAt,
    },
    payload.employeeName,
  )
}

export function staffNotifyShareUrl(payload: CompletionSharePayload): string {
  const base = import.meta.env.BASE_URL || '/'
  const root = base.endsWith('/') ? base : `${base}/`
  const params = new URLSearchParams({ done: encodeCompletionShare(payload) })
  return `${window.location.origin}${root}staff?${params.toString()}`
}

export async function tryShowRoleNotification(note: AppNotification): Promise<void> {
  if (typeof Notification === 'undefined') return
  if (Notification.permission === 'default') {
    try {
      await Notification.requestPermission()
    } catch {
      return
    }
  }
  if (Notification.permission !== 'granted') return
  const title = note.kind === 'task_assigned' ? 'Новая задача' : 'Задача выполнена'
  const body =
    note.kind === 'task_assigned'
      ? `${note.assignedBy}: ${note.taskTitle}`
      : `${note.employeeName}: ${note.taskTitle}`
  try {
    new Notification(title, { body, tag: note.id, lang: 'ru' })
  } catch {
    /* ignore */
  }
}

/** @deprecated */
export async function tryShowCompletionNotification(note: AppNotification): Promise<void> {
  return tryShowRoleNotification(note)
}
