import { WidgetCard } from '../components/WidgetCard'
import { PageTitle } from '../components/MatrixLayout'
import { vetTasks } from '../data/matrixMocks'

const statusLabel = {
  open: 'Открыта',
  in_progress: 'В работе',
  done: 'Выполнена',
} as const

const priorityClass = {
  high: 'bg-red-100 text-red-900',
  medium: 'bg-amber-100 text-amber-900',
} as const

export function TasksPage() {
  return (
    <>
      <PageTitle
        title="Задачи ветслужбы"
        subtitle="Очередь из Afimilk + ранние сигналы (модули 4.1 и 4.4). Приоритет — как утренний лист ветеринара."
      />
      <WidgetCard title="На сегодня">
        <ul className="divide-y divide-slate-200">
          {vetTasks.map((t) => (
            <li key={t.id} className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0">
              <div>
                <p className="font-semibold text-slate-900">
                  {t.barn} · №{t.cow}
                </p>
                <p className="text-sm text-slate-600">{t.issue}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded px-2 py-0.5 text-xs font-semibold ${priorityClass[t.priority]}`}>
                  {t.priority === 'high' ? 'Высокий' : 'Средний'}
                </span>
                <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                  {statusLabel[t.status]}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </WidgetCard>
    </>
  )
}
