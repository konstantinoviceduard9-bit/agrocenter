import { Link } from 'react-router-dom'
import { WidgetCard } from '../components/WidgetCard'
import { PageTitle } from '../components/MatrixLayout'
import { feedingIngredients, feedingKpi } from '../data/matrixMocks'
import { fmtDec } from '../lib/format'

export function FeedingPage() {
  return (
    <>
      <PageTitle
        title="Кормление · DTM"
        subtitle="Редактор рецепта (демо по скрину DTM): замесы, ингредиенты, KPI на корову."
      />
      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Общий вес, кг', value: fmtDec(feedingKpi.totalWeightKg, 2) },
          { label: 'СВ, кг', value: fmtDec(feedingKpi.dryMatterKg, 2) },
          { label: 'Стоимость / корова, ₽', value: fmtDec(feedingKpi.costPerCowRub, 2) },
          { label: 'Ревизия', value: `${feedingKpi.revision} · ${feedingKpi.revisionDate}` },
        ].map((k) => (
          <div
            key={k.label}
            className="rounded-lg border border-blue-900/20 bg-gradient-to-br from-blue-800 to-blue-700 px-4 py-3 text-white shadow"
          >
            <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-100/90">{k.label}</p>
            <p className="mt-1 text-xl font-bold tabular-nums">{k.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <WidgetCard title="Рецепт" className="lg:col-span-1">
          <label className="block text-xs font-semibold text-slate-500">Название</label>
          <input
            readOnly
            value={feedingKpi.recipeName}
            className="mt-1 w-full rounded border border-slate-300 bg-slate-50 px-2 py-1.5 text-sm"
          />
          <p className="mt-3 text-xs text-slate-600">
            <strong>{feedingKpi.currentMix}</strong>
            <br />
            Следующий: {feedingKpi.nextMix}
          </p>
          <label className="mt-3 flex items-center gap-2 text-sm">
            <input type="checkbox" defaultChecked readOnly className="rounded" />
            Включён
          </label>
        </WidgetCard>

        <WidgetCard title="Ингредиенты" className="lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[32rem] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-300 bg-slate-100 text-slate-600">
                  <th className="px-2 py-2 font-semibold">Код</th>
                  <th className="px-2 py-2 font-semibold">Наименование</th>
                  <th className="px-2 py-2 text-right font-semibold">кг/корова</th>
                  <th className="px-2 py-2 text-right font-semibold">% СВ</th>
                  <th className="px-2 py-2 text-right font-semibold">СВ кг</th>
                  <th className="px-2 py-2 text-right font-semibold">₽/корова</th>
                </tr>
              </thead>
              <tbody>
                {feedingIngredients.map((row) => (
                  <tr key={row.code} className="border-b border-slate-100 hover:bg-blue-50/40">
                    <td className="px-2 py-1.5 tabular-nums">{row.code}</td>
                    <td className="px-2 py-1.5">{row.name}</td>
                    <td className="px-2 py-1.5 text-right tabular-nums">{fmtDec(row.kg, 1)}</td>
                    <td className="px-2 py-1.5 text-right tabular-nums">{fmtDec(row.dmPct, 0)}</td>
                    <td className="px-2 py-1.5 text-right tabular-nums">{fmtDec(row.dmKg, 1)}</td>
                    <td className="px-2 py-1.5 text-right tabular-nums">{fmtDec(row.cost, 1)}</td>
                  </tr>
                ))}
                <tr className="bg-slate-100 font-semibold">
                  <td colSpan={2} className="px-2 py-2">
                    Итого
                  </td>
                  <td className="px-2 py-2 text-right tabular-nums">{fmtDec(feedingKpi.totalWeightKg, 2)}</td>
                  <td />
                  <td className="px-2 py-2 text-right tabular-nums">{fmtDec(feedingKpi.dryMatterKg, 2)}</td>
                  <td className="px-2 py-2 text-right tabular-nums">{fmtDec(feedingKpi.costPerCowRub, 2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </WidgetCard>
      </div>

      <p className="mt-4 text-xs text-slate-600">
        Связка Afimilk ↔ DTM в демо не активна.{' '}
        <Link to="/" className="font-medium text-blue-700 hover:underline">
          На пульт «Сегодня»
        </Link>
      </p>
    </>
  )
}
