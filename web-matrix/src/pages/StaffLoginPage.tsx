import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PwaInstallHint } from '../components/PwaInstallHint'
import { useStaffAuth } from '../context/StaffAuthContext'
import { roleById, staffMembers, staffRoles, type StaffRoleId } from '../data/staff'

const LAST_LOGIN_KEY = 'matrix-last-login-employee'
const DEMO_PIN = '1'

function initials(name: string): string {
  const parts = name.replace(/\./g, ' ').trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0]![0] ?? '') + (parts[1]![0] ?? '')
  return name.slice(0, 2).toUpperCase()
}

function loadLastEmployeeId(): string | null {
  try {
    const id = localStorage.getItem(LAST_LOGIN_KEY)
    if (!id) return null
    return staffMembers.some((m) => m.id === id && m.active && m.hasAppAccess) ? id : null
  } catch {
    return null
  }
}

export function StaffLoginPage() {
  const { login, isLoggedIn } = useStaffAuth()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | StaffRoleId>('all')
  const [showPinForm, setShowPinForm] = useState(false)
  const [pin, setPin] = useState('')
  const [error, setError] = useState<string | null>(null)
  const lastId = useMemo(() => loadLastEmployeeId(), [])

  useEffect(() => {
    if (isLoggedIn) navigate('/my-tasks', { replace: true })
  }, [isLoggedIn, navigate])

  const demoUsers = useMemo(
    () => staffMembers.filter((m) => m.active && m.hasAppAccess),
    [],
  )

  const rolesInList = useMemo(() => {
    const ids = new Set(demoUsers.map((m) => m.roleId))
    return staffRoles.filter((r) => ids.has(r.id))
  }, [demoUsers])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return demoUsers.filter((m) => {
      if (roleFilter !== 'all' && m.roleId !== roleFilter) return false
      if (!q) return true
      const role = roleById(m.roleId)
      return (
        m.name.toLowerCase().includes(q) ||
        role.label.toLowerCase().includes(q) ||
        role.shortLabel.toLowerCase().includes(q)
      )
    })
  }, [demoUsers, query, roleFilter])

  const lastMember = lastId ? demoUsers.find((m) => m.id === lastId) : undefined

  const enterAs = (employeeId: string) => {
    const result = login(DEMO_PIN, employeeId)
    if (result.ok) {
      localStorage.setItem(LAST_LOGIN_KEY, employeeId)
      setError(null)
      navigate('/my-tasks', { replace: true })
    } else {
      setError(result.message)
    }
  }

  const tryPinLogin = () => {
    const result = login(pin)
    if (result.ok) {
      setError(null)
      navigate('/my-tasks', { replace: true })
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="mx-auto flex min-h-0 w-full min-w-0 max-w-lg flex-1 flex-col">
      <div className="shrink-0">
        <p className="text-[11px] font-bold uppercase tracking-wide text-blue-800">Вход сотрудника</p>
        <h1 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">Выберите себя в списке</h1>
        <p className="mt-1 text-xs leading-relaxed text-slate-600">
          Демо: одно нажатие — вход под вашей ролью. Задачи от руководства — в разделе «Мои».
        </p>

        {lastMember ? (
          <button
            type="button"
            onClick={() => enterAs(lastMember.id)}
            className="matrix-touch-btn mt-4 flex w-full items-center gap-3 rounded-xl border-2 border-blue-600 bg-blue-50 px-3 py-3 text-left shadow-sm"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-700 text-sm font-bold text-white">
              {initials(lastMember.name)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-semibold uppercase text-blue-800">Продолжить как</span>
              <span className="block truncate text-base font-bold text-slate-900">{lastMember.name}</span>
            </span>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${roleById(lastMember.roleId).color}`}>
              {roleById(lastMember.roleId).shortLabel}
            </span>
          </button>
        ) : null}

        <label className="sr-only" htmlFor="staff-search">
          Поиск сотрудника
        </label>
        <input
          id="staff-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по имени или роли…"
          className="matrix-touch-input mt-4 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm"
          autoComplete="off"
        />

        <div className="-mx-1 mt-3 flex gap-1.5 overflow-x-auto px-1 pb-1 [-webkit-overflow-scrolling:touch]">
          <button
            type="button"
            onClick={() => setRoleFilter('all')}
            className={[
              'shrink-0 rounded-full px-3 py-1 text-xs font-semibold',
              roleFilter === 'all' ? 'bg-slate-800 text-white' : 'bg-white text-slate-700 ring-1 ring-slate-200',
            ].join(' ')}
          >
            Все ({demoUsers.length})
          </button>
          {rolesInList.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRoleFilter(r.id)}
              className={[
                'shrink-0 rounded-full px-3 py-1 text-xs font-semibold',
                roleFilter === r.id ? 'bg-slate-800 text-white' : `${r.color} ring-1 ring-slate-200/80`,
              ].join(' ')}
            >
              {r.shortLabel}
            </button>
          ))}
        </div>

        {error ? <p className="mt-2 text-sm font-medium text-red-700">{error}</p> : null}
      </div>

      <ul className="mt-3 min-h-0 flex-1 space-y-1.5 overflow-y-auto overscroll-contain pb-2">
        {filtered.length === 0 ? (
          <li className="rounded-xl border border-dashed border-slate-300 bg-white/80 px-4 py-8 text-center text-sm text-slate-600">
            Никого не найдено. Сбросьте фильтр или измените запрос.
          </li>
        ) : (
          filtered.map((m) => {
            const role = roleById(m.roleId)
            return (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => enterAs(m.id)}
                  className="flex w-full items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-left shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-50 active:bg-blue-100"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                    {initials(m.name)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-slate-900">{m.name}</span>
                    <span className="block truncate text-[11px] text-slate-500">{role.appHint}</span>
                  </span>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${role.color}`}>
                    {role.shortLabel}
                  </span>
                </button>
              </li>
            )
          })
        )}
      </ul>

      <div className="shrink-0 space-y-3 border-t border-slate-200/80 pt-3">
        <PwaInstallHint compact />

        {!showPinForm ? (
          <button
            type="button"
            onClick={() => setShowPinForm(true)}
            className="w-full text-center text-xs font-medium text-slate-500 underline decoration-slate-300 underline-offset-2 hover:text-slate-700"
          >
            Ввести PIN вручную
          </button>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-xs font-semibold text-slate-600">PIN (демо: {DEMO_PIN})</p>
            <input
              type="password"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && pin.length >= 1) tryPinLogin()
              }}
              placeholder={DEMO_PIN}
              className="matrix-touch-input mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-center text-lg font-bold tracking-widest"
            />
            <button
              type="button"
              disabled={pin.length < 1}
              onClick={tryPinLogin}
              className="matrix-touch-btn mt-2 w-full rounded-lg bg-slate-800 py-2 text-sm font-semibold text-white disabled:opacity-40"
            >
              Войти по PIN
            </button>
          </div>
        )}

        <p className="text-center text-xs text-slate-500">
          <Link to="/" className="font-medium text-blue-700 hover:underline">
            Пульт без входа
          </Link>
          <span className="text-slate-400"> · для руководства</span>
        </p>
      </div>
    </div>
  )
}
