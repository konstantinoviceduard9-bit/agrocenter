import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PwaInstallHint } from '../components/PwaInstallHint'
import { useStaffAuth } from '../context/StaffAuthContext'
import { roleById, staffMembers } from '../data/staff'

export function StaffLoginPage() {
  const { login, isLoggedIn } = useStaffAuth()
  const navigate = useNavigate()
  const [pin, setPin] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isLoggedIn) navigate('/my-tasks', { replace: true })
  }, [isLoggedIn, navigate])

  const tryLogin = (value: string, employeeId?: string) => {
    const result = login(value, employeeId)
    if (result.ok) {
      setError(null)
      navigate('/my-tasks', { replace: true })
    } else {
      setError(result.message)
    }
  }

  const demoUsers = staffMembers.filter((m) => m.active && m.hasAppAccess)

  return (
    <div className="mx-auto flex min-h-[70dvh] max-w-md flex-col justify-center px-2 py-6">
      <PwaInstallHint />

      <h1 className="mt-4 text-xl font-bold text-slate-900">Вход сотрудника</h1>
      <p className="mt-2 text-sm text-slate-600">
        Демо: PIN <strong>1</strong> у всех. Нажмите на своё имя в списке ниже. После входа — только разделы вашей роли и{' '}
        <strong>«Мои задачи»</strong> от руководства.
      </p>

      <label className="mt-6 block text-xs font-semibold text-slate-600">PIN</label>
      <input
        type="password"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={4}
        value={pin}
        onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && pin.length >= 1) tryLogin(pin)
        }}
        placeholder="1"
        className="matrix-touch-input mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 text-center text-2xl font-bold tracking-[0.4em]"
      />
      {error ? <p className="mt-2 text-sm font-medium text-red-700">{error}</p> : null}

      <button
        type="button"
        disabled={pin.length < 1}
        onClick={() => tryLogin(pin)}
        className="matrix-touch-btn mt-4 w-full rounded-xl bg-blue-700 py-3 text-base font-bold text-white hover:bg-blue-800 disabled:opacity-40"
      >
        Войти
      </button>

      <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-slate-500">Быстрый вход (демо)</p>
      <ul className="mt-2 max-h-[40vh] space-y-2 overflow-y-auto">
        {demoUsers.map((m) => {
          const role = roleById(m.roleId)
          return (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => tryLogin(m.pin, m.id)}
                className="matrix-touch-btn w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-left shadow-sm hover:border-blue-300 hover:bg-blue-50"
              >
                <span className="font-semibold text-slate-900">{m.name}</span>
                <span className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${role.color}`}>{role.label}</span>
                <span className="mt-1 block font-mono text-xs text-slate-500">PIN {m.pin}</span>
              </button>
            </li>
          )
        })}
      </ul>

      <p className="mt-6 text-center text-xs text-slate-500">
        <Link to="/" className="font-medium text-blue-700 hover:underline">
          Пульт без входа (руководство)
        </Link>
      </p>
    </div>
  )
}
