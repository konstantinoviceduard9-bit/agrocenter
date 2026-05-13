import { Link, useParams, useSearchParams } from 'react-router-dom'
import { roleLabel } from '../data/companies'
import { useDashboardData } from '../context/DashboardDataContext'
import { PageShell } from '../components/PageShell'
import { fmtMln } from '../lib/format'
import { useDashboardFilters } from '../context/DashboardFiltersContext'
import { DataTable } from '../components/DataTable'
import type { APRow, ARRow } from '../data/financeMocks'
import { getCompanyTriggers, roleTriggersSummary, type CompanyTrigger } from '../data/companyTriggers'

function cell(v: number | null, suffix = '') {
  if (v == null) return '—'
  return `${fmtMln(v)}${suffix}`
}

type CompanyTab = 'overview' | 'finance' | 'triggers'

function parseTab(raw: string | null): CompanyTab {
  if (raw === 'finance') return 'finance'
  if (raw === 'triggers') return 'triggers'
  return 'overview'
}

export function CompanyPage() {
  const { companyId } = useParams<{ companyId: string }>()
  const [sp] = useSearchParams()
  const tab = parseTab(sp.get('tab'))
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
  const triggers = getCompanyTriggers(c)

  const tabBtn = (t: CompanyTab, label: string, to: string) => (
    <Link
      to={to}
      className={[
        'rounded-lg px-3 py-2 text-sm font-semibold',
        tab === t ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:bg-slate-100',
      ].join(' ')}
    >
      {label}
    </Link>
  )

  const title =
    tab === 'finance' ? `Финансы — ${c.shortName}` : tab === 'triggers' ? `Триггеры — ${c.shortName}` : c.shortName

  const subtitle =
    tab === 'finance'
      ? `Мок по компании за ${periodLabel}.`
      : tab === 'triggers'
        ? `Набор мониторинга под роль «${roleLabel[c.role]}»: ${roleTriggersSummary(c.role)}. Пороги и push в TG / MAX — после настройки бэкенда.`
        : `${c.fullName} · ИНН ${c.inn} · ${periodLabel}`

  return (
    <>
      <PageShell title={title} subtitle={subtitle} />
      <div className="space-y-6 px-6 py-6 lg:px-10">
        <div className="text-sm text-slate-500">
          <Link to="/" className="text-emerald-700 hover:underline">
            Сводка
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-800">{c.shortName}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {tabBtn('overview', 'Обзор', base)}
          {tabBtn('finance', 'Финансы (мок)', `${base}?tab=finance`)}
          {tabBtn('triggers', 'Триггеры', `${base}?tab=triggers`)}
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
            <p className="max-w-3xl text-sm text-slate-600">
              Триггеры по этому юрлицу: вкладка{' '}
              <Link to={`${base}?tab=triggers`} className="font-semibold text-emerald-800 hover:underline">
                «Триггеры»
              </Link>
              .
            </p>
            <dl className="grid max-w-3xl gap-4 sm:grid-cols-2">
              <Tile label="Выручка 2025" value={cell(c.revenue2025Mln, ' млн ₽')} />
              <Tile label="Чистая прибыль 2025" value={cell(c.netProfit2025Mln, ' млн ₽')} />
              <Tile label="Активы 2025" value={cell(c.assets2025Mln, ' млн ₽')} />
              <Tile label="Численность" value={c.employees != null ? `${c.employees} чел.` : '—'} />
            </dl>
          </>
        ) : tab === 'finance' ? (
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
        ) : (
          <div className="max-w-4xl space-y-6">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-950">
              <strong>{triggers.length}</strong> шаблонов триггеров для <strong>{c.shortName}</strong>. Ниже — что логично мониторить для{' '}
              <strong>{roleLabel[c.role]}</strong> (из концепции дашборда и типовых рисков отрасли). Реальные пороги и уведомления подключим к данным и TG позже.
            </div>
            <DataTable<CompanyTrigger>
              columns={[
                {
                  id: 'area',
                  header: 'Область',
                  cell: (r) => <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{r.area}</span>,
                },
                { id: 'title', header: 'Триггер', cell: (r) => <span className="font-medium text-slate-900">{r.title}</span> },
                { id: 'desc', header: 'Смысл / условие', cell: (r) => <span className="text-slate-600">{r.description}</span> },
                {
                  id: 'act',
                  header: 'Действие',
                  cell: () => (
                    <span className="text-xs text-slate-400" title="Позже: пороги и доставка в мессенджеры">
                      Шаблон
                    </span>
                  ),
                },
              ]}
              rows={triggers}
            />
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
