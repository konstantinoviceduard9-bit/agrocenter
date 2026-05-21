import { useState } from 'react'
import { myTasksShareUrl, type TaskSharePayload } from '../lib/leadershipTasks'
import { staffMemberById } from '../data/staff'

type Props = {
  payload: TaskSharePayload
  onDismiss: () => void
}

export function TaskShareBanner({ payload, onDismiss }: Props) {
  const [copied, setCopied] = useState(false)
  const url = myTasksShareUrl(payload)
  const name = staffMemberById(payload.employeeId)?.name ?? 'сотрудник'

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Задача · Матрикс',
          text: `${payload.title} — откройте на телефоне`,
          url,
        })
        return
      } catch {
        /* cancelled */
      }
    }
    void copy()
  }

  return (
    <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
      <p className="font-bold">Задача сохранена на этом устройстве</p>
      <p className="mt-1 text-xs leading-relaxed">
        Телефон сотрудника (<strong>{name}</strong>) не видит задачи с компьютера автоматически (демо без сервера).
        Отправьте ссылку — откроется в приложении «Мои задачи»:
      </p>
      <p className="mt-2 break-all rounded bg-white/80 px-2 py-1 font-mono text-[10px] text-slate-700">{url}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void share()}
          className="matrix-touch-btn rounded-lg bg-amber-700 px-3 font-semibold text-white hover:bg-amber-800"
        >
          Отправить ссылку
        </button>
        <button
          type="button"
          onClick={() => void copy()}
          className="matrix-touch-btn rounded-lg border border-amber-400 bg-white px-3 font-semibold text-amber-900"
        >
          {copied ? 'Скопировано' : 'Копировать'}
        </button>
        <button type="button" onClick={onDismiss} className="matrix-touch-btn rounded-lg px-3 text-xs font-semibold text-amber-800">
          Закрыть
        </button>
      </div>
    </div>
  )
}
