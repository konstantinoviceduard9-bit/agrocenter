import { Link } from 'react-router-dom'
import { FeedingPipelinePanel } from '../components/FeedingPipelinePanel'
import { WidgetCard } from '../components/WidgetCard'
import { PageTitle } from '../components/MatrixLayout'
import { demoBatch, dtmProposal } from '../data/feedingPipeline'
import { fmtDec } from '../lib/format'

export function FeedingPage() {
  const batch = demoBatch
  const totalKg = dtmProposal.reduce((s, r) => s + r.proposedKg, 0)
  const totalDm = dtmProposal.reduce((s, r) => s + r.dmKg, 0)
  const totalCost = dtmProposal.reduce((s, r) => s + r.costRub, 0)

  return (
    <>
      <PageTitle
        title="Кормление · DTM"
        subtitle="Автозагрузка из Агроплема + AMTS → проверка зоотехником → выгрузка в DTM и кормогруппу Afimilk (демо-поток)."
      />

      <FeedingPipelinePanel />

      <section className="mt-8">
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
          Рецепт в DTM после подтверждения (предпросмотр)
        </h3>
        <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Общий вес, кг', value: fmtDec(totalKg, 2) },
            { label: 'СВ, кг', value: fmtDec(totalDm, 2) },
            { label: 'Стоимость / корова, ₽', value: fmtDec(totalCost, 2) },
            { label: 'Ревизия', value: `${batch.revision} · ${batch.revisionDate}` },
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
              value={batch.recipeName}
              className="mt-1 w-full rounded border border-slate-300 bg-slate-50 px-2 py-1.5 text-sm"
            />
            <p className="mt-3 text-xs text-slate-600">
              <strong>Замес № 14 · Силокинг</strong>
              <br />
              Следующий: Замес № 15 через ~18 мин
            </p>
            <label className="mt-3 flex items-center gap-2 text-sm">
              <input type="checkbox" defaultChecked readOnly className="rounded" />
              Включён
            </label>
          </WidgetCard>

          <WidgetCard title="Ингредиенты (после синхронизации)" className="lg:col-span-2">
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
                  {dtmProposal.map((row) => (
                    <tr key={row.code} className="border-b border-slate-100">
                      <td className="px-2 py-1.5 tabular-nums">{row.code}</td>
                      <td className="px-2 py-1.5">{row.name}</td>
                      <td className="px-2 py-1.5 text-right tabular-nums">{fmtDec(row.proposedKg, 1)}</td>
                      <td className="px-2 py-1.5 text-right tabular-nums">{fmtDec(row.dmPct, 0)}</td>
                      <td className="px-2 py-1.5 text-right tabular-nums">{fmtDec(row.dmKg, 1)}</td>
                      <td className="px-2 py-1.5 text-right tabular-nums">{fmtDec(row.costRub, 1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </WidgetCard>
        </div>
      </section>

      <p className="mt-4 text-xs text-slate-600">
        <Link to="/" className="font-medium text-blue-700 hover:underline">
          На пульт «Сегодня»
        </Link>
      </p>
    </>
  )
}
