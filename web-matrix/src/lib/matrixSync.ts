import type { LeadershipTask, StaffRoleId } from '../data/staff'
import { loadLeadershipTasks, saveLeadershipTasks } from './leadershipTasks'
import type { AppNotification } from './managerNotifications'
import { getSupabase, isCloudSyncEnabled } from './supabaseClient'

export type SyncMode = 'local' | 'cloud'

export function syncMode(): SyncMode {
  return isCloudSyncEnabled() ? 'cloud' : 'local'
}

export async function fetchTasks(): Promise<LeadershipTask[]> {
  const sb = getSupabase()
  if (!sb) return loadLeadershipTasks()
  const { data, error } = await sb.from('matrix_tasks').select('*').order('created_at', { ascending: false })
  if (error || !data?.length) return loadLeadershipTasks()
  return data.map(rowToTask)
}

export async function persistTasks(tasks: LeadershipTask[]): Promise<void> {
  saveLeadershipTasks(tasks)
  const sb = getSupabase()
  if (!sb) return
  await sb.from('matrix_tasks').upsert(tasks.map(taskToRow))
}

export async function fetchNotifications(): Promise<AppNotification[] | null> {
  const sb = getSupabase()
  if (!sb) return null
  const { data, error } = await sb.from('matrix_notifications').select('*').order('created_at', { ascending: false })
  if (error || !data) return null
  return data.map((r) => rowToNotification(r as Record<string, unknown>))
}

export async function uploadNotifications(list: AppNotification[]): Promise<void> {
  const sb = getSupabase()
  if (!sb) return
  await sb.from('matrix_notifications').upsert(list.map(notificationToRow))
}

export function subscribeCloudSync(onChange: () => void): () => void {
  const sb = getSupabase()
  if (!sb) return () => {}
  const channel = sb
    .channel('matrix-sync')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'matrix_tasks' }, () => onChange())
    .on('postgres_changes', { event: '*', schema: 'public', table: 'matrix_notifications' }, () => onChange())
    .subscribe()
  return () => {
    void sb.removeChannel(channel)
  }
}

function taskToRow(t: LeadershipTask) {
  return {
    id: t.id,
    employee_id: t.employeeId,
    title: t.title,
    assigned_by: t.assignedBy,
    due_date: t.dueDate,
    status: t.status,
    created_at: t.createdAt,
  }
}

function rowToTask(r: Record<string, string>): LeadershipTask {
  return {
    id: r.id,
    employeeId: r.employee_id,
    title: r.title,
    assignedBy: r.assigned_by,
    dueDate: r.due_date,
    status: r.status as LeadershipTask['status'],
    createdAt: r.created_at,
  }
}

function notificationToRow(n: AppNotification) {
  return {
    id: n.id,
    kind: n.kind,
    task_id: n.taskId,
    employee_id: n.employeeId,
    employee_name: n.employeeName,
    task_title: n.taskTitle,
    assigned_by: n.assignedBy,
    target_employee_id: n.targetEmployeeId ?? null,
    target_roles: n.targetRoles ?? null,
    created_at: n.createdAt,
    read: n.read,
  }
}

function rowToNotification(r: Record<string, unknown>): AppNotification {
  return {
    id: String(r.id),
    kind: r.kind as AppNotification['kind'],
    taskId: String(r.task_id),
    employeeId: String(r.employee_id),
    employeeName: String(r.employee_name),
    taskTitle: String(r.task_title),
    assignedBy: String(r.assigned_by),
    targetEmployeeId: r.target_employee_id ? String(r.target_employee_id) : undefined,
    targetRoles: Array.isArray(r.target_roles) ? (r.target_roles as StaffRoleId[]) : undefined,
    createdAt: String(r.created_at),
    read: Boolean(r.read),
  }
}
