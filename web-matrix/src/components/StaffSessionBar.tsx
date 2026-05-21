import { Link } from 'react-router-dom'
import { useStaffAuth } from '../context/StaffAuthContext'
import { roleById } from '../data/staff'

export function StaffSessionBar() {
  const { employee, isLoggedIn, logout } = useStaffAuth()

  if (!isLoggedIn || !employee) {
    return (
      <Link
        to="/login"
        className="matrix-touch-btn rounded-lg border border-blue-600 bg-blue-700 px-3 font-semibold text-white shadow-sm hover:bg-blue-800"
      >
        Войти
      </Link>
    )
  }

  const role = roleById(employee.roleId)

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
