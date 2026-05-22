import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useStaffAuth } from '../hooks/useStaffAuth'
import { MATRIX_COPY } from '../lib/appCopy'
import { groupDashboardHref } from '../lib/dashboardLinks'
import { matrixNavSections, navLabelForPath, navSectionsForRole } from '../lib/matrixNav'
import { canRoleAccessPath } from '../lib/staffRoleAccess'
import { ActiveVetSelect } from './ActiveVetSelect'
import { DataStrip } from './DataStrip'
import { FarmHeaderBrand } from './FarmHeaderBrand'
import { MobileBottomNav } from './MobileBottomNav'
import { StaffSessionBar } from './StaffSessionBar'

const navItem = ({ isActive }: { isActive: boolean }) =>
  [
    'matrix-nav-touch group flex flex-col gap-0.5 rounded-lg px-2.5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-blue-400',
    isActive
      ? 'border-l-[3px] border-blue-700 bg-blue-50 pl-[calc(0.625rem-3px)] font-semibold text-blue-900 shadow-sm'
      : 'border-l-[3px] border-transparent text-slate-700 hover:bg-slate-100',
  ].join(' ')

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg className="h-5 w-5 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
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
  const navigate = useNavigate()
  const { employee, isRestricted } = useStaffAuth()
  const [navOpen, setNavOpen] = useState(false)
  const isLoginPage = location.pathname.startsWith('/login')
  const currentLabel = navLabelForPath(location.pathname)
  const navSections = isRestricted && employee ? navSectionsForRole(employee.roleId) : matrixNavSections

  useEffect(() => {
    setNavOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!isRestricted || !employee) return
    if (canRoleAccessPath(employee.roleId, location.pathname)) return
    navigate('/my-tasks', { replace: true })
  }, [isRestricted, employee, location.pathname, navigate])

  return (
    <div className="flex min-h-dvh flex-col bg-[#e8eaed] text-slate-900">
      <header className="matrix-safe-top shrink-0 border-b border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 px-3 py-2 sm:gap-3 sm:py-2.5 lg:px-4">
          {!isLoginPage ? (
            <button
              type="button"
              className="matrix-touch-btn shrink-0 rounded-lg border border-slate-200 !min-h-10 !min-w-10 !p-2 text-slate-700 hover:bg-slate-50 lg:hidden"
              aria-expanded={navOpen}
              aria-controls="matrix-sidebar"
              onClick={() => setNavOpen((o) => !o)}
            >
              <span className="sr-only">Меню</span>
              <MenuIcon open={navOpen} />
            </button>
          ) : null}
          <FarmHeaderBrand sectionLabel={currentLabel} />
          {!isLoginPage ? (
            <div className="shrink-0 lg:hidden">
              <StaffSessionBar compact />
            </div>
          ) : null}
          <div className="hidden shrink-0 items-end gap-2 sm:flex">
            <button
              type="button"
              className="matrix-touch-btn rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-700 hover:bg-slate-100"
            >
              {MATRIX_COPY.syncLabel}
            </button>
            {employee?.roleId === 'vet' || !isRestricted ? <ActiveVetSelect /> : null}
            <StaffSessionBar />
          </div>
        </div>
        {!isLoginPage && (employee?.roleId === 'vet' || !isRestricted) ? (
          <div className="border-t border-slate-100 px-3 py-2 lg:hidden">
            <ActiveVetSelect fullWidth />
          </div>
        ) : null}
      </header>

      {!isLoginPage ? <DataStrip /> : null}

      <div className="hidden border-b border-emerald-200/90 bg-gradient-to-r from-emerald-50 to-slate-50 px-4 py-2 text-sm text-slate-800 md:block">
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
            className="fixed inset-0 z-[45] bg-black/40 lg:hidden"
            onClick={() => setNavOpen(false)}
          />
        ) : null}

        <aside
          id="matrix-sidebar"
          className={[
            'matrix-safe-top fixed inset-y-0 left-0 z-[50] flex w-[min(20rem,92vw)] flex-col border-r border-slate-300 bg-[#f4f5f7] shadow-xl transition-transform lg:static lg:z-0 lg:w-60 lg:shrink-0 lg:translate-x-0 lg:shadow-none',
            isLoginPage ? 'hidden' : navOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          ].join(' ')}
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <div className="border-b border-slate-200 bg-white/80 px-3 py-3 lg:py-4">
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Раздел</p>
            <p className="mt-0.5 text-sm font-bold text-slate-800">{currentLabel}</p>
          </div>

          <nav
            className="flex-1 overflow-y-auto p-2 pb-6 text-sm"
            style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom, 0px))' }}
            aria-label="Навигация по пульту"
          >
            {navSections.map((sec) => (
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

        <main
          id="matrix-main"
          className={[
            'min-h-0 min-w-0 flex-1 overflow-x-hidden p-3 sm:p-4',
            isLoginPage ? 'matrix-login-main flex flex-col overflow-hidden' : 'matrix-safe-bottom overflow-y-auto',
          ].join(' ')}
        >
          <Outlet />
        </main>
      </div>

      {!location.pathname.startsWith('/login') ? (
        <MobileBottomNav onOpenMenu={() => setNavOpen(true)} navOpen={navOpen} />
      ) : null}
    </div>
  )
}

export function PageTitle({ title, subtitle }: { title: string; subtitle?: ReactNode }) {
  return (
    <div className="mb-4">
      <h2 className="text-base font-bold text-slate-800 sm:text-lg">{title}</h2>
      {subtitle ? (
        <p className="mt-1 flex flex-wrap items-center gap-x-1 gap-y-0.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}
