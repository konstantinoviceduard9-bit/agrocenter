import { PageShell } from '../components/PageShell'
import { useDashboardFilters } from '../context/DashboardFiltersContext'
import { useDashboardData } from '../context/DashboardDataContext'
import { fmtInt, fmtMln } from '../lib/format'
import { APP_COPY } from '../lib/appCopy'
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
        breadcrumbs={[
          { label: 'Сводка', to: '/' },
          { label: 'Касса и ликвидность' },
        ]}
        title="Касса и ликвидность"
        subtitle={`Остатки и условный горизонт ликвидности (демо). ${periodLabel}. ${APP_COPY.ledgerRoadmap}`}
      />
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        <div className="grid gap-4 sm:grid-cols-3">
          <Kpi title="Σ Денег на счетах (демо)" value={`${fmtMln(total)} млн ₽`} hint="Сумма по таблице ниже" />
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
    <div className="surface-card surface-card--lift p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      <p className="mt-2 text-xl font-bold tabular-nums text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{hint}</p>
    </div>
  )
}
