import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { WidgetCard } from './WidgetCard'
import {
  MILKING_SHIFT_COWS_CATEGORY,
  avgYieldByBarn,
  fatProteinByDay,
  fatProteinBySession,
  todayMilkingSessions,
  todayMilkingTotalLiters,
  yieldDistribution,
  yieldTargetLiters,
} from '../data/milkingShift'
import { milkProduction } from '../data/matrixMocks'
import { animalListPath, getCowsForCategory } from '../data/cowLists'
import { cowDetailPath } from '../data/cowDetail'
import { fmtDec, fmtInt, fmtPct } from '../lib/format'

type DrillId = 'yield' | 'cows' | 'avg' | 'quality' | null

const CHART_BLUE = '#2563eb'
const CHART_EMERALD = '#059669'
const CHART_AMBER = '#d97706'

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function DrillButton({
  label,
  value,
  open,
  onClick,
}: {
  label: string
  value: string
  open: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'grid w-full grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 border-b border-slate-100 py-2.5 text-left text-sm transition-colors last:border-0',
        open ? 'bg-blue-50/60' : 'hover:bg-slate-50',
      ].join(' ')}
    >
      <span className="text-slate-600">{label}</span>
      <span className="flex items-center justify-end gap-1 font-bold tabular-nums text-slate-900">
        {value}
        <Chevron open={open} />
      </span>
    </button>
  )
}

export function MilkingShiftPanel() {
  const [open, setOpen] = useState<DrillId>(null)
  const toggle = (id: DrillId) => setOpen((cur) => (cur === id ? null : id))

  const previewCows = getCowsForCategory(MILKING_SHIFT_COWS_CATEGORY).slice(0, 12)
  const topCows = [...previewCows].sort((a, b) => (b.yieldLiters ?? 0) - (a.yieldLiters ?? 0)).slice(0, 5)
  const lowCows = [...previewCows]
    .filter((c) => c.yieldLiters != null)
    .sort((a, b) => (a.yieldLiters ?? 0) - (b.yieldLiters ?? 0))
    .slice(0, 5)

  const sessionChart = todayMilkingSessions.map((s) => ({
    name: s.label.replace('Дойка ', 'Д'),
    liters: s.liters,
    fill: s.isCurrent ? CHART_BLUE : '#94a3b8',
  }))

  return (
    <WidgetCard title="Текущая смена">
      <p className="mb-2 text-[11px] text-slate-500">Нажмите строку, чтобы раскрыть детали</p>

      <DrillButton
        label="Надой смены, л"
        value={fmtInt(milkProduction.lastSessionLiters)}
        open={open === 'yield'}
        onClick={() => toggle('yield')}
      />
      {open === 'yield' ? (
        <div className="mb-3 space-y-3 border-b border-slate-200 bg-slate-50/80 px-2 py-3">
          <p className="text-xs text-slate-600">
            <strong>Сегодня 3 дойки.</strong> Значение в сводке — последняя дойка (дойка 3). Сумма за день:{' '}
            <strong>{fmtInt(todayMilkingTotalLiters)} л</strong>.
          </p>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sessionChart} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 10 }} width={36} />
                <Tooltip formatter={(v) => [`${fmtInt(Number(v))} л`, 'Надой']} />
                <Bar dataKey="liters" radius={[4, 4, 0, 0]}>
                  {sessionChart.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b text-slate-500">
                <th className="py-1 text-left font-semibold">Дойка</th>
                <th className="py-1 text-left font-semibold">Время</th>
                <th className="py-1 text-right font-semibold">Надой, л</th>
                <th className="py-1 text-right font-semibold">Голов</th>
                <th className="py-1 text-right font-semibold">Ср., л</th>
              </tr>
            </thead>
            <tbody>
              {todayMilkingSessions.map((s) => (
                <tr key={s.id} className={s.isCurrent ? 'bg-blue-50 font-medium' : 'border-b border-slate-100'}>
                  <td className="py-1.5 pr-2">
                    {s.label}
                    {s.isCurrent ? <span className="ml-1 text-[10px] text-blue-700">(смена)</span> : null}
                  </td>
                  <td className="py-1.5 text-slate-600">{s.time}</td>
                  <td className="py-1.5 text-right tabular-nums">{fmtInt(s.liters)}</td>
                  <td className="py-1.5 text-right tabular-nums">{fmtInt(s.cowsMilked)}</td>
                  <td className="py-1.5 text-right tabular-nums">{fmtDec(s.avgPerCow, 1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <DrillButton
        label="Доено голов"
        value={fmtInt(milkProduction.cowsMilkedLastSession)}
        open={open === 'cows'}
        onClick={() => toggle('cows')}
      />
      {open === 'cows' ? (
        <div className="mb-3 space-y-2 border-b border-slate-200 bg-slate-50/80 px-2 py-3">
          <p className="text-xs text-slate-600">
            Коровы с записью надоя в <strong>дойке 3</strong> (текущая смена).
          </p>
          <div className="max-h-48 overflow-y-auto rounded border border-slate-200 bg-white">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-slate-100">
                <tr className="text-slate-600">
                  <th className="px-2 py-1.5 text-left font-semibold">№</th>
                  <th className="px-2 py-1.5 text-left font-semibold">Коровник</th>
                  <th className="px-2 py-1.5 text-left font-semibold">Группа</th>
                  <th className="px-2 py-1.5 text-right font-semibold">Надой, л</th>
                </tr>
              </thead>
              <tbody>
                {previewCows.map((c) => (
                  <tr key={c.number} className="border-t border-slate-100 hover:bg-blue-50/40">
                    <td className="px-2 py-1 font-semibold tabular-nums">
                      <Link
                        to={cowDetailPath(MILKING_SHIFT_COWS_CATEGORY, c.number)}
                        className="text-blue-800 hover:underline"
                      >
                        {c.number}
                      </Link>
                    </td>
                    <td className="px-2 py-1">{c.barn}</td>
                    <td className="px-2 py-1">{c.group}</td>
                    <td className="px-2 py-1 text-right tabular-nums">{fmtDec(c.yieldLiters ?? 0, 1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link
            to={animalListPath(MILKING_SHIFT_COWS_CATEGORY)}
            className="inline-block text-xs font-semibold text-blue-700 hover:underline"
          >
            Все {fmtInt(milkProduction.cowsMilkedLastSession)} коров →
          </Link>
        </div>
      ) : null}

      <DrillButton
        label="Средний надой, л"
        value={fmtDec(milkProduction.avgPerCowLiters, 1)}
        open={open === 'avg'}
        onClick={() => toggle('avg')}
      />
      {open === 'avg' ? (
        <div className="mb-3 space-y-3 border-b border-slate-200 bg-slate-50/80 px-2 py-3">
          <p className="text-xs text-slate-600">
            Средний <strong>суточный</strong> надой на доенную корову. Цель хозяйства: {fmtDec(yieldTargetLiters, 0)} л.
            {milkProduction.avgPerCowLiters >= yieldTargetLiters ? (
              <span className="text-emerald-700"> На уровне цели.</span>
            ) : (
              <span className="text-amber-700"> Ниже цели на {fmtDec(yieldTargetLiters - milkProduction.avgPerCowLiters, 1)} л.</span>
            )}
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-center">
              <p className="text-[10px] font-semibold uppercase text-slate-500">Факт</p>
              <p className="text-lg font-bold tabular-nums">{fmtDec(milkProduction.avgPerCowLiters, 1)}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-center">
              <p className="text-[10px] font-semibold uppercase text-slate-500">Цель</p>
              <p className="text-lg font-bold tabular-nums text-slate-600">{fmtDec(yieldTargetLiters, 0)}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-center">
              <p className="text-[10px] font-semibold uppercase text-slate-500">Δ к цели</p>
              <p className="text-lg font-bold tabular-nums">
                {milkProduction.avgPerCowLiters >= yieldTargetLiters ? '+' : ''}
                {fmtDec(milkProduction.avgPerCowLiters - yieldTargetLiters, 1)}
              </p>
            </div>
          </div>
          <p className="text-[11px] font-semibold text-slate-700">По коровникам (ср. л/гол)</p>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={avgYieldByBarn} layout="vertical" margin={{ left: 4, right: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} domain={[28, 36]} />
                <YAxis type="category" dataKey="barn" width={72} tick={{ fontSize: 9 }} />
                <Tooltip formatter={(v) => [`${fmtDec(Number(v), 1)} л`, 'Средний']} />
                <Bar dataKey="avgLiters" fill={CHART_EMERALD} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] font-semibold text-slate-700">Распределение стада</p>
          <ul className="grid grid-cols-2 gap-1 text-xs sm:grid-cols-3">
            {yieldDistribution.map((b) => (
              <li key={b.range} className="flex justify-between rounded bg-white px-2 py-1 border border-slate-100">
                <span className="text-slate-600">{b.range}</span>
                <span className="font-semibold tabular-nums">{fmtInt(b.count)}</span>
              </li>
            ))}
          </ul>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase text-emerald-800">Топ-5 надой</p>
              <ul className="space-y-0.5 text-xs">
                {topCows.map((c) => (
                  <li key={c.number} className="flex justify-between">
                    <Link to={cowDetailPath(MILKING_SHIFT_COWS_CATEGORY, c.number)} className="text-blue-800 hover:underline">
                      {c.number}
                    </Link>
                    <span className="font-semibold tabular-nums">{fmtDec(c.yieldLiters ?? 0, 1)} л</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase text-amber-800">Ниже 25 л</p>
              <ul className="space-y-0.5 text-xs">
                {lowCows.map((c) => (
                  <li key={c.number} className="flex justify-between">
                    <Link to={cowDetailPath(MILKING_SHIFT_COWS_CATEGORY, c.number)} className="text-blue-800 hover:underline">
                      {c.number}
                    </Link>
                    <span className="font-semibold tabular-nums">{fmtDec(c.yieldLiters ?? 0, 1)} л</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}

      <DrillButton
        label="Жир / белок"
        value={`${fmtPct(milkProduction.fatPct)} / ${fmtPct(milkProduction.proteinPct)}`}
        open={open === 'quality'}
        onClick={() => toggle('quality')}
      />
      {open === 'quality' ? (
        <div className="space-y-3 bg-slate-50/80 px-2 py-3">
          <p className="text-xs font-semibold text-slate-700">Сегодня по дойкам</p>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b text-slate-500">
                <th className="py-1 text-left font-semibold">Дойка</th>
                <th className="py-1 text-right font-semibold">Надой, л</th>
                <th className="py-1 text-right font-semibold">Жир %</th>
                <th className="py-1 text-right font-semibold">Белок %</th>
                <th className="py-1 text-right font-semibold">Жир, кг</th>
                <th className="py-1 text-right font-semibold">Белок, кг</th>
              </tr>
            </thead>
            <tbody>
              {fatProteinBySession.map((r) => (
                <tr key={r.session} className="border-b border-slate-100">
                  <td className="py-1.5">{r.session}</td>
                  <td className="py-1.5 text-right tabular-nums">{fmtInt(r.liters)}</td>
                  <td className="py-1.5 text-right tabular-nums">{fmtPct(r.fatPct)}</td>
                  <td className="py-1.5 text-right tabular-nums">{fmtPct(r.proteinPct)}</td>
                  <td className="py-1.5 text-right tabular-nums">{fmtDec(r.fatKg, 0)}</td>
                  <td className="py-1.5 text-right tabular-nums">{fmtDec(r.proteinKg, 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs font-semibold text-slate-700">По дням (7 дней)</p>
          <div className="max-h-44 overflow-y-auto rounded border border-slate-200 bg-white">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-slate-100">
                <tr className="text-slate-500">
                  <th className="px-2 py-1.5 text-left font-semibold">День</th>
                  <th className="px-2 py-1.5 text-right font-semibold">Надой, л</th>
                  <th className="px-2 py-1.5 text-right font-semibold">Жир</th>
                  <th className="px-2 py-1.5 text-right font-semibold">Белок</th>
                  <th className="px-2 py-1.5 text-right font-semibold">Жир, кг</th>
                  <th className="px-2 py-1.5 text-right font-semibold">Белок, кг</th>
                </tr>
              </thead>
              <tbody>
                {fatProteinByDay.map((d) => (
                  <tr
                    key={d.date}
                    className={d.dayLabel === 'Сегодня' ? 'bg-emerald-50 font-medium' : 'border-t border-slate-100'}
                  >
                    <td className="px-2 py-1.5">{d.dayLabel}</td>
                    <td className="px-2 py-1.5 text-right tabular-nums">{fmtInt(d.liters)}</td>
                    <td className="px-2 py-1.5 text-right tabular-nums">{fmtPct(d.fatPct)}</td>
                    <td className="px-2 py-1.5 text-right tabular-nums">{fmtPct(d.proteinPct)}</td>
                    <td className="px-2 py-1.5 text-right tabular-nums">{fmtInt(d.fatKg)}</td>
                    <td className="px-2 py-1.5 text-right tabular-nums">{fmtInt(d.proteinKg)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="h-28">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={fatProteinByDay.map((d) => ({
                  name: d.dayLabel.replace(' мая', ''),
                  fat: d.fatPct,
                  protein: d.proteinPct,
                }))}
                margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                <YAxis domain={[3.2, 3.8]} tick={{ fontSize: 10 }} width={32} />
                <Tooltip formatter={(v, name) => [fmtPct(Number(v)), name === 'fat' ? 'Жир' : 'Белок']} />
                <Bar dataKey="fat" fill={CHART_AMBER} name="fat" radius={[2, 2, 0, 0]} />
                <Bar dataKey="protein" fill={CHART_EMERALD} name="protein" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : null}
    </WidgetCard>
  )
}
