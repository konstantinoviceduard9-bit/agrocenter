import { PageShell } from '../components/PageShell'
import { useDashboardFilters } from '../context/DashboardFiltersContext'
import { useDashboardData } from '../context/DashboardDataContext'
import { fmtMln } from '../lib/format'
import { DataTable } from '../components/DataTable'
import { Link } from 'react-router-dom'
import { downloadCsv } from '../lib/csv'
import type { APRow } from '../data/financeMocks'

export function CreditorsPage() {
  const { year, periodLabel } = useDashboardFilters()
  const { getCompany, getAPRows, apDue7d } = useDashboardData()
  const rows = getAPRows(year)
  const due7 = apDue7d(year)

  function exportCsv() {
    const headers = ['Компания', 'Поставщик', 'Дней до оплаты', 'Сумма млн']
    const body = rows.map((r) => [
      getCompany(r.companyId)?.shortName ?? r.companyId,
      r.vendor,
      String(r.dueInDays),
      String(r.amountMln).replace('.', ','),
    ])
    downloadCsv(`creditors-${year}.csv`, headers, body)
  }

  return (
    <>
      <PageShell
        title="Кредиторская задолженность"
        subtitle={`Поставщики и ближайшие оплаты (мок). ${periodLabel}.`}
        actions={
          <button
            type="button"
            onClick={exportCsv}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50"
          >
            Скачать CSV
          </button>
        }
      />
      <div className="space-y-6 px-6 py-8 lg:px-10">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          К оплате в горизонте <strong>7 дней</strong> (мок): <span className="tabular-nums font-bold">{fmtMln(due7)} млн ₽</span>
        </div>
        <DataTable<APRow>
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
            { id: 'v', header: 'Поставщик', cell: (r) => r.vendor },
            {
              id: 'd',
              header: 'Дней до оплаты',
              cell: (r) => (
                <span className={r.dueInDays <= 7 ? 'font-bold text-amber-800 tabular-nums' : 'tabular-nums'}>{r.dueInDays}</span>
              ),
            },
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
