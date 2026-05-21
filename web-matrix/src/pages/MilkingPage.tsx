import { WidgetCard } from '../components/WidgetCard'
import { PageTitle } from '../components/MatrixLayout'
import { milkProduction } from '../data/matrixMocks'
import { categoryCountItems } from '../data/cowLists'
import { fmtDec, fmtInt, fmtPct } from '../lib/format'
import { CountList } from '../components/CountList'

export function MilkingPage() {
  return (
    <>
      <PageTitle
        title="Дойка"
        subtitle="Сводка по последней дойке и проблемам идентификации (как в AfiFarm → вкладка «Дойка»)."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <WidgetCard title="Текущая смена">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <dt className="text-slate-600">Надой смены, л</dt>
            <dd className="text-right font-bold tabular-nums">{fmtInt(milkProduction.lastSessionLiters)}</dd>
            <dt className="text-slate-600">Доено голов</dt>
            <dd className="text-right font-bold tabular-nums">{fmtInt(milkProduction.cowsMilkedLastSession)}</dd>
            <dt className="text-slate-600">Средний надой, л</dt>
            <dd className="text-right font-bold tabular-nums">{fmtDec(milkProduction.avgPerCowLiters, 1)}</dd>
            <dt className="text-slate-600">Жир / белок</dt>
            <dd className="text-right font-bold tabular-nums">
              {fmtPct(milkProduction.fatPct)} / {fmtPct(milkProduction.proteinPct)}
            </dd>
          </dl>
        </WidgetCard>
        <WidgetCard title="Идентификация и метки">
          <CountList items={categoryCountItems('malfunctions')} />
        </WidgetCard>
      </div>
    </>
  )
}
