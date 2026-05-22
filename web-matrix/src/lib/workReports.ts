import { loadAssignmentState, transferAnimals, transferGroups } from '../data/barnAssignment'
import type { LeadershipTask } from '../data/staff'
import { staffMemberById } from '../data/staff'
import { loadTaskStatus, vetTasks } from '../data/vetTasks'
import { loadLeadershipTasks } from './leadershipTasks'

export type WorkReportKind = 'leadership_done' | 'vet_done' | 'barn_handover'

export type WorkReport = {
  id: string
  kind: WorkReportKind
  completedAt: string
  actorName: string
  title: string
  detail?: string
}

const STORAGE_KEY = 'matrix-work-reports-v1'
export const WORK_REPORTS_CHANGED = 'matrix-work-reports-changed'

const kindLabel: Record<WorkReportKind, string> = {
  leadership_done: 'Задача от руководства',
  vet_done: 'Ветслужба',
  barn_handover: 'Передача по коровникам',
}

export function workReportKindLabel(kind: WorkReportKind): string {
  return kindLabel[kind]
}

export function loadWorkReports(): WorkReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const list = JSON.parse(raw) as WorkReport[]
    return [...list].sort((a, b) => b.completedAt.localeCompare(a.completedAt, 'ru'))
  } catch {
    return []
  }
}

function saveWorkReports(reports: WorkReport[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports))
  window.dispatchEvent(new Event(WORK_REPORTS_CHANGED))
}

export function subscribeWorkReports(onChange: () => void): () => void {
  const handler = () => onChange()
  window.addEventListener(WORK_REPORTS_CHANGED, handler)
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) onChange()
  })
  return () => window.removeEventListener(WORK_REPORTS_CHANGED, handler)
}

export function appendWorkReport(report: Omit<WorkReport, 'id'> & { id?: string }): WorkReport {
  const entry: WorkReport = {
    id: report.id ?? `wr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    kind: report.kind,
    completedAt: report.completedAt,
    actorName: report.actorName,
    title: report.title,
    detail: report.detail,
  }
  const existing = loadWorkReports()
  if (existing.some((r) => r.id === entry.id)) return entry
  saveWorkReports([entry, ...existing])
  return entry
}

export function recordLeadershipTaskDone(task: LeadershipTask, employeeName: string, completedAt: string) {
  appendWorkReport({
    id: `lr-${task.id}`,
    kind: 'leadership_done',
    completedAt,
    actorName: employeeName,
    title: task.title,
    detail: `Назначил: ${task.assignedBy} · срок ${task.dueDate}`,
  })
}

export function recordVetTaskDone(
  taskId: string,
  title: string,
  detail: string,
  actorName: string,
  completedAt: string,
) {
  appendWorkReport({
    id: `vt-${taskId}`,
    kind: 'vet_done',
    completedAt,
    actorName,
    title,
    detail,
  })
}

export function recordBarnHandover(
  handedBy: string,
  receivedBy: string,
  confirmedAt: string,
  animalCount: number,
  groupLabel: string,
) {
  appendWorkReport({
    id: `bh-${confirmedAt}-${handedBy}`,
    kind: 'barn_handover',
    completedAt: confirmedAt,
    actorName: handedBy,
    title: `Передача списка · ${groupLabel}`,
    detail: `Принял: ${receivedBy} · животных: ${animalCount}`,
  })
}

/** Подтянуть уже сохранённые статусы (вет, руководство, передача) в журнал без дублей. */
export function reconcileWorkReportsFromState(activeVetName: string) {
  for (const task of loadLeadershipTasks()) {
    if (task.status !== 'done') continue
    const who = staffMemberById(task.employeeId)?.name ?? 'Сотрудник'
    appendWorkReport({
      id: `lr-${task.id}`,
      kind: 'leadership_done',
      completedAt: task.createdAt,
      actorName: who,
      title: task.title,
      detail: `Назначил: ${task.assignedBy}`,
    })
  }

  for (const task of vetTasks) {
    const status = loadTaskStatus(task.id, task.status)
    if (status !== 'done') continue
    appendWorkReport({
      id: `vt-${task.id}`,
      kind: 'vet_done',
      completedAt: new Date().toLocaleString('ru-RU'),
      actorName: activeVetName,
      title: `${task.barn} · №${task.cow}`,
      detail: task.issue,
    })
  }

  const { handover, assignments } = loadAssignmentState()
  if (handover.confirmedAt) {
    const group = transferGroups[0]
    const count = transferAnimals.filter((a) => a.groupId === group?.id && assignments[a.cowNumber]).length
    appendWorkReport({
      id: `bh-${handover.confirmedAt}`,
      kind: 'barn_handover',
      completedAt: handover.confirmedAt,
      actorName: handover.handedBy,
      title: `Передача списка · ${group?.label ?? 'группа'}`,
      detail: `Принял: ${handover.receivedBy} · назначено: ${count}`,
    })
  }
}

export function reportsForViewer(
  reports: WorkReport[],
  viewerName: string | null,
  isManager: boolean,
): WorkReport[] {
  if (isManager || !viewerName) return reports
  return reports.filter((r) => r.actorName === viewerName)
}

export function exportReportsCsv(reports: WorkReport[]): string {
  const header = 'Дата;Тип;Исполнитель;Работа;Подробности'
  const rows = reports.map((r) =>
    [r.completedAt, workReportKindLabel(r.kind), r.actorName, r.title, r.detail ?? '']
      .map((c) => `"${String(c).replace(/"/g, '""')}"`)
      .join(';'),
  )
  return [header, ...rows].join('\n')
}
