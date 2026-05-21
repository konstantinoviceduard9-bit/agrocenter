import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { TaskShareBanner } from '../components/TaskShareBanner'
import { WidgetCard } from '../components/WidgetCard'
import { PageTitle } from '../components/MatrixLayout'
import {
  loadLeadershipTasks,
  roleById,
  staffMembers,
  staffRoles,
  type LeadershipTask,
  type StaffMember,
  type StaffRoleId,
} from '../data/staff'
import {
  appendLeadershipTask,
  subscribeLeadershipTasks,
  type TaskSharePayload,
} from '../lib/leadershipTasks'

function RoleBadge({ roleId }: { roleId: StaffRoleId }) {
  const r = roleById(roleId)
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${r.color}`}>
      {r.label}
    </span>
  )
}

function StaffCard({
  member,
  tasks,
  onAssign,
}: {
  member: StaffMember
  tasks: LeadershipTask[]
  onAssign: (employeeId: string, title: string) => void
}) {
  const [draft, setDraft] = useState('')
  const open = tasks.filter((t) => t.employeeId === member.id && t.status !== 'done')
  const role = roleById(member.roleId)

  return (
    <li
      className={[
        'rounded-xl border p-3 shadow-sm',
        member.active ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50 opacity-70',
      ].join(' ')}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-bold text-slate-900">{member.name}</p>
          <p className="mt-0.5 text-xs text-slate-500">
            {member.shift} · {member.phone}
          </p>
        </div>
        <RoleBadge roleId={member.roleId} />
      </div>
      <p className="mt-2 text-[11px] text-slate-600">
        В приложении: <strong>{role.appHint}</strong>
        {member.hasAppAccess ? (
          <span className="ml-2 text-emerald-700">· доступ выдан</span>
        ) : (
          <span className="ml-2 text-amber-700">· без приложения</span>
        )}
      </p>
      {open.length > 0 ? (
        <ul className="mt-2 space-y-1 text-xs">
          {open.map((t) => (
            <li key={t.id} className="rounded bg-blue-50 px-2 py-1 text-blue-900">
              {t.title}
              <span className="block text-[10px] text-blue-700/80">
                от {t.assignedBy} · до {t.dueDate}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-xs text-slate-500">Нет открытых задач от руководства</p>
      )}
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Новая задача от руководства…"
          className="matrix-touch-input min-w-0 flex-1 rounded-lg border border-slate-300 px-3 text-sm"
        />
        <button
          type="button"
          disabled={!draft.trim() || !member.active}
          onClick={() => {
            onAssign(member.id, draft.trim())
            setDraft('')
          }}
          className="matrix-touch-btn shrink-0 rounded-lg bg-blue-700 font-semibold text-white hover:bg-blue-800 disabled:opacity-40"
        >
          Назначить
        </button>
      </div>
    </li>
  )
}

export function StaffPage() {
  const [roleFilter, setRoleFilter] = useState<StaffRoleId | 'all'>('all')
  const [tasks, setTasks] = useState(loadLeadershipTasks)
  const [assigner, setAssigner] = useState('Сафин А.Р.')
  const [sharePayload, setSharePayload] = useState<TaskSharePayload | null>(null)

  useEffect(() => subscribeLeadershipTasks(() => setTasks(loadLeadershipTasks())), [])

  const filtered = useMemo(() => {
    if (roleFilter === 'all') return staffMembers
    return staffMembers.filter((m) => m.roleId === roleFilter)
  }, [roleFilter])

  const counts = useMemo(() => {
    const map = new Map<StaffRoleId, number>()
    for (const m of staffMembers) {
      if (!m.active) continue
      map.set(m.roleId, (map.get(m.roleId) ?? 0) + 1)
    }
    return map
  }, [])

  const assignTask = (employeeId: string, title: string) => {
    const dueDate = new Date().toLocaleDateString('ru-RU')
    const next: LeadershipTask = {
      id: `lt-${Date.now()}`,
      employeeId,
      title,
      assignedBy: assigner,
      dueDate,
      status: 'open',
      createdAt: new Date().toLocaleString('ru-RU'),
    }
    setTasks(appendLeadershipTask(next))
    setSharePayload({ employeeId, title, assignedBy: assigner, dueDate })
  }

  return (
    <>
      <PageTitle
        title="Сотрудники и роли"
        subtitle="Реестр персонала фермы: доярки, ветеринары, водители и др. Руководство назначает задачи — в мобильном приложении сотрудник увидит только свои (следующий этап)."
      />

      {sharePayload ? <TaskShareBanner payload={sharePayload} onDismiss={() => setSharePayload(null)} /> : null}

      <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm text-amber-950">
        <p className="font-semibold">Как задача попадёт на телефон (демо)</p>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-xs leading-relaxed">
          <li>
            <strong>Один телефон:</strong> назначайте здесь же в приложении «Матрикс» — сотрудник сразу увидит в «Мои задачи».
          </li>
          <li>
            <strong>Компьютер → телефон:</strong> после «Назначить» нажмите <strong>«Отправить ссылку»</strong> (WhatsApp / Telegram) —
            сотрудник откроет её на телефоне.
          </li>
          <li>Сервер и push — следующий этап (задачи без ссылки).</li>
        </ul>
      </div>

      <WidgetCard title="Роли на ферме">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {staffRoles.map((r) => (
            <div key={r.id} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs">
              <span className={`inline-block rounded-full px-2 py-0.5 font-bold ${r.color}`}>{r.label}</span>
              <span className="ml-2 tabular-nums text-slate-500">{counts.get(r.id) ?? 0} чел.</span>
              <p className="mt-1 text-slate-600">{r.appHint}</p>
            </div>
          ))}
        </div>
      </WidgetCard>

      <WidgetCard title="Назначение задач" className="mt-4">
        <label className="text-xs font-semibold text-slate-600">От имени руководства</label>
        <select
          value={assigner}
          onChange={(e) => setAssigner(e.target.value)}
          className="matrix-touch-input mt-1 max-w-xs rounded-lg border border-slate-300 px-3 text-sm"
        >
          {staffMembers.filter((m) => m.roleId === 'manager' || m.roleId === 'admin').map((m) => (
            <option key={m.id} value={m.name}>
              {m.name}
            </option>
          ))}
          <option value="Сафин А.Р.">Сафин А.Р.</option>
        </select>
      </WidgetCard>

      <WidgetCard title="Список сотрудников" className="mt-4">
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setRoleFilter('all')}
            className={[
              'matrix-touch-btn rounded-full px-3 py-1 text-xs font-semibold',
              roleFilter === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700',
            ].join(' ')}
          >
            Все ({staffMembers.length})
          </button>
          {staffRoles.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRoleFilter(r.id)}
              className={[
                'matrix-touch-btn rounded-full px-3 py-1 text-xs font-semibold',
                roleFilter === r.id ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700',
              ].join(' ')}
            >
              {r.shortLabel}
            </button>
          ))}
        </div>
        <ul className="grid gap-3 md:grid-cols-2">
          {filtered.map((m) => (
            <StaffCard key={m.id} member={m} tasks={tasks} onAssign={assignTask} />
          ))}
        </ul>
      </WidgetCard>

      <p className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
        <strong>Демо-вход:</strong> PIN <code className="font-mono">1</code> у всех — на странице входа выберите сотрудника из списка.{' '}
        <Link to="/login" className="font-medium text-blue-700 hover:underline">
          Войти как сотрудник →
        </Link>
      </p>

      <p className="mt-3 text-xs text-slate-600">
        <Link to="/tasks" className="font-medium text-blue-700 hover:underline">
          Задачи ветслужбы (Afimilk)
        </Link>
        {' · '}
        <Link to="/" className="font-medium text-blue-700 hover:underline">
          Пульт «Сегодня»
        </Link>
      </p>
    </>
  )
}
