import { PageShell } from '../components/PageShell'
import { useDashboardFilters } from '../context/DashboardFiltersContext'
import { useDashboardData } from '../context/DashboardDataContext'
import { fmtInt, fmtMln } from '../lib/format'
import { DataTable } from '../components/DataTable'
import { Link } from 'react-router-dom'

type Row = {
  companyId: string
  name: string
  cashMln: number
  runwayDays: number
}

export function CashPage() {
  const { year, periodLabel } = useDashboardFilters()
  const { companies, getCompany, getCashRows, sumCashMln } = useDashboardData()
  const rows: Row[] = getCashRows(year).map((r) => ({
    companyId: r.companyId,
    name: getCompany(r.companyId)?.shortName ?? r.companyId,
    cashMln: r.cashMln,
    runwayDays: r.runwayDays,
  }))
  const total = sumCashMln(year)

  return (
    <>
      <PageShell
        title="Касса и ликвидность"
        subtitle={`Остатки и условный «горизонт» по моку. Период: ${periodLabel}. Источник правды позже — 1С / банк.`}
      />
      <div className="space-y-6 px-6 py-8 lg:px-10">
        <div className="grid gap-4 sm:grid-cols-3">
          <Kpi title="Σ Денег на счетах (мок)" value={`${fmtMln(total)} млн ₽`} hint="Сумма по таблице ниже" />
          <Kpi title="Юрлиц в выборке" value={`${fmtInt(companies.length)}`} hint="Все из справочника" />
          <Kpi title="Год данных" value={year} hint="Переключатель в шапке" />
        </div>
        <DataTable<Row>
          columns={[
            { id: 'name', header: 'Компания', cell: (r) => <Link className="font-medium text-emerald-800 hover:underline" to={`/company/${r.companyId}`}>{r.name}</Link> },
            { id: 'cash', header: 'Остаток, млн ₽', cell: (r) => <span className="tabular-nums font-semibold">{fmtMln(r.cashMln)}</span> },
            { id: 'runway', header: 'Дней покрытия (усл.)', cell: (r) => <span className="tabular-nums">{r.runwayDays}</span> },
          ]}
          rows={rows}
        />
      </div>
    </>
  )
}

function Kpi({ title, value, hint }: { title: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      <p className="mt-2 text-xl font-bold tabular-nums text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{hint}</p>
    </div>
  )
}
