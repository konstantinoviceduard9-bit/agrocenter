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
import { APP_COPY } from '../lib/appCopy'
import { chartPalette } from '../lib/chartPalette'
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
        breadcrumbs={[{ label: 'Сводка' }]}
        title="Сводка по группе"
        subtitle={`Ключевые показатели группы и выручка по юрлицам (${periodLabel}). ${APP_COPY.quarterFilterNote}`}
      />
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:space-y-10 sm:px-6 sm:py-8 lg:px-10">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Σ Выручка 2025" value={`${fmtMln(t.revenue)} млн ₽`} hint="по заполненным строкам" />
          <StatCard title="Σ Чистая прибыль 2025" value={`${fmtMln(t.profit)} млн ₽`} hint="по заполненным строкам" />
          <StatCard title="Σ Активы 2025" value={`${fmtMln(t.assets)} млн ₽`} hint="по заполненным строкам" />
          <StatCard title="Σ Численность" value={`${fmtInt(t.employees)} чел.`} hint="включая ЦАТ" />
        </div>

        {alerts.length > 0 ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200/90 bg-gradient-to-r from-amber-50 to-amber-50/70 px-5 py-4 shadow-sm shadow-amber-900/5 ring-1 ring-amber-900/5">
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
          <section className="surface-card surface-card--lift p-5 lg:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Выручка 2025 по компаниям</h3>
            <div className="mt-4 h-64 min-h-[14rem] w-full sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 4, left: -8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartPalette.grid} vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: chartPalette.tickFontSize, fill: chartPalette.axis }}
                    interval={0}
                    angle={-22}
                    textAnchor="end"
                    height={68}
                    axisLine={{ stroke: chartPalette.grid }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: chartPalette.tickFontSize, fill: chartPalette.axis }}
                    unit=" млн"
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(v) => [`${fmtMln(Number(v))} млн ₽`, 'Выручка']}
                    contentStyle={{
                      borderRadius: 12,
                      border: `1px solid ${chartPalette.tooltipBorder}`,
                      backgroundColor: chartPalette.tooltipBg,
                      boxShadow: chartPalette.tooltipShadow,
                    }}
                    cursor={{ fill: 'rgb(241 245 249 / 0.65)' }}
                  />
                  <Bar dataKey="v" fill={chartPalette.bar} radius={[6, 6, 0, 0]} name="Выручка" activeBar={{ fill: chartPalette.barActive }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="surface-card surface-card--lift p-5 lg:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Список</h3>
            <ul className="mt-3 divide-y divide-slate-100">
              {companies.map((c) => (
                <li
                  key={c.id}
                  className="flex items-start justify-between gap-2 rounded-xl py-3 pl-1 pr-1 transition-colors first:pt-0 hover:bg-slate-50/90"
                >
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

        <section className="surface-card surface-card--lift p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Быстрые ссылки</h3>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <Link
              className="rounded-full border border-emerald-200/80 bg-white px-4 py-2 font-medium text-emerald-900 shadow-sm outline-none transition hover:border-emerald-300 hover:bg-emerald-50 active:scale-[0.99] motion-reduce:active:scale-100"
              to="/finance/cash"
            >
              Касса
            </Link>
            <Link
              className="rounded-full border border-emerald-200/80 bg-white px-4 py-2 font-medium text-emerald-900 shadow-sm outline-none transition hover:border-emerald-300 hover:bg-emerald-50 active:scale-[0.99] motion-reduce:active:scale-100"
              to="/finance/debtors"
            >
              Дебиторка
            </Link>
            <Link
              className="rounded-full border border-emerald-200/80 bg-white px-4 py-2 font-medium text-emerald-900 shadow-sm outline-none transition hover:border-emerald-300 hover:bg-emerald-50 active:scale-[0.99] motion-reduce:active:scale-100"
              to="/finance/creditors"
            >
              Кредиторка
            </Link>
            <Link
              className="rounded-full border border-slate-200 bg-white px-4 py-2 font-medium text-slate-800 shadow-sm outline-none transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.99] motion-reduce:active:scale-100"
              to="/operations/alerts"
            >
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
    <div className="surface-card surface-card--lift border-l-[3px] border-l-emerald-500 p-5 pl-[1.125rem]">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight tabular-nums text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{hint}</p>
    </div>
  )
}
