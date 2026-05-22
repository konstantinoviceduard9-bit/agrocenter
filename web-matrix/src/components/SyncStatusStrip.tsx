import { syncMode } from '../lib/matrixSync'

export function SyncStatusStrip() {
  const mode = syncMode()
  if (mode === 'cloud') {
    return (
      <p className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-900">
        <strong>Синхронизация включена.</strong> Задачи и уведомления по ролям доставляются на все телефоны автоматически.
      </p>
    )
  }
  return (
    <p className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] leading-snug text-amber-950 sm:text-xs">
      <strong>Демо:</strong> задачи и уведомления сохраняются в этом браузере. Для показа — один телефон или ссылки; сервер позже.
    </p>
  )
}
