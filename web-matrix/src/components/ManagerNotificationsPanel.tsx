import { useEffect, useState } from 'react'
import {
  loadManagerNotifications,
  markAllManagerNotificationsRead,
  subscribeManagerNotifications,
  type ManagerNotification,
} from '../lib/managerNotifications'

export function ManagerNotificationsPanel() {
  const [list, setList] = useState(loadManagerNotifications)
  const unread = list.filter((n) => !n.read)

  useEffect(() => subscribeManagerNotifications(() => setList(loadManagerNotifications())), [])

  if (list.length === 0) {
    return (
      <p className="text-sm text-slate-600">Пока нет отметок «выполнено» от сотрудников.</p>
    )
  }

  return (
    <div>
      {unread.length > 0 ? (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-emerald-800">
            Новых: {unread.length}
          </p>
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
        {list.slice(0, 20).map((n) => (
          <NotificationRow key={n.id} note={n} />
        ))}
      </ul>
    </div>
  )
}

function NotificationRow({ note }: { note: ManagerNotification }) {
  return (
    <li
      className={[
        'rounded-lg border px-3 py-2 text-sm',
        note.read ? 'border-slate-200 bg-slate-50 text-slate-600' : 'border-emerald-200 bg-emerald-50 text-emerald-950',
      ].join(' ')}
    >
      <p className="font-semibold">
        {note.read ? '✓ ' : '● '}
        {note.employeeName}
      </p>
      <p className="mt-0.5">{note.taskTitle}</p>
      <p className="mt-1 text-[10px] opacity-80">
        {note.completedAt} · назначил {note.assignedBy}
      </p>
    </li>
  )
}
