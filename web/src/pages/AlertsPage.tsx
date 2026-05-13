import { Link } from 'react-router-dom'
import { PageShell } from '../components/PageShell'
import { DataTable } from '../components/DataTable'
import { useDashboardFilters } from '../context/DashboardFiltersContext'
import { useDashboardData } from '../context/DashboardDataContext'
import type { DerivedAlert } from '../data/deriveAlerts'

const categoryLabel = {
  debitor: 'Дебиторка',
  liquidity: 'Ликвидность',
  creditor: 'Кредиторка',
} as const

function SeverityBadge({ s }: { s: DerivedAlert['severity'] }) {
  const cls =
    s === 3
      ? 'bg-rose-100 text-rose-900 ring-rose-200'
      : s === 2
        ? 'bg-amber-100 text-amber-950 ring-amber-200'
        : 'bg-slate-100 text-slate-700 ring-slate-200'
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${cls}`}>
      {s === 3 ? 'Критично' : s === 2 ? 'Внимание' : 'Инфо'}
    </span>
  )
}

export function AlertsPage() {
  const { year, periodLabel } = useDashboardFilters()
  const { getAlerts } = useDashboardData()
  const rows = getAlerts(year)

  return (
    <>
      <PageShell
        breadcrumbs={[
          { label: 'Сводка', to: '/' },
          { label: 'Алерты' },
        ]}
        title="Алерты"
        subtitle={`Сигналы за ${year}. Период в шапке: ${periodLabel}. Правила: дебиторка по ведрам, горизонт кассы до 28 дн., оплата поставщику до 3 дн.`}
      />
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        <div className="grid gap-4 sm:grid-cols-3">
          <Mini title="Всего сигналов" value={String(rows.length)} strong />
          <Mini
            title="Критично (3)"
            value={String(rows.filter((r) => r.severity === 3).length)}
            tone="rose"
          />
          <Mini title="Внимание (2)" value={String(rows.filter((r) => r.severity === 2).length)} tone="amber" />
        </div>

        <DataTable<DerivedAlert>
          empty="Нет сигналов для выбранного года — см. кассу и дебиторку в демо-данных."
          columns={[
            {
              id: 'sev',
              header: 'Уровень',
              cell: (r) => <SeverityBadge s={r.severity} />,
            },
            {
              id: 'co',
              header: 'Компания',
              cell: (r) => (
                <Link className="font-medium text-emerald-800 hover:underline" to={`/company/${r.companyId}?tab=finance`}>
                  {r.companyName}
                </Link>
              ),
            },
            {
              id: 'cat',
              header: 'Тип',
              cell: (r) => <span className="text-slate-600">{categoryLabel[r.category]}</span>,
            },
            { id: 'title', header: 'Сигнал', cell: (r) => <span className="font-medium text-slate-900">{r.title}</span> },
            { id: 'detail', header: 'Детали', cell: (r) => <span className="max-w-md text-slate-600">{r.detail}</span> },
          ]}
          rows={rows}
        />

        <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Доставка в Telegram / MAX и подтверждение «прочитано» — после появления бэкенда и вебхуков.
        </p>
      </div>
    </>
  )
}

function Mini({ title, value, strong, tone }: { title: string; value: string; strong?: boolean; tone?: 'rose' | 'amber' }) {
  const toneCls =
    tone === 'rose' ? 'text-rose-800' : tone === 'amber' ? 'text-amber-900' : strong ? 'text-slate-900' : 'text-slate-800'
  return (
    <div className="surface-card surface-card--lift p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      <p className={`mt-1 text-2xl tabular-nums ${strong ? 'font-bold' : 'font-semibold'} ${toneCls}`}>{value}</p>
    </div>
  )
}
