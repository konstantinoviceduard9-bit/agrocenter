import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { WidgetCard } from '../components/WidgetCard'
import { CountList } from '../components/CountList'
import {
  groups,
  healthAlerts,
  herdInventory,
  malfunctions,
  milkProduction,
  reproduction,
  todayTasks,
} from '../data/matrixMocks'
import { fmtDec, fmtInt, fmtPct } from '../lib/format'

const donutData = herdInventory.filter((s) => s.id !== 'total').map((s) => ({ name: s.label, value: s.count, fill: s.color }))

function KpiRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2 border-b border-slate-100 py-1.5 last:border-0">
      <span className="text-slate-600">{label}</span>
      <span className="font-semibold tabular-nums text-slate-900">{value}</span>
    </div>
  )
}

export function TodayPage() {
  return (
    <div className="grid auto-rows-min gap-3 lg:grid-cols-12 lg:gap-4">
      <WidgetCard title="Производство молока" className="lg:col-span-4">
        <KpiRow label="Надой последней дойки, л" value={fmtInt(milkProduction.lastSessionLiters)} />
        <KpiRow label="Надой предыдущего дня, л" value={fmtInt(milkProduction.previousDayLiters)} />
        <KpiRow label="Доено в последней дойке" value={fmtInt(milkProduction.cowsMilkedLastSession)} />
        <KpiRow label="Средний надой на корову, л" value={fmtDec(milkProduction.avgPerCowLiters, 1)} />
        <KpiRow label="Жир" value={fmtPct(milkProduction.fatPct)} />
        <KpiRow label="Белок" value={fmtPct(milkProduction.proteinPct)} />
      </WidgetCard>

      <WidgetCard title="Здоровье" className="lg:col-span-4">
        <CountList
          items={healthAlerts.map((a) => ({
            label: a.label,
            count: a.count,
            highlight: a.severity === 'high',
          }))}
        />
      </WidgetCard>

      <WidgetCard title="Выполнить сегодня" className="lg:col-span-4">
        <CountList items={todayTasks} />
      </WidgetCard>

      <WidgetCard title="Инвентаризация животных" className="lg:col-span-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <table className="w-full text-left text-xs">
            <tbody>
              {herdInventory.map((row) => (
                <tr key={row.id} className="border-b border-slate-100">
                  <td className="py-1 pr-2 text-slate-600">{row.label}</td>
                  <td className="py-1 text-right font-semibold tabular-nums">{fmtInt(row.count)}</td>
                  {row.id !== 'total' ? (
                    <td className="py-1 pl-2 text-right text-slate-500 tabular-nums">{fmtDec(row.pct, 1)}%</td>
                  ) : (
                    <td />
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="h-36 min-h-[8rem]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donutData} dataKey="value" nameKey="name" innerRadius="52%" outerRadius="78%" paddingAngle={2}>
                  {donutData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} stroke="#fff" strokeWidth={1} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [fmtInt(Number(v)), 'Голов']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </WidgetCard>

      <WidgetCard title="Воспроизводство" className="lg:col-span-3">
        <CountList items={reproduction} />
      </WidgetCard>

      <WidgetCard title="Группы" className="lg:col-span-4">
        <CountList items={groups} />
      </WidgetCard>

      <WidgetCard
        title="Неисправности за сегодня"
        className="lg:col-span-4"
        footer="188 коров без ID в дойке — приоритет модуля 4.5"
      >
        <CountList items={malfunctions} />
      </WidgetCard>
    </div>
  )
}
