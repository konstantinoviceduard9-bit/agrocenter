import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { WidgetCard } from './WidgetCard'
import { useStaffAuth } from '../hooks/useStaffAuth'
import { loadActiveVet } from '../data/vetStaff'
import { hasFullFarmAccess } from '../lib/staffRoleAccess'
import {
  exportReportsCsv,
  loadWorkReports,
  reconcileWorkReportsFromState,
  reportsForViewer,
  subscribeWorkReports,
  workReportKindLabel,
  type WorkReport,
  type WorkReportKind,
} from '../lib/workReports'

const kindFilterOptions: { id: 'all' | WorkReportKind; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'leadership_done', label: 'От руководства' },
  { id: 'vet_done', label: 'Ветслужба' },
  { id: 'barn_handover', label: 'Коровники' },
]

const kindBadgeClass: Record<WorkReportKind, string> = {
  leadership_done: 'bg-indigo-100 text-indigo-900',
  vet_done: 'bg-emerald-100 text-emerald-900',
  barn_handover: 'bg-blue-100 text-blue-900',
}

function ReportRow({ report }: { report: WorkReport }) {
  return (
    <li className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="font-semibold text-slate-900">{report.title}</p>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${kindBadgeClass[report.kind]}`}>
          {workReportKindLabel(report.kind)}
        </span>
      </div>
      {report.detail ? <p className="mt-1 text-sm text-slate-600">{report.detail}</p> : null}
      <p className="mt-2 text-xs text-slate-500">
        <span className="font-medium text-slate-700">{report.actorName}</span>
        {' · '}
        {report.completedAt}
      </p>
    </li>
  )
}

export function WorkReportsPanel({ embedded = false }: { embedded?: boolean }) {
  const { employee } = useStaffAuth()
  const [reports, setReports] = useState(loadWorkReports)
  const [kindFilter, setKindFilter] = useState<'all' | WorkReportKind>('all')

  const isManager = employee ? hasFullFarmAccess(employee.roleId) : true

  useEffect(() => {
    reconcileWorkReportsFromState(loadActiveVet())
    setReports(loadWorkReports())
    return subscribeWorkReports(() => setReports(loadWorkReports()))
  }, [])

  const visible = useMemo(
    () => reportsForViewer(reports, employee?.name ?? null, isManager),
    [reports, employee?.name, isManager],
  )

  const filtered = useMemo(() => {
    if (kindFilter === 'all') return visible
    return visible.filter((r) => r.kind === kindFilter)
  }, [visible, kindFilter])

  const downloadCsv = () => {
    const blob = new Blob(['\uFEFF' + exportReportsCsv(filtered)], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `neral-matrix-reports-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section id="reports" className={embedded ? 'mt-4 scroll-mt-4' : undefined}>
      {!embedded ? (
        <p className="mb-3 text-sm text-slate-600">
          {isManager
            ? 'Журнал выполненных задач, ветобслуживания и передач по коровникам.'
            : 'Ваши отмеченные выполнения.'}
        </p>
      ) : null}

      <div className="mb-3 flex flex-wrap gap-2">
        {kindFilterOptions.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setKindFilter(opt.id)}
            className={[
              'rounded-full px-3 py-1 text-xs font-semibold',
              kindFilter === opt.id ? 'bg-slate-800 text-white' : 'bg-white text-slate-700 ring-1 ring-slate-200',
            ].join(' ')}
          >
            {opt.label}
          </button>
        ))}
        {isManager && filtered.length > 0 ? (
          <button
            type="button"
            onClick={downloadCsv}
            className="matrix-touch-btn ml-auto rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-800"
          >
            Скачать CSV
          </button>
        ) : null}
      </div>

      <WidgetCard
        title={isManager ? `Отчёты по работам · ${filtered.length}` : `Мои отчёты · ${filtered.length}`}
        footer="Демо: записи хранятся в браузере на этом устройстве"
      >
        {filtered.length === 0 ? (
          <p className="text-sm text-slate-600">
            Пока нет зафиксированных работ. Отметьте задачу в{' '}
            <Link to="/my-tasks" className="font-medium text-blue-700 hover:underline">
              «Мои задачи»
            </Link>
            , в{' '}
            <Link to="/tasks" className="font-medium text-blue-700 hover:underline">
              очереди ветслужбы
            </Link>{' '}
            или подтвердите передачу в{' '}
            <Link to="/barn-assignment" className="font-medium text-blue-700 hover:underline">
              коровниках
            </Link>
            .
          </p>
        ) : (
          <ul className="space-y-3">
            {filtered.map((r) => (
              <ReportRow key={r.id} report={r} />
            ))}
          </ul>
        )}
      </WidgetCard>
    </section>
  )
}
