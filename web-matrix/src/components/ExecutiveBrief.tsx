import { Link } from 'react-router-dom'
import { executiveBriefStats } from '../lib/presentationMode'
import { fmtInt } from '../lib/format'
import { groupDashboardHref } from '../lib/dashboardLinks'

function BriefCard({
  label,
  value,
  hint,
  to,
  accent,
}: {
  label: string
  value: number
  hint: string
  to: string
  accent: 'blue' | 'emerald' | 'amber' | 'slate'
}) {
  const accentClass = {
    blue: 'border-blue-200 bg-gradient-to-br from-blue-50 to-white text-blue-900',
    emerald: 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-white text-emerald-900',
    amber: 'border-amber-200 bg-gradient-to-br from-amber-50 to-white text-amber-900',
    slate: 'border-slate-200 bg-gradient-to-br from-slate-50 to-white text-slate-900',
  }[accent]

  return (
    <Link
      to={to}
      className={[
        'block rounded-xl border p-3 shadow-sm transition-shadow hover:shadow-md',
        accentClass,
      ].join(' ')}
    >
      <p className="text-[10px] font-bold uppercase tracking-wide opacity-80">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums">{fmtInt(value)}</p>
      <p className="mt-1 text-xs opacity-90">{hint}</p>
    </Link>
  )
}

export function ExecutiveBrief() {
  const s = executiveBriefStats()

  return (
    <section
      className="mb-4 rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50/90 via-white to-blue-50/80 p-3 shadow-sm sm:p-4"
      aria-label="Сводка для руководства"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-800">Сводка смены</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-800">Операции и персонал · демо май 2026</p>
        </div>
        <a
          href={groupDashboardHref()}
          className="shrink-0 rounded-lg border border-emerald-300/80 bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-emerald-900 hover:bg-emerald-50"
        >
          Финансы группы →
        </a>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <BriefCard
          label="Задачи в работе"
          value={s.openTasks}
          hint="Назначить и контролировать"
          to="/staff"
          accent="blue"
        />
        <BriefCard
          label="Сделано сегодня"
          value={s.reportsToday}
          hint="Журнал отчётов"
          to="/staff#reports"
          accent="emerald"
        />
        <BriefCard
          label="Вет · высокий"
          value={s.vetHighOpen}
          hint="Очередь Afimilk"
          to="/tasks"
          accent="amber"
        />
        <BriefCard
          label="Без коровника"
          value={s.barnPending}
          hint="Разделение телят"
          to="/barn-assignment"
          accent="slate"
        />
      </div>
    </section>
  )
}
