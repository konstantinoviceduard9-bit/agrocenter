import { matrixFarmHref } from '../lib/dashboardLinks'

/** Разделение продуктов: здесь только финансы, операции фермы — в другом приложении. */
export function CrossDashboardStrip() {
  return (
    <div className="border-b border-blue-200/90 bg-gradient-to-r from-blue-50 to-slate-50 px-4 py-2.5 text-sm text-slate-800">
      <span className="font-semibold text-blue-900">Этот сайт — финансы группы</span>
      <span className="mx-2 text-slate-400">·</span>
      Стадо, корма, задачи ветслужбы, GPS техники — в{' '}
      <a
        href={matrixFarmHref()}
        className="font-semibold text-blue-800 underline decoration-blue-400/80 underline-offset-2 hover:text-blue-950"
      >
        пульте фермы «Нерал-Матрикс»
      </a>
      .
    </div>
  )
}
