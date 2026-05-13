import { PageShell } from '../components/PageShell'
import { useDashboardFilters } from '../context/DashboardFiltersContext'
import { useDashboardData } from '../context/DashboardDataContext'
import { fmtMln } from '../lib/format'
import { APP_COPY } from '../lib/appCopy'
import { DataTable } from '../components/DataTable'
import { Link } from 'react-router-dom'
import { downloadCsv } from '../lib/csv'
import type { ARRow } from '../data/financeMocks'

export function DebtorsPage() {
  const { year, periodLabel } = useDashboardFilters()
  const { getCompany, getARRows, arAgingTotals } = useDashboardData()
  const rows = getARRows(year)
  const totals = arAgingTotals(year)

  function exportCsv() {
    const headers = ['Компания', 'Контрагент', 'Ведро', 'Сумма млн']
    const body = rows.map((r) => [
      getCompany(r.companyId)?.shortName ?? r.companyId,
      r.counterparty,
      r.bucket,
      String(r.amountMln).replace('.', ','),
    ])
    downloadCsv(`debtors-${year}.csv`, headers, body)
  }

  return (
    <>
      <PageShell
        breadcrumbs={[
          { label: 'Сводка', to: '/' },
          { label: 'Дебиторская задолженность' },
        ]}
        title="Дебиторская задолженность"
        subtitle={`Aging дебиторки (демо). ${periodLabel}. ${APP_COPY.ledgerRoadmap}`}
        actions={
          <button
            type="button"
            onClick={exportCsv}
            className="btn-ghost"
          >
            Скачать CSV
          </button>
        }
      />
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        <div className="grid gap-4 sm:grid-cols-4">
          <Mini title="0–30 дн." value={fmtMln(totals.buckets['0–30'])} />
          <Mini title="31–60 дн." value={fmtMln(totals.buckets['31–60'])} />
          <Mini title="61+ дн." value={fmtMln(totals.buckets['61+'])} />
          <Mini title="Итого" value={fmtMln(totals.total)} strong />
        </div>
        <DataTable<ARRow>
          columns={[
            {
              id: 'co',
              header: 'Компания',
              cell: (r) => (
                <Link className="font-medium text-emerald-800 hover:underline" to={`/company/${r.companyId}`}>
                  {getCompany(r.companyId)?.shortName ?? r.companyId}
                </Link>
              ),
            },
            { id: 'cp', header: 'Контрагент', cell: (r) => r.counterparty },
            { id: 'b', header: 'Ведро', cell: (r) => r.bucket },
            {
              id: 'a',
              header: 'Сумма, млн ₽',
              cell: (r) => <span className="font-semibold tabular-nums">{fmtMln(r.amountMln)}</span>,
            },
          ]}
          rows={rows}
        />
      </div>
    </>
  )
}

function Mini({ title, value, strong }: { title: string; value: string; strong?: boolean }) {
  return (
    <div className="surface-card surface-card--lift p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      <p className={`mt-1 text-lg tabular-nums ${strong ? 'font-bold text-slate-900' : 'font-semibold text-slate-800'}`}>{value}</p>
    </div>
  )
}
