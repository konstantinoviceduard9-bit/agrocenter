import { useEffect, useMemo, useState } from 'react'
import { useStaffAuth } from '../hooks/useStaffAuth'
import { viewerSeesNotification } from '../lib/notificationRouting'
import {
  loadManagerNotifications,
  markAllManagerNotificationsRead,
  subscribeManagerNotifications,
  type AppNotification,
} from '../lib/managerNotifications'

const kindLabel = {
  task_assigned: 'Назначена',
  task_completed: 'Выполнена',
} as const

export function ManagerNotificationsPanel() {
  const { employee } = useStaffAuth()
  const [list, setList] = useState(loadManagerNotifications)

  useEffect(() => subscribeManagerNotifications(() => setList(loadManagerNotifications())), [])

  const visible = useMemo(
    () => list.filter((n) => viewerSeesNotification(n, employee)),
    [list, employee],
  )
  const unread = visible.filter((n) => !n.read)

  if (visible.length === 0) {
    return (
      <p className="text-sm text-slate-600">
        {employee
          ? 'Нет уведомлений для вашей роли. Назначения и выполнения других сотрудников видят руководители.'
          : 'Пока нет уведомлений. Войдите как руководитель или включите синхронизацию Supabase.'}
      </p>
    )
  }

  return (
    <div>
      {unread.length > 0 ? (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-emerald-800">Новых: {unread.length}</p>
          <button
            type="button"
            onClick={() => {
              markAllManagerNotificationsRead()
              setList(loadManagerNotifications())
            }}
            className="matrix-touch-btn rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700"
          >
            Прочитать все
          </button>
        </div>
      ) : null}
      <ul className="max-h-48 space-y-2 overflow-y-auto">
        {visible.slice(0, 20).map((n) => (
          <NotificationRow key={n.id} note={n} />
        ))}
      </ul>
    </div>
  )
}

function NotificationRow({ note }: { note: AppNotification }) {
  return (
    <li
      className={[
        'rounded-lg border px-3 py-2 text-sm',
        note.read ? 'border-slate-200 bg-slate-50 text-slate-600' : 'border-emerald-200 bg-emerald-50 text-emerald-950',
      ].join(' ')}
    >
      <p className="font-semibold">
        {!note.read ? '● ' : '✓ '}
        {kindLabel[note.kind]} · {note.employeeName}
      </p>
      <p className="mt-0.5">{note.taskTitle}</p>
      <p className="mt-1 text-[10px] opacity-80">
        {note.createdAt} · назначил {note.assignedBy}
        {note.targetRoles?.length ? ` · роли: ${note.targetRoles.join(', ')}` : ''}
      </p>
    </li>
  )
}
