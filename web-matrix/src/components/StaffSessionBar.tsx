import { Link } from 'react-router-dom'
import { useStaffAuth } from '../hooks/useStaffAuth'
import { roleById } from '../data/staff'

export function StaffSessionBar({ compact = false }: { compact?: boolean }) {
  const { employee, isLoggedIn, logout } = useStaffAuth()

  if (!isLoggedIn || !employee) {
    return (
      <Link
        to="/login"
        className={[
          'inline-flex items-center justify-center rounded-lg border border-blue-600 bg-blue-700 font-semibold text-white shadow-sm hover:bg-blue-800',
          compact ? 'min-h-9 px-2.5 text-xs' : 'matrix-touch-btn px-3',
        ].join(' ')}
      >
        Войти
      </Link>
    )
  }

  const role = roleById(employee.roleId)

  if (compact) {
    return (
      <div className="flex max-w-[9.5rem] items-center gap-1.5 sm:max-w-none">
        <div className="min-w-0 text-right">
          <p className="truncate text-[11px] font-bold leading-tight text-slate-800">{employee.name.split(' ')[0]}</p>
          <p className={`truncate text-[9px] font-bold ${role.color} rounded-full px-1`}>{role.shortLabel}</p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="shrink-0 rounded-md border border-slate-300 bg-white px-2 py-1.5 text-[10px] font-semibold text-slate-700"
          aria-label="Выйти"
        >
          Выйти
        </button>
      </div>
    )
  }

  return (
    <div className="flex max-w-[14rem] flex-col items-end gap-1 sm:max-w-none sm:flex-row sm:items-center">
      <div className="min-w-0 text-right text-xs leading-tight">
        <p className="truncate font-bold text-slate-800">{employee.name}</p>
        <p className={`inline-block rounded-full px-1.5 py-0.5 text-[10px] font-bold ${role.color}`}>{role.label}</p>
      </div>
      <button
        type="button"
        onClick={logout}
        className="matrix-touch-btn shrink-0 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50"
      >
        Выйти
      </button>
    </div>
  )
}
