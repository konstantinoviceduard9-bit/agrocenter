import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { MATRIX_COPY } from '../lib/appCopy'
import { groupDashboardHref } from '../lib/dashboardLinks'
import { farmMeta } from '../data/matrixMocks'
import { DataStrip } from './DataStrip'

const navItem = ({ isActive }: { isActive: boolean }) =>
  [
    'flex items-center gap-2 rounded px-2 py-1.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-400',
    isActive ? 'bg-blue-100 font-semibold text-blue-900' : 'text-slate-700 hover:bg-slate-100',
  ].join(' ')

const tabItem = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-t px-4 py-2 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
    isActive
      ? 'border border-b-white border-slate-300 bg-white text-blue-800 -mb-px relative z-10'
      : 'border border-transparent bg-slate-200/80 text-slate-600 hover:bg-slate-100',
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

const sidebarSections: { heading: string; links: { to: string; end?: boolean; label: string }[] }[] = [
  {
    heading: 'Сегодня',
    links: [
      { to: '/', end: true, label: 'Пульт «Сегодня»' },
      { to: '/milking', label: 'Дойка' },
    ],
  },
  {
    heading: 'Стадо и здоровье',
    links: [
      { to: '/tasks', label: 'Задачи ветслужбы' },
      { to: '/feeding', label: 'Кормление (DTM)' },
    ],
  },
  {
    heading: 'Прочее',
    links: [
      { to: '/machines', label: 'Машины (Аксента)' },
    ],
  },
]

export function MatrixLayout() {
  const location = useLocation()
  const [navOpen, setNavOpen] = useState(false)

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
        <nav className="flex gap-0.5 overflow-x-auto border-t border-blue-900/25 px-2 pb-0 pt-1" aria-label="Вкладки">
          <NavLink to="/" end className={tabItem}>
            Сегодня
          </NavLink>
          <NavLink to="/milking" className={tabItem}>
            Дойка
          </NavLink>
          <NavLink to="/feeding" className={tabItem}>
            Кормление
          </NavLink>
          <NavLink to="/tasks" className={tabItem}>
            Задачи
          </NavLink>
          <NavLink to="/machines" className={tabItem}>
            Машины
          </NavLink>
        </nav>
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
            'fixed inset-y-0 left-0 z-50 flex w-56 flex-col border-r border-slate-300 bg-[#f4f5f7] pt-[7.5rem] shadow-xl transition-transform lg:static lg:z-0 lg:w-52 lg:shrink-0 lg:translate-x-0 lg:pt-0 lg:shadow-none',
            navOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          ].join(' ')}
        >
          <nav className="flex-1 overflow-y-auto p-2 text-sm">
            {sidebarSections.map((sec) => (
              <div key={sec.heading} className="mb-3">
                <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">{sec.heading}</p>
                {sec.links.map((link) => (
                  <NavLink key={link.to} to={link.to} end={link.end} className={navItem} onClick={() => setNavOpen(false)}>
                    {link.label}
                  </NavLink>
                ))}
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
