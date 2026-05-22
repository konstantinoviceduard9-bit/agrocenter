import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { cowDetailPath } from '../data/cowDetail'
import { loadActiveVet } from '../data/vetStaff'
import {
  loadTaskStatus,
  saveTaskStatus,
  vetTasks,
  type VetTask,
  type VetTaskStatus,
} from '../data/vetTasks'
import { recordVetTaskDone } from '../lib/workReports'

const statusLabel: Record<VetTaskStatus, string> = {
  open: 'Открыта',
  in_progress: 'В работе',
  done: 'Выполнена',
}

const statusBtnClass: Record<VetTaskStatus, string> = {
  open: 'bg-slate-100 text-slate-800 ring-1 ring-slate-200',
  in_progress: 'bg-blue-100 text-blue-900 ring-1 ring-blue-200',
  done: 'bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200',
}

const priorityClass = {
  high: 'bg-red-100 text-red-900',
  medium: 'bg-amber-100 text-amber-900',
} as const

function TaskRow({ task }: { task: VetTask }) {
  const [status, setStatus] = useState<VetTaskStatus>(() => loadTaskStatus(task.id, task.status))

  useEffect(() => {
    setStatus(loadTaskStatus(task.id, task.status))
  }, [task.id, task.status])

  const setStatusAndSave = (next: VetTaskStatus) => {
    const prev = status
    setStatus(next)
    saveTaskStatus(task.id, next)
    if (next === 'done' && prev !== 'done') {
      recordVetTaskDone(
        task.id,
        `${task.barn} · №${task.cow}`,
        task.issue,
        loadActiveVet(),
        new Date().toLocaleString('ru-RU'),
      )
    }
  }

  const detailTo = cowDetailPath(task.categoryId, task.cow)

  return (
    <li className="border-b border-slate-200 px-1 py-3 last:border-0 sm:px-0">
      <Link
        to={detailTo}
        className="group block rounded-lg px-2 py-1 outline-none hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-500/40"
      >
        <p className="font-semibold text-slate-900 group-hover:text-blue-900">
          {task.barn} · №{task.cow}
        </p>
        <p className="text-sm text-slate-600 group-hover:text-blue-800">{task.issue}</p>
        <p className="mt-1 hidden text-xs text-blue-700 sm:block">Открыть карточку коровы →</p>
      </Link>

      <div className="mt-2 flex flex-wrap items-center gap-2 px-2">
        <span className={`rounded px-2 py-0.5 text-xs font-semibold ${priorityClass[task.priority]}`}>
          {task.priority === 'high' ? 'Высокий' : 'Средний'}
        </span>
        <span className={`rounded px-2 py-0.5 text-xs font-medium ${statusBtnClass[status]}`}>
          {statusLabel[status]}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap gap-2 px-2 pb-1" role="group" aria-label="Сменить статус">
        {(['open', 'in_progress', 'done'] as const).map((s) => (
          <button
            key={s}
            type="button"
            title={statusLabel[s]}
            onClick={() => setStatusAndSave(s)}
            className={[
              'matrix-touch-btn !min-h-9 flex-1 rounded-lg px-2 py-2 text-xs font-semibold sm:flex-none sm:!min-h-0 sm:py-1 sm:text-[10px]',
              status === s ? 'bg-blue-700 text-white' : 'bg-white text-slate-700 ring-1 ring-slate-200',
            ].join(' ')}
          >
            {statusLabel[s]}
          </button>
        ))}
      </div>
    </li>
  )
}

export function VetTaskQueue() {
  return (
    <ul className="divide-y divide-slate-200 pb-2">
      {vetTasks.map((t) => (
        <TaskRow key={t.id} task={t} />
      ))}
    </ul>
  )
}
