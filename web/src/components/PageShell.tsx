import type { ReactNode } from 'react'
import { useDashboardFilters } from '../context/DashboardFiltersContext'
import type { QuarterId, YearId } from '../types/period'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { Breadcrumbs, type BreadcrumbItem } from './Breadcrumbs'
import { DataSourceStrip } from './DataSourceStrip'
import { APP_COPY } from '../lib/appCopy'
import { BrandWordmark } from './BrandWordmark'

export type { BreadcrumbItem }

type Props = {
  title: string
  subtitle?: string
  actions?: ReactNode
  breadcrumbs?: BreadcrumbItem[]
}

export function PageShell({ title, subtitle, actions, breadcrumbs }: Props) {
  const { year, quarter, setYear, setQuarter, periodLabel } = useDashboardFilters()
  const { user, logout } = useAuth()

  return (
    <div className="sticky top-0 z-20 border-b border-slate-200/90 bg-gradient-to-b from-white via-white to-slate-50/98 shadow-[0_1px_0_0_rgb(226_232_240/0.9),0_12px_40px_-28px_rgb(15_23_42/0.12)] backdrop-blur-md backdrop-saturate-150">
      <div className="mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4 lg:px-10">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <div className="min-w-0">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        ) : null}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <BrandWordmark variant="light" size="sm" tagline={null} linkToHome />
              <p className="inline-flex w-fit items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-800 ring-1 ring-emerald-700/15">
                {periodLabel}
              </p>
            </div>
            <h1 className="mt-2 text-xl font-bold tracking-[-0.02em] text-slate-900 lg:text-2xl lg:tracking-[-0.03em]">{title}</h1>
            {subtitle ? <p className="mt-1 max-w-3xl text-sm text-slate-600">{subtitle}</p> : null}
          </div>
          <div className="flex w-full min-w-0 flex-wrap items-center gap-2">
            <PeriodControls year={year} quarter={quarter} setYear={setYear} setQuarter={setQuarter} />
            {actions}
            <div className="ml-0 flex items-center gap-2 border-l border-slate-200 pl-3 lg:ml-2">
              {user ? (
                <>
                  <span className="hidden text-xs text-slate-500 sm:inline">{user.displayName}</span>
                  <button
                    type="button"
                    onClick={logout}
                    className="btn-ghost text-slate-700"
                  >
                    Выйти
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white shadow-sm shadow-emerald-900/10 hover:bg-emerald-800"
                >
                  Вход (демо)
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      <DataSourceStrip />
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
        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-800 shadow-sm"
        aria-label="Год"
      >
        <option value="2025">2025</option>
        <option value="2024">2024</option>
      </select>
      <select
        value={quarter}
        onChange={(e) => setQuarter(e.target.value as QuarterId)}
        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-800 shadow-sm"
        aria-label="Квартал"
      >
        <option value="all">Весь год</option>
        <option value="Q1">Q1</option>
        <option value="Q2">Q2</option>
        <option value="Q3">Q3</option>
        <option value="Q4">Q4</option>
      </select>
      <span className="hidden text-[11px] text-slate-400 sm:inline">{APP_COPY.quarterFilterNote}</span>
    </div>
  )
}
