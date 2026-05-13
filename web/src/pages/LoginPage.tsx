import { useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, type DemoRole } from '../context/AuthContext'

export function LoginPage() {
  const { login, user } = useAuth()
  const nav = useNavigate()

  useEffect(() => {
    if (user) nav('/', { replace: true })
  }, [user, nav])

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const name = String(fd.get('name') || 'Пользователь демо')
    const role = (String(fd.get('role')) as DemoRole) || 'group_admin'
    login(name, role === 'company_viewer' ? 'company_viewer' : 'group_admin')
    nav('/', { replace: true })
  }

  if (user) {
    return (
      <div className="flex min-h-full items-center justify-center bg-slate-100 text-sm text-slate-500">
        Перенаправление…
      </div>
    )
  }

  return (
    <div className="flex min-h-full items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">Вход (демо)</h1>
        <p className="mt-2 text-sm text-slate-600">
          Заглушка под будущую авторизацию. Данные хранятся только в <code className="rounded bg-slate-100 px-1">localStorage</code> этого браузера.
        </p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <label className="block text-sm font-medium text-slate-700">
            Имя для шапки
            <input
              name="name"
              defaultValue="Исполнительный директор"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Роль (демо)
            <select name="role" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" defaultValue="group_admin">
              <option value="group_admin">Вся группа</option>
              <option value="company_viewer">Только одна компания (заготовка)</option>
            </select>
          </label>
          <button type="submit" className="w-full rounded-lg bg-emerald-700 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">
            Войти
          </button>
        </form>
        <button
          type="button"
          className="mt-4 w-full text-sm text-slate-500 hover:text-slate-800"
          onClick={() => nav(-1)}
        >
          Назад
        </button>
      </div>
    </div>
  )
}
