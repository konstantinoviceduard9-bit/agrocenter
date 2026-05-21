import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { cowDetailPath } from '../data/cowDetail'
import {
  loadTaskStatus,
  saveTaskStatus,
  vetTasks,
  type VetTask,
  type VetTaskStatus,
} from '../data/vetTasks'

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
    setStatus(next)
    saveTaskStatus(task.id, next)
  }

  const detailTo = cowDetailPath(task.categoryId, task.cow)

  return (
    <li className="border-b border-slate-200 last:border-0">
      <div className="flex flex-wrap items-center gap-2 py-3 sm:flex-nowrap">
        <Link
          to={detailTo}
          className="group min-w-0 flex-1 rounded-lg px-2 py-1 outline-none transition-colors hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-500/40"
        >
          <p className="font-semibold text-slate-900 group-hover:text-blue-900">
            {task.barn} · №{task.cow}
          </p>
          <p className="text-sm text-slate-600 group-hover:text-blue-800">{task.issue}</p>
          <p className="mt-1 text-xs text-blue-700 opacity-0 transition-opacity group-hover:opacity-100">
            Открыть карточку коровы →
          </p>
        </Link>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <span className={`rounded px-2 py-0.5 text-xs font-semibold ${priorityClass[task.priority]}`}>
            {task.priority === 'high' ? 'Высокий' : 'Средний'}
          </span>
          <span className={`rounded px-2 py-0.5 text-xs font-medium ${statusBtnClass[status]}`}>
            {statusLabel[status]}
          </span>
        </div>

        <div className="flex w-full shrink-0 flex-wrap gap-1 sm:w-auto" role="group" aria-label="Сменить статус">
          {(['open', 'in_progress', 'done'] as const).map((s) => (
            <button
              key={s}
              type="button"
              title={statusLabel[s]}
              onClick={() => setStatusAndSave(s)}
              className={[
                'rounded px-2 py-1 text-[10px] font-semibold uppercase tracking-wide',
                status === s ? 'bg-blue-700 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50',
              ].join(' ')}
            >
              {s === 'open' ? 'Откр.' : s === 'in_progress' ? 'В раб.' : 'Готово'}
            </button>
          ))}
        </div>
      </div>
    </li>
  )
}

export function VetTaskQueue() {
  return (
    <ul className="divide-y divide-slate-200">
      {vetTasks.map((t) => (
        <TaskRow key={t.id} task={t} />
      ))}
    </ul>
  )
}
