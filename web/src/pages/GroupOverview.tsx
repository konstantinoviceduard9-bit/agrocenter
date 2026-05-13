import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Link } from 'react-router-dom'
import { PageShell } from '../components/PageShell'
import { groupTotals, roleLabel } from '../data/companies'
import { useDashboardData } from '../context/DashboardDataContext'
import { fmtInt, fmtMln } from '../lib/format'
import { useDashboardFilters } from '../context/DashboardFiltersContext'

export function GroupOverview() {
  const { periodLabel, year } = useDashboardFilters()
  const { companies, getAlerts } = useDashboardData()
  const t = groupTotals(companies)
  const alerts = getAlerts(year)
  const criticalCount = alerts.filter((a) => a.severity === 3).length
  const chartData = companies
    .filter((c) => c.revenue2025Mln != null)
    .map((c) => ({
      name: c.shortName.replace('ООО «', '').replace('»', ''),
      v: c.revenue2025Mln as number,
    }))

  return (
    <>
      <PageShell
        title="Сводка по группе"
        subtitle={`Ключевые агрегаты и выручка по юрлицам. Период в шапке: ${periodLabel} (квартал в моке пока только подпись).`}
      />
      <div className="space-y-10 px-6 py-8 lg:px-10">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Σ Выручка 2025" value={`${fmtMln(t.revenue)} млн ₽`} hint="по заполненным строкам" />
          <StatCard title="Σ Чистая прибыль 2025" value={`${fmtMln(t.profit)} млн ₽`} hint="по заполненным строкам" />
          <StatCard title="Σ Активы 2025" value={`${fmtMln(t.assets)} млн ₽`} hint="по заполненным строкам" />
          <StatCard title="Σ Численность" value={`${fmtInt(t.employees)} чел.`} hint="включая ЦАТ" />
        </div>

        {alerts.length > 0 ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 shadow-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-900/80">Сигналы за {year}</p>
              <p className="mt-1 text-sm text-amber-950">
                Найдено <strong>{alerts.length}</strong> сигналов
                {criticalCount > 0 ? (
                  <>
                    , из них критичных: <strong>{criticalCount}</strong>
                  </>
                ) : null}
                .
              </p>
            </div>
            <Link
              to="/operations/alerts"
              className="shrink-0 rounded-xl bg-amber-800 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-900"
            >
              Открыть алерты
            </Link>
          </div>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-5">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Выручка 2025 по компаниям</h3>
            <div className="mt-4 h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-18} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 11 }} unit=" млн" />
                  <Tooltip
                    formatter={(v) => [`${fmtMln(Number(v))} млн ₽`, 'Выручка']}
                    contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
                  />
                  <Bar dataKey="v" fill="#059669" radius={[6, 6, 0, 0]} name="Выручка" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Список</h3>
            <ul className="mt-3 divide-y divide-slate-100">
              {companies.map((c) => (
                <li key={c.id} className="flex items-start justify-between gap-2 py-3 first:pt-0">
                  <div>
                    <Link to={`/company/${c.id}`} className="font-medium text-emerald-800 hover:underline">
                      {c.shortName}
                    </Link>
                    <p className="text-xs text-slate-500">
                      ИНН {c.inn} · {roleLabel[c.role]}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold tabular-nums text-slate-800">
                    {c.revenue2025Mln != null ? `${fmtMln(c.revenue2025Mln)} млн` : '—'}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Быстрые ссылки</h3>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <Link className="rounded-lg bg-emerald-50 px-3 py-1.5 font-medium text-emerald-900 hover:bg-emerald-100" to="/finance/cash">
              Касса
            </Link>
            <Link className="rounded-lg bg-emerald-50 px-3 py-1.5 font-medium text-emerald-900 hover:bg-emerald-100" to="/finance/debtors">
              Дебиторка
            </Link>
            <Link className="rounded-lg bg-emerald-50 px-3 py-1.5 font-medium text-emerald-900 hover:bg-emerald-100" to="/finance/creditors">
              Кредиторка
            </Link>
            <Link className="rounded-lg bg-slate-100 px-3 py-1.5 font-medium text-slate-800 hover:bg-slate-200" to="/operations/alerts">
              Алерты
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}

function StatCard({ title, value, hint }: { title: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-bold tabular-nums text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{hint}</p>
    </div>
  )
}
