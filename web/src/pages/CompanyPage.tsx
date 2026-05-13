import { Link, NavLink, useParams, useSearchParams } from 'react-router-dom'
import { roleLabel } from '../data/companies'
import { useDashboardData } from '../context/DashboardDataContext'
import { PageShell } from '../components/PageShell'
import { fmtMln } from '../lib/format'
import { useDashboardFilters } from '../context/DashboardFiltersContext'
import { DataTable } from '../components/DataTable'
import type { APRow, ARRow } from '../data/financeMocks'

function cell(v: number | null, suffix = '') {
  if (v == null) return '—'
  return `${fmtMln(v)}${suffix}`
}

const tabClass = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-lg px-3 py-2 text-sm font-semibold',
    isActive ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:bg-slate-100',
  ].join(' ')

export function CompanyPage() {
  const { companyId } = useParams<{ companyId: string }>()
  const [sp] = useSearchParams()
  const tab = sp.get('tab') === 'finance' ? 'finance' : 'overview'
  const { year, periodLabel } = useDashboardFilters()
  const { getCompany, getCashRows, getARRows, getAPRows } = useDashboardData()
  const c = companyId ? getCompany(companyId) : undefined

  if (!c) {
    return (
      <div className="p-10">
        <p className="text-slate-600">Компания не найдена.</p>
        <Link to="/" className="mt-4 inline-block text-emerald-700 hover:underline">
          На сводку
        </Link>
      </div>
    )
  }

  const base = `/company/${c.id}`
  const cash = getCashRows(year).find((r) => r.companyId === c.id)
  const ar = getARRows(year).filter((r) => r.companyId === c.id)
  const ap = getAPRows(year).filter((r) => r.companyId === c.id)

  return (
    <>
      <PageShell
        title={tab === 'finance' ? `Финансы — ${c.shortName}` : c.shortName}
        subtitle={
          tab === 'finance'
            ? `Мок по компании за ${periodLabel}.`
            : `${c.fullName} · ИНН ${c.inn} · ${periodLabel}`
        }
      />
      <div className="space-y-6 px-6 py-6 lg:px-10">
        <div className="text-sm text-slate-500">
          <Link to="/" className="text-emerald-700 hover:underline">
            Сводка
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-800">{c.shortName}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <NavLink to={base} end className={tabClass}>
            Обзор
          </NavLink>
          <NavLink to={`${base}?tab=finance`} className={tabClass}>
            Финансы (мок)
          </NavLink>
        </div>

        {tab === 'overview' ? (
          <>
            <header className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">{roleLabel[c.role]}</p>
              <h2 className="mt-1 text-xl font-bold text-slate-900 lg:text-2xl">{c.fullName}</h2>
              {c.note ? (
                <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">{c.note}</p>
              ) : null}
            </header>
            <dl className="grid max-w-3xl gap-4 sm:grid-cols-2">
              <Tile label="Выручка 2025" value={cell(c.revenue2025Mln, ' млн ₽')} />
              <Tile label="Чистая прибыль 2025" value={cell(c.netProfit2025Mln, ' млн ₽')} />
              <Tile label="Активы 2025" value={cell(c.assets2025Mln, ' млн ₽')} />
              <Tile label="Численность" value={c.employees != null ? `${c.employees} чел.` : '—'} />
            </dl>
          </>
        ) : (
          <div className="space-y-6 max-w-4xl">
            <div className="grid gap-4 sm:grid-cols-3">
              <Tile label="Касса (мок)" value={cash ? `${fmtMln(cash.cashMln)} млн ₽` : '—'} />
              <Tile label="Дней покрытия (усл.)" value={cash ? String(cash.runwayDays) : '—'} />
              <Tile label="Дебиторка 61+ (мок)" value={fmtMln(ar.filter((x) => x.bucket === '61+').reduce((s, x) => s + x.amountMln, 0))} />
            </div>
            <div>
              <h3 className="mb-2 text-sm font-bold text-slate-800">Дебиторка</h3>
              <DataTable<ARRow>
                empty="Нет строк дебиторки для этой компании в моке."
                columns={[
                  { id: 'cp', header: 'Контрагент', cell: (r) => r.counterparty },
                  { id: 'b', header: 'Ведро', cell: (r) => r.bucket },
                  { id: 'a', header: 'Сумма, млн ₽', cell: (r) => <span className="font-semibold tabular-nums">{fmtMln(r.amountMln)}</span> },
                ]}
                rows={ar}
              />
            </div>
            <div>
              <h3 className="mb-2 text-sm font-bold text-slate-800">Кредиторка</h3>
              <DataTable<APRow>
                empty="Нет строк кредиторки для этой компании в моке."
                columns={[
                  { id: 'v', header: 'Поставщик', cell: (r) => r.vendor },
                  { id: 'd', header: 'Дней до оплаты', cell: (r) => r.dueInDays },
                  { id: 'a', header: 'Сумма, млн ₽', cell: (r) => <span className="font-semibold tabular-nums">{fmtMln(r.amountMln)}</span> },
                ]}
                rows={ap}
              />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-2 text-xl font-bold tabular-nums text-slate-900">{value}</dd>
    </div>
  )
}
