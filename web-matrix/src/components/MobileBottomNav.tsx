import { NavLink, useLocation } from 'react-router-dom'
import { useStaffAuth } from '../hooks/useStaffAuth'
import { mobileNavForRole, type MobileNavItem } from '../lib/staffRoleAccess'

type Props = {
  onOpenMenu: () => void
  navOpen?: boolean
}

function NavIcon({ name }: { name: MobileNavItem['icon'] | 'menu' }) {
  const cls = 'h-6 w-6 shrink-0'
  switch (name) {
    case 'today':
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h10M4 18h6" />
        </svg>
      )
    case 'my':
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    case 'tasks':
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    case 'barn':
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8M8 11h8m-6 4h4M5 3h14a2 2 0 012 2v14l-4-2-4 2-4-2-4 2V5a2 2 0 012-2z" />
        </svg>
      )
    case 'feed':
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-9H19M5 12H3.34M18.36 6.64l-.7.7M6.34 17.66l-.7.7m12.02-.7l.7.7M6.34 6.34l-.7.7" />
        </svg>
      )
    case 'milk':
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-6v6m4-9v9M6 4h12v16H6z" />
        </svg>
      )
    case 'machines':
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0zM5 11h14l-1-4H6l-1 4z" />
        </svg>
      )
    case 'menu':
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      )
    default:
      return null
  }
}

const itemClass = (active: boolean) =>
  [
    'matrix-bottom-nav__item flex min-h-[var(--matrix-bottom-nav-row)] flex-col items-center justify-center gap-0.5 px-1 pt-1 pb-0.5 text-[10px] font-semibold leading-tight outline-none touch-manipulation',
    active ? 'text-blue-700' : 'text-slate-600 active:bg-slate-100',
  ].join(' ')

export function MobileBottomNav({ onOpenMenu, navOpen = false }: Props) {
  const location = useLocation()
  const { employee, isLoggedIn } = useStaffAuth()
  const items = mobileNavForRole(employee?.roleId ?? null, isLoggedIn)

  const isItemActive = (to: string, end?: boolean) =>
    end ? location.pathname === to || location.pathname === `${to}/` : location.pathname.startsWith(to)

  const menuActive =
    !items.some((i) => isItemActive(i.to, i.end)) &&
    !location.pathname.startsWith('/animals') &&
    !location.pathname.startsWith('/login')

  const colCount = items.length + 1

  if (navOpen) return null

  return (
    <nav className="matrix-bottom-nav lg:hidden" aria-label="Быстрая навигация">
      <ul
        className="matrix-bottom-nav__row grid w-full"
        style={{ gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` }}
      >
        {items.map((item) => (
          <li key={item.to} className="min-w-0">
            <NavLink to={item.to} end={item.end} className={({ isActive }) => itemClass(isActive)}>
              <NavIcon name={item.icon} />
              <span className="max-w-full truncate">{item.label}</span>
            </NavLink>
          </li>
        ))}
        <li className="min-w-0">
          <button
            type="button"
            onClick={onOpenMenu}
            className={[itemClass(menuActive), 'w-full'].join(' ')}
          >
            <NavIcon name="menu" />
            <span>Ещё</span>
          </button>
        </li>
      </ul>
      <div className="matrix-bottom-nav__safe" aria-hidden />
    </nav>
  )
}
