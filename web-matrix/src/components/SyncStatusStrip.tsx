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
    <p className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
      <strong>Демо без сервера:</strong> уведомления по ролям работают на <strong>одном устройстве</strong>. Для автоматической
      доставки ПК ↔ телефон подключите Supabase — см. <code className="text-[10px]">docs/neral-matrix-sync-supabase.md</code>
    </p>
  )
}
