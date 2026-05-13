import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { roleLabel, type Company } from '../data/companies'
import { useDashboardData } from '../context/DashboardDataContext'
import { PageShell } from '../components/PageShell'
import { fmtMln } from '../lib/format'
import { useDashboardFilters } from '../context/DashboardFiltersContext'
import { DataTable } from '../components/DataTable'
import type { APRow, ARRow } from '../data/financeMocks'
import { getCompanyTriggers, roleTriggersSummary, type CompanyTrigger } from '../data/companyTriggers'
import {
  generateMockEmployees,
  getAssetsBreakdownDemo,
  getProfitBreakdownDemo,
  getRevenueBreakdownDemo,
  type MockEmployee,
} from '../data/companyOverviewExpandMocks'

function cell(v: number | null, suffix = '') {
  if (v == null) return '—'
  return `${fmtMln(v)}${suffix}`
}

type CompanyTab = 'overview' | 'finance' | 'triggers'

type OverviewKpiKey = 'revenue' | 'profit' | 'assets' | 'headcount'

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

  const [openOverviewKpi, setOpenOverviewKpi] = useState<OverviewKpiKey | null>(null)
  const [employeeDetail, setEmployeeDetail] = useState<MockEmployee | null>(null)

  const revenueLines = useMemo(
    () => (c ? getRevenueBreakdownDemo(c.id, c.revenue2025Mln) : null),
    [c],
  )
  const profitLines = useMemo(
    () => (c ? getProfitBreakdownDemo(c.id, c.netProfit2025Mln) : null),
    [c],
  )
  const assetsLines = useMemo(
    () => (c ? getAssetsBreakdownDemo(c.id, c.assets2025Mln) : null),
    [c],
  )
  const mockEmployees = useMemo(
    () => (c ? generateMockEmployees(c.id, c.employees) : []),
    [c],
  )

  useEffect(() => {
    setOpenOverviewKpi(null)
    setEmployeeDetail(null)
  }, [companyId])

  useEffect(() => {
    if (!employeeDetail) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setEmployeeDetail(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [employeeDetail])

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
        'shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold',
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
        ? `Набор мониторинга под роль «${roleLabel[c.role]}»: ${roleTriggersSummary(c.role)}. В таблице — демо-пороги и каналы; расчёт и доставка — после подключения данных и бэкенда.`
        : `${c.fullName} · ИНН ${c.inn} · ${periodLabel}`

  return (
    <>
      <PageShell
        breadcrumbs={[
          { label: 'Сводка', to: '/' },
          { label: c.shortName },
        ]}
        title={title}
        subtitle={subtitle}
      />
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-4 sm:px-6 sm:py-6 lg:px-10">
        <div className="flex gap-2 overflow-x-auto overscroll-x-contain pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:overflow-visible [&::-webkit-scrollbar]:hidden">
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
            <p className="max-w-3xl text-sm font-medium text-slate-800">
              Показатели ниже — кнопки: нажмите плитку, чтобы раскрыть разбиение по строкам или список сотрудников; по сотруднику откроется карточка.
            </p>
            <p className="max-w-3xl text-[11px] leading-snug text-slate-500" data-overview-ui="kpi-expand-v2">
              Метка интерфейса: <strong className="font-mono text-slate-600">kpi-expand-v2</strong> — на плитках должны быть зелёная стрелка и строка «Развернуть…». Если их нет, нажмите Ctrl+F5 (жёсткое обновление без кэша).
            </p>
            <OverviewKpiBlock
              c={c}
              openKpi={openOverviewKpi}
              onToggle={(k) => setOpenOverviewKpi((prev) => (prev === k ? null : k))}
              revenueLines={revenueLines}
              profitLines={profitLines}
              assetsLines={assetsLines}
              mockEmployees={mockEmployees}
              onOpenEmployee={setEmployeeDetail}
            />
          </>
        ) : tab === 'finance' ? (
          <div className="space-y-6 max-w-4xl">
            <div className="grid gap-4 sm:grid-cols-3">
              <Tile label="Касса (демо)" value={cash ? `${fmtMln(cash.cashMln)} млн ₽` : '—'} />
              <Tile label="Дней покрытия (усл.)" value={cash ? String(cash.runwayDays) : '—'} />
              <Tile label="Дебиторка 61+ (демо)" value={fmtMln(ar.filter((x) => x.bucket === '61+').reduce((s, x) => s + x.amountMln, 0))} />
            </div>
            <div>
              <h3 className="mb-2 text-sm font-bold text-slate-800">Дебиторка</h3>
              <DataTable<ARRow>
                empty="Нет строк дебиторки для этой компании в демо-данных."
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
                empty="Нет строк кредиторки для этой компании в демо-данных."
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
              <strong>{triggers.length}</strong> триггеров в демо для <strong>{c.shortName}</strong>. В таблице заданы{' '}
              <strong>условные пороги</strong> и <strong>каналы уведомлений</strong> (шаблон под роль «{roleLabel[c.role]}»). Подключение к 1С, расчётам и TG / MAX — отдельный этап после согласования.
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
                  id: 'thr',
                  header: 'Порог (демо)',
                  cell: (r) => (
                    <span className="text-xs text-slate-800 tabular-nums" title="Условное значение для презентации">
                      {r.thresholdDemo ?? '—'}
                    </span>
                  ),
                },
                {
                  id: 'nfy',
                  header: 'Канал (демо)',
                  cell: (r) => (
                    <span className="text-xs font-semibold text-emerald-900">{r.notifyDemo ?? '—'}</span>
                  ),
                },
              ]}
              rows={triggers}
              rowKey={(r) => r.id}
            />
            <p className="mt-2 text-xs text-slate-500">
              Не видите колонок «Порог» и «Канал»? Прокрутите таблицу <strong>вправо</strong> — на узком экране они в конце строки.
            </p>
          </div>
        )}
      </div>
      {employeeDetail ? <EmployeeDetailModal employee={employeeDetail} onClose={() => setEmployeeDetail(null)} /> : null}
    </>
  )
}

function KpiExpandChevron({ expanded }: { expanded: boolean }) {
  return (
    <span
      className={[
        'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-200/90 bg-emerald-50 text-emerald-800',
        'transition-transform duration-200 ease-out',
        expanded ? 'rotate-180' : '',
      ].join(' ')}
      aria-hidden
    >
      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z"
          clipRule="evenodd"
        />
      </svg>
    </span>
  )
}

function OverviewKpiTile({
  open,
  onClick,
  label,
  valueLine,
}: {
  open: boolean
  onClick: () => void
  label: string
  valueLine: string
}) {
  const tileClass = [
    'surface-card surface-card--lift group relative flex w-full cursor-pointer flex-col gap-3 rounded-xl p-5 text-left',
    'transition-[box-shadow,transform] duration-150 active:scale-[0.99]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2',
    open ? 'ring-2 ring-emerald-600 ring-offset-2 shadow-md' : 'hover:border-emerald-200/80 hover:shadow-md',
  ].join(' ')

  return (
    <button
      type="button"
      className={tileClass}
      style={{ touchAction: 'manipulation' }}
      aria-expanded={open}
      aria-controls="overview-kpi-panel"
      title={open ? `${label}: свернуть детали` : `${label}: развернуть полную информацию (демо)`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
          <span className="mt-2 block text-xl font-bold tabular-nums text-slate-900">{valueLine}</span>
        </div>
        <KpiExpandChevron expanded={open} />
      </div>
      <span className="text-xs font-semibold text-emerald-800 underline-offset-2 group-hover:underline">
        {open ? 'Скрыть детали' : 'Развернуть полную информацию'}
      </span>
    </button>
  )
}

function OverviewKpiBlock({
  c,
  openKpi,
  onToggle,
  revenueLines,
  profitLines,
  assetsLines,
  mockEmployees,
  onOpenEmployee,
}: {
  c: Company
  openKpi: OverviewKpiKey | null
  onToggle: (k: OverviewKpiKey) => void
  revenueLines: ReturnType<typeof getRevenueBreakdownDemo>
  profitLines: ReturnType<typeof getProfitBreakdownDemo>
  assetsLines: ReturnType<typeof getAssetsBreakdownDemo>
  mockEmployees: MockEmployee[]
  onOpenEmployee: (e: MockEmployee) => void
}) {
  const detailPanelRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!openKpi) return
    detailPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [openKpi])

  return (
    <div className="relative z-10 max-w-3xl space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <OverviewKpiTile
          open={openKpi === 'revenue'}
          onClick={() => onToggle('revenue')}
          label="Выручка 2025"
          valueLine={cell(c.revenue2025Mln, ' млн ₽')}
        />
        <OverviewKpiTile
          open={openKpi === 'profit'}
          onClick={() => onToggle('profit')}
          label="Чистая прибыль 2025"
          valueLine={cell(c.netProfit2025Mln, ' млн ₽')}
        />
        <OverviewKpiTile
          open={openKpi === 'assets'}
          onClick={() => onToggle('assets')}
          label="Активы 2025"
          valueLine={cell(c.assets2025Mln, ' млн ₽')}
        />
        <OverviewKpiTile
          open={openKpi === 'headcount'}
          onClick={() => onToggle('headcount')}
          label="Численность"
          valueLine={c.employees != null ? `${c.employees} чел.` : '—'}
        />
      </div>

      {openKpi ? (
        <div
          ref={detailPanelRef}
          id="overview-kpi-panel"
          role="region"
          aria-label="Детализация показателя"
          className="surface-card rounded-xl border border-slate-200/80 p-4 sm:p-5"
        >
          {openKpi === 'revenue' ? (
            revenueLines ? (
              <KpiBreakdownList title="Выручка по строкам (демо)" lines={revenueLines} />
            ) : (
              <p className="text-sm text-slate-600">Нет данных в моке для разбиения выручки.</p>
            )
          ) : null}
          {openKpi === 'profit' ? (
            profitLines ? (
              <KpiBreakdownList title="Прибыль по строкам (демо)" lines={profitLines} />
            ) : (
              <p className="text-sm text-slate-600">Нет данных в моке для разбиения прибыли.</p>
            )
          ) : null}
          {openKpi === 'assets' ? (
            assetsLines ? (
              <KpiBreakdownList title="Активы по строкам (демо)" lines={assetsLines} />
            ) : (
              <p className="text-sm text-slate-600">Нет данных в моке для разбиения активов.</p>
            )
          ) : null}
          {openKpi === 'headcount' ? (
            mockEmployees.length > 0 ? (
              <div>
                <h3 className="text-sm font-bold text-slate-800">Сотрудники</h3>
                <p className="mt-1 text-xs text-slate-500">Демо-список по численности. Нажмите строку — откроется карточка с телефоном, Telegram и адресом.</p>
                <ul className="mt-3 max-h-80 divide-y divide-slate-100 overflow-y-auto rounded-lg border border-slate-100">
                  {mockEmployees.map((e) => (
                    <li key={e.id}>
                      <button
                        type="button"
                        className="flex w-full cursor-pointer flex-col gap-0.5 px-3 py-2.5 text-left hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-600"
                        onClick={() => onOpenEmployee(e)}
                      >
                        <span className="font-semibold text-slate-900">{e.fullName}</span>
                        <span className="text-sm text-slate-600">{e.position}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-slate-600">Численность не задана или равна нулю — список пуст.</p>
            )
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

function KpiBreakdownList({ title, lines }: { title: string; lines: NonNullable<ReturnType<typeof getRevenueBreakdownDemo>> }) {
  return (
    <div>
      <h3 className="text-sm font-bold text-slate-800">{title}</h3>
      <ul className="mt-3 space-y-2">
        {lines.map((row) => (
          <li
            key={row.label}
            className="flex items-baseline justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2"
          >
            <span className="text-sm text-slate-800" title={row.hint}>
              {row.label}
            </span>
            <span className="shrink-0 text-sm font-bold tabular-nums text-slate-900">{fmtMln(row.valueMln)} млн ₽</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function EmployeeDetailModal({ employee, onClose }: { employee: MockEmployee; onClose: () => void }) {
  const telHref = `tel:${employee.phone.replace(/[^\d+]/g, '')}`
  const tgUrl = `https://t.me/${employee.telegramUsername}`

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/45 p-0 sm:items-center sm:p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="employee-card-title"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 id="employee-card-title" className="text-lg font-bold text-slate-900">
            Контакт и карточка
          </h2>
          <button
            type="button"
            className="shrink-0 rounded-lg px-2 py-1 text-sm font-semibold text-slate-600 hover:bg-slate-100"
            onClick={onClose}
          >
            Закрыть
          </button>
        </div>

        <p className="mt-2 text-base font-semibold text-slate-900">{employee.fullName}</p>
        <p className="text-sm text-slate-600">{employee.position}</p>

        <div className="mt-5 rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-emerald-900">Контакты</h3>
          <dl className="mt-3 space-y-3">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Телефон</dt>
              <dd className="mt-0.5">
                <a href={telHref} className="text-sm font-semibold text-emerald-800 underline-offset-2 hover:underline">
                  {employee.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Telegram</dt>
              <dd className="mt-0.5">
                <a
                  href={tgUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-emerald-800 underline-offset-2 hover:underline"
                >
                  @{employee.telegramUsername}
                </a>
                <span className="mt-1 block text-[11px] text-slate-500">Откроется в Telegram (если установлен).</span>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Адрес проживания</dt>
              <dd className="mt-0.5 text-sm leading-snug text-slate-900">{employee.residentialAddress}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-5">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Служебные поля (демо)</h3>
          <dl className="mt-2 space-y-2.5">
            <div>
              <dt className="text-[11px] text-slate-500">Подразделение</dt>
              <dd className="text-sm text-slate-800">{employee.department}</dd>
            </div>
            <div>
              <dt className="text-[11px] text-slate-500">Табельный номер</dt>
              <dd className="text-sm text-slate-800">{employee.tabNumber}</dd>
            </div>
            <div>
              <dt className="text-[11px] text-slate-500">E-mail</dt>
              <dd className="text-sm text-slate-800">
                <a href={`mailto:${employee.email}`} className="text-emerald-800 underline-offset-2 hover:underline">
                  {employee.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[11px] text-slate-500">Дата приёма</dt>
              <dd className="text-sm text-slate-800">{employee.hiredAt}</dd>
            </div>
            <div>
              <dt className="text-[11px] text-slate-500">Примечание</dt>
              <dd className="text-sm text-slate-600">{employee.note}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface-card surface-card--lift p-5">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-2 text-xl font-bold tabular-nums text-slate-900">{value}</dd>
    </div>
  )
}
