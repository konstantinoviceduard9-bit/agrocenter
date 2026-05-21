import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useDashboardData, type DashboardDataSource } from '../context/DashboardDataContext'
import { APP_COPY } from '../lib/appCopy'
import { BrandWordmark } from './BrandWordmark'
import { CrossDashboardStrip } from './CrossDashboardStrip'
import { matrixFarmHref } from '../lib/dashboardLinks'

const item = ({ isActive }: { isActive: boolean }) =>
  [
    'block rounded-lg px-3 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
    isActive ? 'bg-emerald-600/20 text-emerald-200' : 'text-slate-300 hover:bg-slate-800 hover:text-white',
  ].join(' ')

function NavHeading({ children }: { children: ReactNode }) {
  return <p className="px-3 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">{children}</p>
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      {open ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      )}
    </svg>
  )
}

function SidebarHeader({
  dataSource,
  loadError,
  loadWarnings,
}: {
  dataSource: DashboardDataSource
  loadError: string | null
  loadWarnings: string[]
}) {
  return (
    <div className="border-b border-slate-800/80 bg-slate-950/20 px-4 py-4 lg:py-5">
      <div className="flex items-start justify-between gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-600 to-emerald-900 text-white shadow-lg shadow-emerald-950/50 ring-1 ring-white/15"
          aria-hidden
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 20V10M12 20V4M18 20v-8" />
          </svg>
        </div>
        <span
          className={[
            'shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ring-1',
            dataSource === 'file'
              ? 'bg-emerald-500/15 text-emerald-200 ring-emerald-400/25'
              : 'bg-slate-600/40 text-slate-200 ring-white/10',
          ].join(' ')}
        >
          {dataSource === 'file' ? 'Снимок JSON' : 'Моки'}
        </span>
      </div>
      <BrandWordmark variant="dark" size="md" tagline="Финансы группы" className="mt-4" />

      <div className="mt-4 space-y-0 rounded-xl border border-white/10 bg-slate-800/35 p-3 shadow-[inset_0_1px_0_0_rgb(255_255_255/0.04)] ring-1 ring-black/20">
        <div className="flex gap-3">
          <span
            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/20"
            aria-hidden
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
              />
            </svg>
          </span>
          <div className="min-w-0 flex-1 space-y-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Интерфейс</p>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-300">
                Только финансы: сводка, касса, дебиторка, юрлица. Операции фермы — в пульте Матрикс.
              </p>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Данные</p>
              {dataSource === 'file' ? (
                <div className="mt-1.5 space-y-1">
                  <p className="text-[11px] text-slate-400">Активен файл снимка (накладывается на моки):</p>
                  <code className="block break-all rounded-lg bg-slate-950/55 px-2.5 py-2 font-mono text-[10px] leading-snug text-emerald-200/95 ring-1 ring-emerald-500/20">
                    public/data/dashboard.snapshot.json
                  </code>
                </div>
              ) : (
                <p className="mt-1 text-xs leading-relaxed text-slate-300">
                  Встроенные демо-данные в коде. JSON-снимок не подключён.
                </p>
              )}
            </div>
            <p className="text-[11px] leading-snug text-slate-500">{APP_COPY.dataModeSidebar}</p>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              <span className="inline-flex items-center rounded-md bg-slate-900/70 px-2 py-1 text-[10px] font-medium text-slate-400 ring-1 ring-white/8">
                API — в дорожной карте
              </span>
            </div>
          </div>
        </div>
      </div>

      {loadError ? (
        <div
          className="mt-3 rounded-xl border border-amber-600/35 bg-amber-950/35 px-3 py-2.5 text-[11px] leading-snug text-amber-50 ring-1 ring-amber-500/15"
          role="alert"
        >
          <p className="font-semibold text-amber-200/95">Снимок не применён</p>
          <p className="mt-1 text-amber-100/90">{loadError}</p>
          <p className="mt-1.5 text-amber-200/80">Показаны встроенные моки.</p>
        </div>
      ) : null}
      {!loadError && loadWarnings.length > 0 ? (
        <div className="mt-3 rounded-xl border border-slate-600/60 bg-slate-800/60 px-3 py-2.5 text-[11px] leading-snug text-slate-200 ring-1 ring-white/5">
          <p className="font-semibold text-slate-300">Предупреждения снимка ({loadWarnings.length})</p>
          <p className="mt-1 text-slate-400">
            {loadWarnings.slice(0, 2).join(' · ')}
            {loadWarnings.length > 2 ? '…' : ''}
          </p>
        </div>
      ) : null}
    </div>
  )
}

export function Layout() {
  const { companies, dataSource, loadError, loadWarnings } = useDashboardData()
  const location = useLocation()
  const [navOpen, setNavOpen] = useState(false)

  useEffect(() => {
    setNavOpen(false)
  }, [location.pathname, location.search])

  const closeNav = () => setNavOpen(false)

  return (
    <div className="relative flex min-h-dvh w-full max-w-[100vw] flex-col bg-slate-100 antialiased text-slate-900 lg:min-h-full lg:flex-row">
      <a
        href="#app-main"
        className="absolute left-4 top-0 z-[100] -translate-y-[200%] rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-lg transition-transform focus:translate-y-4 focus:outline-none focus:ring-2 focus:ring-white/80"
      >
        К основному содержимому
      </a>
      <header className="sticky top-0 z-40 flex shrink-0 items-center justify-between gap-2 border-b border-slate-800 bg-slate-900 px-3 py-2.5 pt-[max(0.625rem,env(safe-area-inset-top))] text-white lg:hidden">
        <button
          type="button"
          className="rounded-lg p-2 text-slate-200 outline-none hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          aria-expanded={navOpen}
          aria-controls="app-sidebar"
          onClick={() => setNavOpen((o) => !o)}
        >
          <span className="sr-only">{navOpen ? 'Закрыть меню' : 'Открыть меню'}</span>
          <MenuIcon open={navOpen} />
        </button>
        <span className="flex min-w-0 flex-1 justify-center overflow-hidden px-1">
          <BrandWordmark variant="dark" size="sm" tagline={null} className="mx-auto min-w-0 shrink" />
        </span>
        <NavLink
          to="/"
          end
          className="shrink-0 rounded-md px-2 py-1.5 text-xs font-medium text-emerald-300 outline-none hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          onClick={closeNav}
        >
          Сводка
        </NavLink>
      </header>

      {navOpen ? (
        <button
          type="button"
          aria-label="Закрыть меню"
          className="fixed inset-0 z-[45] bg-black/50 motion-reduce:transition-none lg:hidden"
          onClick={closeNav}
        />
      ) : null}

      <aside
        id="app-sidebar"
        className={`fixed inset-y-0 left-0 flex w-[min(20rem,90vw)] max-w-[calc(100vw-1rem)] flex-col border-r border-slate-800/80 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-slate-200 shadow-xl transition-transform duration-200 ease-out will-change-transform motion-reduce:transition-none lg:static lg:z-0 lg:w-64 lg:max-w-none lg:shrink-0 lg:translate-x-0 lg:shadow-none ${
          navOpen
            ? 'z-[60] translate-x-0 pointer-events-auto'
            : 'z-0 -translate-x-full pointer-events-none lg:pointer-events-auto'
        }`}
      >
        <SidebarHeader dataSource={dataSource} loadError={loadError} loadWarnings={loadWarnings} />
        <nav className="flex min-h-0 flex-1 flex-col space-y-0.5 overflow-y-auto p-3">
          <NavHeading>Обзор</NavHeading>
          <NavLink to="/" end className={item} onClick={closeNav}>
            Сводка по группе
          </NavLink>

          <NavHeading>Финансы</NavHeading>
          <NavLink to="/finance/cash" className={item} onClick={closeNav}>
            Касса и ликвидность
          </NavLink>
          <NavLink to="/finance/debtors" className={item} onClick={closeNav}>
            Дебиторка
          </NavLink>
          <NavLink to="/finance/creditors" className={item} onClick={closeNav}>
            Кредиторка
          </NavLink>

          <NavHeading>Финансы · сигналы</NavHeading>
          <NavLink to="/operations/alerts" className={item} onClick={closeNav}>
            Финансовые алерты
          </NavLink>

          <NavHeading>Юрлица</NavHeading>
          {companies.map((c) => (
            <NavLink key={c.id} to={`/company/${c.id}`} className={item} onClick={closeNav}>
              {c.shortName}
            </NavLink>
          ))}

          <NavHeading>Другой продукт</NavHeading>
          <a
            href={matrixFarmHref()}
            className="block rounded-lg border border-blue-500/40 bg-blue-950/40 px-3 py-2.5 text-sm font-medium text-blue-200 transition-colors hover:bg-blue-900/50 hover:text-white"
            onClick={closeNav}
          >
            Пульт фермы Матрикс →
            <span className="mt-1 block text-[10px] font-normal text-blue-300/90">стадо, корма, ветслужба</span>
          </a>

          <NavHeading>Админ</NavHeading>
          <NavLink to="/admin/settings" className={item} onClick={closeNav}>
            Настройки и доступы
          </NavLink>
        </nav>
      </aside>

      <main
        id="app-main"
        tabIndex={-1}
        className="relative z-10 min-h-0 w-full min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-b from-slate-50 to-slate-100 outline-none lg:min-h-full"
      >
        <CrossDashboardStrip />
        <Outlet />
      </main>
    </div>
  )
}
