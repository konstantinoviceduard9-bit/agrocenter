import { matrixFarmHref } from '../lib/dashboardLinks'

export function MatrixFarmLinkCard() {
  return (
    <div className="surface-card border-blue-200/90 bg-gradient-to-br from-blue-50/90 to-white p-5 ring-1 ring-blue-200/60">
      <p className="text-xs font-semibold uppercase tracking-wide text-blue-800">Операции фермы — отдельный продукт</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">
        На этом дашборде — только <strong>финансы</strong> СХП «Нерал-Матрикс» (выручка, касса, дебиторка). Учёт стада,
        дойки, лечение и карта техники — в пульте фермы.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={matrixFarmHref()}
          className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
        >
          Открыть пульт Матрикс
        </a>
        <a
          href={matrixFarmHref('tasks')}
          className="rounded-lg border border-blue-300 bg-white px-4 py-2 text-sm font-semibold text-blue-900 hover:bg-blue-50"
        >
          Задачи ветслужбы
        </a>
      </div>
    </div>
  )
}
