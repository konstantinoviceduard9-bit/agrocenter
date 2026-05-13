import type { ReactNode } from 'react'
import { useDashboardFilters } from '../context/DashboardFiltersContext'
import type { QuarterId, YearId } from '../types/period'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

type Props = {
  title: string
  subtitle?: string
  actions?: ReactNode
}

export function PageShell({ title, subtitle, actions }: Props) {
  const { year, quarter, setYear, setQuarter, periodLabel } = useDashboardFilters()
  const { user, logout } = useAuth()

  return (
    <div className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">{periodLabel}</p>
          <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900 lg:text-2xl">{title}</h1>
          {subtitle ? <p className="mt-1 max-w-3xl text-sm text-slate-600">{subtitle}</p> : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <PeriodControls year={year} quarter={quarter} setYear={setYear} setQuarter={setQuarter} />
          {actions}
          <div className="ml-0 flex items-center gap-2 border-l border-slate-200 pl-3 lg:ml-2">
            {user ? (
              <>
                <span className="hidden text-xs text-slate-500 sm:inline">{user.displayName}</span>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Выйти
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800"
              >
                Вход (демо)
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function PeriodControls({
  year,
  quarter,
  setYear,
  setQuarter,
}: {
  year: YearId
  quarter: QuarterId
  setYear: (y: YearId) => void
  setQuarter: (q: QuarterId) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={year}
        onChange={(e) => setYear(e.target.value as YearId)}
        className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-800"
        aria-label="Год"
      >
        <option value="2025">2025</option>
        <option value="2024">2024</option>
      </select>
      <select
        value={quarter}
        onChange={(e) => setQuarter(e.target.value as QuarterId)}
        className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-800"
        aria-label="Квартал"
      >
        <option value="all">Весь год</option>
        <option value="Q1">Q1</option>
        <option value="Q2">Q2</option>
        <option value="Q3">Q3</option>
        <option value="Q4">Q4</option>
      </select>
      <span className="hidden text-[11px] text-slate-400 sm:inline">Квартал в моке пока не режет цифры — только подпись.</span>
    </div>
  )
}
