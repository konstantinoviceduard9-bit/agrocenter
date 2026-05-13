import type { ReactNode } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useDashboardData } from '../context/DashboardDataContext'

const item = ({ isActive }: { isActive: boolean }) =>
  [
    'block rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    isActive ? 'bg-emerald-600/20 text-emerald-200' : 'text-slate-300 hover:bg-slate-800 hover:text-white',
  ].join(' ')

function NavHeading({ children }: { children: ReactNode }) {
  return <p className="px-3 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">{children}</p>
}

export function Layout() {
  const { companies, dataSource, loadError, loadWarnings } = useDashboardData()

  return (
    <div className="flex min-h-full bg-slate-100 antialiased text-slate-900">
      <aside className="flex w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-900 text-slate-200">
        <div className="border-b border-slate-800 px-4 py-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400/90">Группа</p>
          <h1 className="mt-1 text-lg font-bold leading-tight text-white">Нерал · дашборд</h1>
          <p className="mt-2 text-xs text-slate-400">
            Скелет UI: фильтр периода, разделы по плану. Данные —{' '}
            {dataSource === 'file' ? (
              <span className="text-emerald-300/90">файл public/data/dashboard.snapshot.json</span>
            ) : (
              <span>встроенные моки</span>
            )}
            . API позже.
          </p>
          {loadError ? (
            <p className="mt-2 rounded-md border border-amber-700/50 bg-amber-950/40 px-2 py-1.5 text-[11px] text-amber-100">
              Снимок данных не применён: {loadError}. Показаны встроенные моки.
            </p>
          ) : null}
          {!loadError && loadWarnings.length > 0 ? (
            <p className="mt-2 rounded-md border border-slate-600 bg-slate-800/80 px-2 py-1.5 text-[11px] text-slate-300">
              Предупреждения снимка ({loadWarnings.length}): {loadWarnings.slice(0, 2).join(' · ')}
              {loadWarnings.length > 2 ? '…' : ''}
            </p>
          ) : null}
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
          <NavHeading>Обзор</NavHeading>
          <NavLink to="/" end className={item}>
            Сводка по группе
          </NavLink>

          <NavHeading>Финансы</NavHeading>
          <NavLink to="/finance/cash" className={item}>
            Касса и ликвидность
          </NavLink>
          <NavLink to="/finance/debtors" className={item}>
            Дебиторка
          </NavLink>
          <NavLink to="/finance/creditors" className={item}>
            Кредиторка
          </NavLink>

          <NavHeading>Операции</NavHeading>
          <NavLink to="/operations/alerts" className={item}>
            Алерты (план)
          </NavLink>

          <NavHeading>Юрлица</NavHeading>
          {companies.map((c) => (
            <NavLink key={c.id} to={`/company/${c.id}`} className={item}>
              {c.shortName}
            </NavLink>
          ))}

          <NavHeading>Админ</NavHeading>
          <NavLink to="/admin/settings" className={item}>
            Настройки и доступы
          </NavLink>
        </nav>
      </aside>
      <main className="min-h-full flex-1 overflow-auto bg-slate-100">
        <Outlet />
      </main>
    </div>
  )
}
