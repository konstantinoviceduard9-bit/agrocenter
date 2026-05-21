import { useState } from 'react'
import { staffNotifyShareUrl, type CompletionSharePayload } from '../lib/managerNotifications'

type Props = {
  payload: CompletionSharePayload
  onDismiss: () => void
}

export function CompletionShareBanner({ payload, onDismiss }: Props) {
  const [copied, setCopied] = useState(false)
  const url = staffNotifyShareUrl(payload)

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
          title: 'Выполнено · Матрикс',
          text: `${payload.employeeName} выполнил(а): ${payload.taskTitle}`,
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
    <div className="mb-3 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-950">
      <p className="font-bold">Руководство уведомлено на этом устройстве</p>
      <p className="mt-1 text-xs leading-relaxed">
        Если руководитель на <strong>другом телефоне</strong> — отправьте ссылку, чтобы увидел в разделе «Сотрудники»:
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void share()}
          className="matrix-touch-btn rounded-lg bg-emerald-700 px-3 font-semibold text-white"
        >
          Сообщить руководству
        </button>
        <button
          type="button"
          onClick={() => void copy()}
          className="matrix-touch-btn rounded-lg border border-emerald-400 bg-white px-3 font-semibold"
        >
          {copied ? 'Скопировано' : 'Копировать'}
        </button>
        <button type="button" onClick={onDismiss} className="matrix-touch-btn px-3 text-xs font-semibold">
          Закрыть
        </button>
      </div>
    </div>
  )
}
