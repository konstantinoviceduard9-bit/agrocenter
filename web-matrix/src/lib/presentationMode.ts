import {
  countAllUnassigned,
  loadAssignmentState,
  transferGroups,
} from '../data/barnAssignment'
import { loadTaskStatus, vetTasks } from '../data/vetTasks'
import { loadActiveVet } from '../data/vetStaff'
import { loadLeadershipTasks } from './leadershipTasks'
import { loadManagerNotifications, notifyTaskCompleted } from './managerNotifications'
import {
  loadWorkReports,
  recordBarnHandover,
  recordLeadershipTaskDone,
  recordVetTaskDone,
} from './workReports'

const KEY = 'matrix-presentation-mode-v1'
export const PRESENTATION_MODE_CHANGED = 'matrix-presentation-mode-changed'

export function isPresentationMode(): boolean {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

export function setPresentationMode(on: boolean) {
  try {
    if (on) localStorage.setItem(KEY, '1')
    else localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(PRESENTATION_MODE_CHANGED))
}

export function subscribePresentationMode(onChange: () => void): () => void {
  const handler = () => onChange()
  window.addEventListener(PRESENTATION_MODE_CHANGED, handler)
  return () => window.removeEventListener(PRESENTATION_MODE_CHANGED, handler)
}

/** Подготовить демо для показа руководству: отчёты, уведомления. */
export function seedPresentationDemo() {
  const tasks = loadLeadershipTasks()
  const done = tasks.find((t) => t.status === 'done')
  if (done) {
    recordLeadershipTaskDone(done, 'Ямалетдинов И.Р.', done.createdAt)
    if (loadManagerNotifications().length < 2) {
      notifyTaskCompleted(done, 'Ямалетдинов И.Р.')
    }
  }

  for (const vt of vetTasks) {
    if (loadTaskStatus(vt.id, vt.status) === 'done') {
      recordVetTaskDone(vt.id, `${vt.barn} · №${vt.cow}`, vt.issue, loadActiveVet(), new Date().toLocaleString('ru-RU'))
    }
  }

  const { handover } = loadAssignmentState()
  if (handover.confirmedAt) {
    recordBarnHandover(
      handover.handedBy,
      handover.receivedBy,
      handover.confirmedAt,
      9,
      transferGroups[0]?.label ?? 'Телята · группа 701',
    )
  }

  if (loadWorkReports().length < 2) {
    recordVetTaskDone(
      't1',
      'Коровник 5 · №2964',
      'Мастит (ранний сигнал 78%)',
      loadActiveVet(),
      new Date().toLocaleString('ru-RU'),
    )
  }
}

export type ExecutiveBriefStats = {
  openTasks: number
  reportsToday: number
  vetHighOpen: number
  barnPending: number
}

export function executiveBriefStats(): ExecutiveBriefStats {
  const today = new Date().toLocaleDateString('ru-RU')
  const reports = loadWorkReports().filter((r) => r.completedAt.includes(today))
  return {
    openTasks: loadLeadershipTasks().filter((t) => t.status !== 'done').length,
    reportsToday: reports.length,
    vetHighOpen: vetTasks.filter(
      (t) => t.priority === 'high' && loadTaskStatus(t.id, t.status) !== 'done',
    ).length,
    barnPending: countAllUnassigned(),
  }
}
