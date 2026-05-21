import type { LeadershipTask, StaffMember, StaffRoleId } from '../data/staff'
import { staffMembers } from '../data/staff'

export type NotificationKind = 'task_assigned' | 'task_completed'

export type NotificationTarget = {
  targetEmployeeId?: string
  targetRoles?: StaffRoleId[]
}

/** Кому уходит уведомление при назначении задачи. */
export function targetsForTaskAssigned(task: LeadershipTask): NotificationTarget[] {
  const targets: NotificationTarget[] = [{ targetEmployeeId: task.employeeId }]
  const assigner = staffMembers.find((m) => m.name === task.assignedBy)
  if (assigner && (assigner.roleId === 'manager' || assigner.roleId === 'admin')) {
    targets.push({ targetEmployeeId: assigner.id })
  } else {
    targets.push({ targetRoles: ['manager', 'admin'] })
  }
  return targets
}

/** Кому уходит уведомление при выполнении. */
export function targetsForTaskCompleted(task: LeadershipTask): NotificationTarget[] {
  const targets: NotificationTarget[] = [{ targetRoles: ['manager', 'admin'] }]
  const assigner = staffMembers.find((m) => m.name === task.assignedBy)
  if (assigner) targets.push({ targetEmployeeId: assigner.id })
  return targets
}

export function matchesNotificationTarget(
  target: NotificationTarget,
  viewer: StaffMember | null,
): boolean {
  if (target.targetEmployeeId) {
    if (viewer?.id === target.targetEmployeeId) return true
    if (!viewer) return false
    return false
  }
  if (target.targetRoles?.length) {
    if (!viewer) return target.targetRoles.some((r) => r === 'manager' || r === 'admin')
    return target.targetRoles.includes(viewer.roleId)
  }
  return false
}

export function viewerSeesNotification(
  note: { targetEmployeeId?: string; targetRoles?: StaffRoleId[] },
  viewer: StaffMember | null,
): boolean {
  if (note.targetEmployeeId && viewer?.id === note.targetEmployeeId) return true
  if (note.targetRoles?.length && viewer && note.targetRoles.includes(viewer.roleId)) return true
  if (note.targetRoles?.length && !viewer) {
    return note.targetRoles.some((r) => r === 'manager' || r === 'admin')
  }
  return false
}
