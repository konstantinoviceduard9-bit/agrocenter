import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { VetTaskQueue } from '../components/VetTaskQueue'
import { WidgetCard } from '../components/WidgetCard'
import { PageTitle } from '../components/MatrixLayout'
import { useStaffAuth } from '../context/StaffAuthContext'
import { loadLeadershipTasks, roleById, type LeadershipTask } from '../data/staff'
import {
  decodeTaskShare,
  mergeLeadershipTask,
  saveLeadershipTasks,
  subscribeLeadershipTasks,
  taskFromSharePayload,
} from '../lib/leadershipTasks'

type TaskStatus = LeadershipTask['status']

const statusLabel: Record<TaskStatus, string> = {
  open: 'Новая',
  in_progress: 'В работе',
  done: 'Выполнена',
}

function LeadershipTaskRow({
  task,
  onStatus,
}: {
  task: LeadershipTask
  onStatus: (id: string, status: TaskStatus) => void
}) {
  return (
    <li className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <p className="font-semibold text-slate-900">{task.title}</p>
      <p className="mt-1 text-xs text-slate-500">
        от {task.assignedBy} · до {task.dueDate} · {task.createdAt}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {(['open', 'in_progress', 'done'] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onStatus(task.id, s)}
            className={[
              'matrix-touch-btn rounded-lg px-2 py-1 text-xs font-semibold',
              task.status === s ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-700',
            ].join(' ')}
          >
            {statusLabel[s]}
          </button>
        ))}
      </div>
    </li>
  )
}

export function MyTasksPage() {
  const { employee, isLoggedIn } = useStaffAuth()
  const [tasks, setTasks] = useState(loadLeadershipTasks)
  const [importedTitle, setImportedTitle] = useState<string | null>(null)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => subscribeLeadershipTasks(() => setTasks(loadLeadershipTasks())), [])

  useEffect(() => {
    const encoded = searchParams.get('add')
    if (!encoded) return
    const payload = decodeTaskShare(encoded)
    if (payload) {
      const task = taskFromSharePayload(payload)
      mergeLeadershipTask(task)
      setTasks(loadLeadershipTasks())
      setImportedTitle(task.title)
      setTimeout(() => setImportedTitle(null), 5000)
    }
    navigate('/my-tasks', { replace: true })
  }, [searchParams, navigate])

  const mine = useMemo(() => {
    if (!employee) return []
    const list = tasks.filter((t) => t.employeeId === employee.id)
    return [...list].sort((a, b) => {
      if (a.status === 'done' && b.status !== 'done') return 1
      if (b.status === 'done' && a.status !== 'done') return -1
      return 0
    })
  }, [tasks, employee])

  const openCount = mine.filter((t) => t.status !== 'done').length

  const updateStatus = (id: string, status: TaskStatus) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, status } : t))
    setTasks(updated)
    saveLeadershipTasks(updated)
  }

  const showVetQueue = employee?.roleId === 'vet'

  if (!isLoggedIn || !employee) {
    return (
      <>
        <PageTitle
          title="Мои задачи"
          subtitle="Войдите как сотрудник, чтобы видеть назначения от руководства только для вас."
        />
        <Link
          to="/login"
          className="matrix-touch-btn inline-flex rounded-xl bg-blue-700 px-4 py-3 font-bold text-white hover:bg-blue-800"
        >
          Войти по PIN
        </Link>
      </>
    )
  }

  const role = roleById(employee.roleId)

  return (
    <>
      <PageTitle
        title="Мои задачи"
        subtitle={
          <>
            {employee.name} · <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${role.color}`}>{role.label}</span>
            {openCount > 0 ? (
              <span className="ml-2 font-semibold text-blue-800">{openCount} открытых</span>
            ) : (
              <span className="ml-2 text-slate-500">все выполнены</span>
            )}
          </>
        }
      />

      {importedTitle ? (
        <p className="mb-3 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-900">
          Получена новая задача: {importedTitle}
        </p>
      ) : null}

      <WidgetCard title="От руководства">
        {mine.length === 0 ? (
          <p className="text-sm text-slate-600">Пока нет назначений. Руководство добавляет их в разделе «Сотрудники».</p>
        ) : (
          <ul className="space-y-3">
            {mine.map((t) => (
              <LeadershipTaskRow key={t.id} task={t} onStatus={updateStatus} />
            ))}
          </ul>
        )}
      </WidgetCard>

      {showVetQueue ? (
        <WidgetCard title="Очередь ветслужбы (Afimilk)" className="mt-4" footer="Общая очередь фермы для ветеринара">
          <VetTaskQueue />
        </WidgetCard>
      ) : null}

      {employee.roleId === 'milker' ? (
        <p className="mt-4 text-xs text-slate-600">
          <Link to="/milking" className="font-medium text-blue-700 hover:underline">
            Текущая дойка →
          </Link>
        </p>
      ) : null}
      {employee.roleId === 'driver' || employee.roleId === 'mechanic' ? (
        <p className="mt-4 text-xs text-slate-600">
          <Link to="/machines" className="font-medium text-blue-700 hover:underline">
            Машины · Аксента →
          </Link>
        </p>
      ) : null}
      {employee.roleId === 'zootech' || employee.roleId === 'agronomist' ? (
        <p className="mt-4 text-xs text-slate-600">
          <Link to="/feeding" className="font-medium text-blue-700 hover:underline">
            Кормление · DTM →
          </Link>
        </p>
      ) : null}
    </>
  )
}
