import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { MATRIX_COPY } from '../lib/appCopy'
import { groupDashboardHref } from '../lib/dashboardLinks'
import { matrixNavSections, navLabelForPath } from '../lib/matrixNav'
import { farmMeta } from '../data/matrixMocks'
import { DataStrip } from './DataStrip'

const navItem = ({ isActive }: { isActive: boolean }) =>
  [
    'group flex flex-col gap-0.5 rounded-lg px-2.5 py-2 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-blue-400',
    isActive
      ? 'border-l-[3px] border-blue-700 bg-blue-50 pl-[calc(0.625rem-3px)] font-semibold text-blue-900 shadow-sm'
      : 'border-l-[3px] border-transparent text-slate-700 hover:bg-slate-100',
  ].join(' ')

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      {open ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      )}
    </svg>
  )
}

export function MatrixLayout() {
  const location = useLocation()
  const [navOpen, setNavOpen] = useState(false)
  const currentLabel = navLabelForPath(location.pathname)

  useEffect(() => {
    setNavOpen(false)
  }, [location.pathname])

  return (
    <div className="flex min-h-dvh flex-col bg-[#e8eaed] text-slate-900">
      <header className="shrink-0 border-b border-blue-900/30 bg-gradient-to-r from-blue-800 to-blue-700 text-white shadow-md">
        <div className="flex items-center justify-between gap-3 px-3 py-2 lg:px-4">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              className="rounded p-1.5 hover:bg-white/10 lg:hidden"
              aria-expanded={navOpen}
              aria-controls="matrix-sidebar"
              onClick={() => setNavOpen((o) => !o)}
            >
              <span className="sr-only">Меню</span>
              <MenuIcon open={navOpen} />
            </button>
            <div className="min-w-0">
              <p className="truncate text-xs text-blue-100/90">
                {farmMeta.siteCode} · {farmMeta.afifarmVersion}
              </p>
              <h1 className="truncate text-base font-bold tracking-tight sm:text-lg">{MATRIX_COPY.farmName}</h1>
              <p className="truncate text-[11px] text-blue-100/80 lg:hidden">{currentLabel}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 text-xs sm:text-sm">
            <button
              type="button"
              className="hidden rounded border border-white/25 bg-white/10 px-3 py-1.5 font-medium hover:bg-white/20 sm:inline"
            >
              {MATRIX_COPY.syncLabel}
            </button>
            <span className="rounded bg-white/15 px-2 py-1 font-medium">Забиров Г.</span>
          </div>
        </div>
      </header>

      <DataStrip />

      <div className="border-b border-emerald-200/90 bg-gradient-to-r from-emerald-50 to-slate-50 px-4 py-2 text-sm text-slate-800">
        <span className="font-semibold text-emerald-900">Пульт фермы «Нерал-Матрикс»</span>
        <span className="mx-2 text-slate-400">·</span>
        Финансы группы (выручка, касса, юрлица) — в{' '}
        <a
          href={groupDashboardHref()}
          className="font-semibold text-emerald-800 underline decoration-emerald-500/70 underline-offset-2 hover:text-emerald-950"
        >
          дашборде финансов
        </a>
        .
      </div>

      <div className="relative flex min-h-0 flex-1">
        {navOpen ? (
          <button
            type="button"
            aria-label="Закрыть меню"
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setNavOpen(false)}
          />
        ) : null}

        <aside
          id="matrix-sidebar"
          className={[
            'fixed inset-y-0 left-0 z-50 flex w-[min(18rem,88vw)] flex-col border-r border-slate-300 bg-[#f4f5f7] shadow-xl transition-transform lg:static lg:z-0 lg:w-60 lg:shrink-0 lg:translate-x-0 lg:shadow-none',
            navOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          ].join(' ')}
          style={{ top: navOpen ? 0 : undefined }}
        >
          <div className="border-b border-slate-200 bg-white/80 px-3 py-3 lg:py-4">
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Раздел</p>
            <p className="mt-0.5 text-sm font-bold text-slate-800">{currentLabel}</p>
          </div>

          <nav className="flex-1 overflow-y-auto p-2 text-sm" aria-label="Навигация по пульту">
            {matrixNavSections.map((sec) => (
              <div key={sec.heading} className="mb-4">
                <p className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">{sec.heading}</p>
                <ul className="space-y-0.5">
                  {sec.links.map((link) => (
                    <li key={link.to}>
                      <NavLink to={link.to} end={link.end} className={navItem} onClick={() => setNavOpen(false)}>
                        <span className="flex items-center justify-between gap-2">
                          <span>{link.label}</span>
                          {link.badge != null && link.badge > 0 ? (
                            <span className="rounded-full bg-blue-700 px-1.5 py-0.5 text-[10px] font-bold text-white tabular-nums">
                              {link.badge}
                            </span>
                          ) : null}
                        </span>
                        <span className="text-[11px] font-normal leading-snug text-slate-500 group-hover:text-slate-600">
                          {link.hint}
                        </span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <p className="border-t border-slate-300 px-3 py-2 text-[10px] leading-snug text-slate-500">{MATRIX_COPY.lastSync}</p>
        </aside>

        <main id="matrix-main" className="min-h-0 min-w-0 flex-1 overflow-auto p-3 sm:p-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export function PageTitle({ title, subtitle }: { title: string; subtitle?: ReactNode }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-bold text-slate-800">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}
    </div>
  )
}
