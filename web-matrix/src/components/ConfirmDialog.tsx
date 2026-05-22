import type { ReactNode } from 'react'

type Props = {
  open: boolean
  title: string
  children: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel = 'Подтвердить',
  cancelLabel = 'Отмена',
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/45 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="matrix-dialog-safe w-full max-w-md rounded-2xl bg-white p-4 shadow-xl">
        <h2 id="confirm-dialog-title" className="text-base font-bold text-slate-900">
          {title}
        </h2>
        <div className="mt-2 text-sm leading-relaxed text-slate-600">{children}</div>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row-reverse">
          <button
            type="button"
            onClick={onConfirm}
            className="matrix-touch-btn rounded-xl bg-blue-700 px-4 py-3 font-bold text-white hover:bg-blue-800"
          >
            {confirmLabel}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="matrix-touch-btn rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
