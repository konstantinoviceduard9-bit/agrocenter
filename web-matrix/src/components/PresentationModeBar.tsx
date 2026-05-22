import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  isPresentationMode,
  seedPresentationDemo,
  setPresentationMode,
  subscribePresentationMode,
} from '../lib/presentationMode'

export function PresentationModeBar() {
  const [on, setOn] = useState(isPresentationMode)

  useEffect(() => subscribePresentationMode(() => setOn(isPresentationMode())), [])

  if (!on) {
    return (
      <div className="border-b border-slate-200 bg-slate-50 px-3 py-2 sm:px-4">
        <button
          type="button"
          onClick={() => {
            setPresentationMode(true)
            seedPresentationDemo()
          }}
          className="matrix-touch-btn w-full rounded-xl bg-emerald-700 text-sm font-bold text-white hover:bg-emerald-800 sm:w-auto"
        >
          Режим показа руководству
        </button>
      </div>
    )
  }

  return (
    <div className="border-b border-emerald-300 bg-gradient-to-r from-emerald-700 to-emerald-600 px-3 py-2 text-white sm:px-4">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-xs font-semibold sm:text-sm">
          <span className="mr-1.5 inline-block rounded bg-white/20 px-1.5 py-0.5 text-[10px] uppercase tracking-wide">
            Показ
          </span>
          Сценарий для совета · данные демо
        </p>
        <div className="ml-auto flex flex-wrap gap-2">
          <Link
            to="/staff#reports"
            className="rounded-lg bg-white/15 px-2.5 py-1 text-xs font-semibold hover:bg-white/25"
          >
            Отчёты
          </Link>
          <Link
            to="/staff"
            className="rounded-lg bg-white/15 px-2.5 py-1 text-xs font-semibold hover:bg-white/25"
          >
            Персонал
          </Link>
          <button
            type="button"
            onClick={() => {
              seedPresentationDemo()
              window.dispatchEvent(new Event('matrix-work-reports-changed'))
            }}
            className="rounded-lg bg-white/15 px-2.5 py-1 text-xs font-semibold hover:bg-white/25"
          >
            Обновить демо
          </button>
          <button
            type="button"
            onClick={() => setPresentationMode(false)}
            className="rounded-lg border border-white/40 px-2.5 py-1 text-xs font-semibold hover:bg-white/10"
          >
            Выйти
          </button>
        </div>
      </div>
    </div>
  )
}
