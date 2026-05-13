import { Link } from 'react-router-dom'
import { useDashboardData } from '../context/DashboardDataContext'
import { DATA_STRIP_COPY } from '../lib/appCopy'

function truncate(s: string, max: number) {
  if (s.length <= max) return s
  return `${s.slice(0, max - 1)}…`
}

export function DataSourceStrip() {
  const { dataSource, loadError, loadWarnings } = useDashboardData()

  const sourceMain = loadError ? (
    <>
      Снимок не применён ({truncate(loadError, 72)}). {DATA_STRIP_COPY.loadFailedFallback}
    </>
  ) : dataSource === 'file' ? (
    <>
      Источник данных: JSON-снимок{' '}
      <code className="rounded bg-slate-200/70 px-1 font-mono text-[10px] text-slate-800">
        {DATA_STRIP_COPY.filePath}
      </code>{' '}
      ({DATA_STRIP_COPY.fileApplies})
    </>
  ) : (
    <>{DATA_STRIP_COPY.builtin}</>
  )

  return (
    <div className="border-t border-slate-100 bg-slate-50/90 px-4 py-2 text-[11px] leading-snug text-slate-600 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className={loadError ? 'text-amber-900' : ''}>{sourceMain}</span>
        {!loadError && loadWarnings.length > 0 ? (
          <Link
            to="/admin/settings"
            className="shrink-0 font-medium text-emerald-800 underline decoration-emerald-800/30 underline-offset-2 hover:decoration-emerald-800"
          >
            Предупреждений снимка: {loadWarnings.length}
          </Link>
        ) : null}
      </div>
    </div>
  )
}
