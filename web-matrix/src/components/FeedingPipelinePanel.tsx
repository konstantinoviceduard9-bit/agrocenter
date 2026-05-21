import { useEffect, useMemo, useState } from 'react'
import { WidgetCard } from './WidgetCard'
import {
  amtsIngredients,
  demoBatch,
  dtmProposal,
  labIndicators,
  loadPipelineState,
  pipelineSteps,
  savePipelineState,
  stepIndex,
  type DtmIngredientRow,
  type PipelineState,
} from '../data/feedingPipeline'
import { fmtDec } from '../lib/format'

const flagClass = {
  ok: 'bg-slate-50',
  changed: 'bg-amber-50',
  warn: 'bg-red-50',
  new: 'bg-blue-50',
} as const

const flagLabel = {
  ok: 'без изменений',
  changed: 'изменение',
  warn: 'проверить',
  new: 'новая строка',
} as const

function ProposalTable({
  rows,
  checked,
  onToggle,
  onToggleAll,
}: {
  rows: DtmIngredientRow[]
  checked: Record<string, boolean>
  onToggle: (code: string) => void
  onToggleAll: (v: boolean) => void
}) {
  const allOn = rows.every((r) => checked[r.code])
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[40rem] border-collapse text-left text-xs">
        <thead>
          <tr className="border-b border-slate-300 bg-slate-100 text-slate-600">
            <th className="px-2 py-2">
              <input type="checkbox" checked={allOn} onChange={(e) => onToggleAll(e.target.checked)} aria-label="Все" />
            </th>
            <th className="px-2 py-2 font-semibold">Код</th>
            <th className="px-2 py-2 font-semibold">Ингредиент</th>
            <th className="px-2 py-2 text-right font-semibold">DTM сейчас</th>
            <th className="px-2 py-2 text-right font-semibold">Предложение</th>
            <th className="px-2 py-2 text-right font-semibold">Δ</th>
            <th className="px-2 py-2 font-semibold">Источник</th>
            <th className="px-2 py-2 font-semibold">Статус</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const delta = r.proposedKg - r.dtmCurrentKg
            return (
              <tr key={r.code} className={`border-b border-slate-100 ${flagClass[r.flag]}`}>
                <td className="px-2 py-1.5">
                  <input
                    type="checkbox"
                    checked={checked[r.code] ?? true}
                    onChange={() => onToggle(r.code)}
                    aria-label={`Подтвердить ${r.name}`}
                  />
                </td>
                <td className="px-2 py-1.5 tabular-nums">{r.code}</td>
                <td className="px-2 py-1.5 font-medium">{r.name}</td>
                <td className="px-2 py-1.5 text-right tabular-nums text-slate-500">{fmtDec(r.dtmCurrentKg, 1)}</td>
                <td className="px-2 py-1.5 text-right font-semibold tabular-nums">{fmtDec(r.proposedKg, 1)}</td>
                <td className="px-2 py-1.5 text-right tabular-nums">
                  {delta === 0 ? '—' : `${delta > 0 ? '+' : ''}${fmtDec(delta, 1)}`}
                </td>
                <td className="px-2 py-1.5 uppercase text-[10px] text-slate-500">{r.source}</td>
                <td className="px-2 py-1.5 text-[10px] font-semibold">{flagLabel[r.flag]}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export function FeedingPipelinePanel() {
  const batch = demoBatch
  const [state, setState] = useState<PipelineState>(() => loadPipelineState(batch.id))
  const [zootech, setZootech] = useState(() => localStorage.getItem('matrix-zootech-name') ?? '')
  const [checked, setChecked] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(dtmProposal.map((r) => [r.code, true])),
  )

  useEffect(() => {
    setState(loadPipelineState(batch.id))
  }, [batch.id])

  const activeStep = stepIndex(state.status)
  const warnCount = useMemo(() => dtmProposal.filter((r) => r.flag === 'warn' || r.flag === 'new').length, [])
  const changedCount = useMemo(() => dtmProposal.filter((r) => r.flag === 'changed').length, [])

  const persist = (next: PipelineState) => {
    setState(next)
    savePipelineState(batch.id, next)
  }

  const confirm = () => {
    if (!zootech.trim()) return
    localStorage.setItem('matrix-zootech-name', zootech.trim())
    persist({
      ...state,
      status: 'confirmed',
      confirmedAt: new Date().toLocaleString('ru-RU'),
      confirmedBy: zootech.trim(),
      note: state.note,
    })
  }

  const reject = () => {
    persist({ ...state, status: 'rejected' })
  }

  const syncDtm = () => {
    if (state.status !== 'confirmed') return
    persist({
      ...state,
      status: 'synced_dtm',
      dtmSyncedAt: new Date().toLocaleString('ru-RU'),
    })
  }

  const syncAfimilk = () => {
    if (state.status !== 'synced_dtm') return
    persist({
      ...state,
      status: 'synced_afimilk',
      afimilkSyncedAt: new Date().toLocaleString('ru-RU'),
    })
  }

  const statusBanner = {
    pending_review: 'Ожидает проверки зоотехника',
    confirmed: 'Подтверждено — можно отправить в DTM',
    rejected: 'Отклонено — правки в AMTS/лаборатории',
    synced_dtm: 'Загружено в DTM — можно обновить кормогруппу в Afimilk',
    synced_afimilk: 'Синхронизировано с Afimilk',
  }[state.status]

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-blue-200 bg-blue-50/80 px-4 py-3 text-sm text-blue-950">
        <p className="font-semibold">Автопоток (модуль 4.2 · демо)</p>
        <p className="mt-1 text-blue-900/90">
          Раньше: зоотехник вручную переносил анализ Агроплема и рацион AMTS в DTM, затем кормогруппу в Afimilk. Сейчас:
          система собирает черновик → зоотехник <strong>проверяет и подтверждает</strong> → выгрузка в DTM и Afimilk.
        </p>
      </div>

      <ol className="flex flex-wrap gap-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
        {pipelineSteps.map((s, i) => (
          <li
            key={s.id}
            className={[
              'rounded-full px-2.5 py-1',
              i < activeStep ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-600',
            ].join(' ')}
          >
            {i + 1}. {s.label}
          </li>
        ))}
      </ol>

      <p className="text-sm font-medium text-slate-800">{statusBanner}</p>

      <div className="grid gap-4 lg:grid-cols-2">
        <WidgetCard title="Агроплем · лаборатория кормов">
          <p className="mb-2 text-xs text-slate-600">{batch.labSample}</p>
          <p className="mb-3 text-[10px] text-slate-500">Результат от {batch.labDate} · метод NIR</p>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b text-slate-500">
                <th className="py-1 text-left font-semibold">Показатель</th>
                <th className="py-1 text-right font-semibold">Результат</th>
                <th className="py-1 text-right font-semibold">Норма</th>
              </tr>
            </thead>
            <tbody>
              {labIndicators.map((row) => (
                <tr key={row.name} className={row.inRange ? '' : 'bg-amber-50'}>
                  <td className="py-1 pr-2">{row.name}</td>
                  <td className="py-1 text-right tabular-nums">
                    {row.result} {row.unit}
                  </td>
                  <td className="py-1 text-right text-slate-500">
                    {row.min}–{row.max}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-[10px] text-amber-800">Крахмал вне коридора — флаг для корректировки силоса/зерна в AMTS.</p>
        </WidgetCard>

        <WidgetCard title="AMTS · рацион «раздой»">
          <p className="mb-2 text-xs text-slate-600">
            {batch.amtsGroup} · надой цель {batch.milkTargetKg} кг · DIM {batch.dim}
          </p>
          <p className="mb-3 text-[10px] text-slate-500">Дата рациона {batch.amtsDate}</p>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b text-slate-500">
                <th className="py-1 text-left font-semibold">Ингредиент</th>
                <th className="py-1 text-right font-semibold">%СВ</th>
                <th className="py-1 text-right font-semibold">СВ кг</th>
                <th className="py-1 text-right font-semibold">КС кг</th>
              </tr>
            </thead>
            <tbody>
              {amtsIngredients.map((row) => (
                <tr key={row.name} className="border-b border-slate-100">
                  <td className="py-1 pr-2">{row.name}</td>
                  <td className="py-1 text-right tabular-nums">{fmtDec(row.dmPct, 0)}</td>
                  <td className="py-1 text-right tabular-nums">{fmtDec(row.dmKgDay, 2)}</td>
                  <td className="py-1 text-right font-medium tabular-nums">{fmtDec(row.asFedKgDay, 1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </WidgetCard>
      </div>

      <WidgetCard title="Сверка с DTM — подтвердить перед выгрузкой">
        <p className="mb-3 text-xs text-slate-600">
          Рецепт <strong>{batch.recipeName}</strong> · {batch.feedGroup}. Изменений: {changedCount}, на проверку:{' '}
          {warnCount}.
        </p>
        <ProposalTable
          rows={dtmProposal}
          checked={checked}
          onToggle={(code) => setChecked((c) => ({ ...c, [code]: !c[code] }))}
          onToggleAll={(v) => setChecked(Object.fromEntries(dtmProposal.map((r) => [r.code, v])))}
        />

        <div className="mt-4 grid gap-3 border-t border-slate-200 pt-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-slate-600">Зоотехник (подтверждение)</label>
            <input
              value={zootech}
              onChange={(e) => setZootech(e.target.value)}
              placeholder="Фамилия И.О."
              className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600">Комментарий</label>
            <input
              value={state.note}
              onChange={(e) => persist({ ...state, note: e.target.value })}
              placeholder="Причина отклонения или уточнение…"
              className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={confirm}
            disabled={state.status !== 'pending_review' && state.status !== 'rejected'}
            className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-40"
          >
            Подтвердить данные
          </button>
          <button
            type="button"
            onClick={reject}
            className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-800 hover:bg-red-50"
          >
            Отклонить
          </button>
          <button
            type="button"
            onClick={syncDtm}
            disabled={state.status !== 'confirmed'}
            className="rounded-lg border border-blue-400 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-900 hover:bg-blue-100 disabled:opacity-40"
          >
            Отправить в DTM (демо)
          </button>
          <button
            type="button"
            onClick={syncAfimilk}
            disabled={state.status !== 'synced_dtm'}
            className="rounded-lg border border-emerald-500 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-100 disabled:opacity-40"
          >
            Обновить кормогруппу Afimilk (демо)
          </button>
        </div>

        {state.confirmedAt ? (
          <p className="mt-3 text-xs text-slate-500">
            Подтвердил: {state.confirmedBy} · {state.confirmedAt}
            {state.dtmSyncedAt ? ` · DTM: ${state.dtmSyncedAt}` : ''}
            {state.afimilkSyncedAt ? ` · Afimilk: ${state.afimilkSyncedAt}` : ''}
          </p>
        ) : null}
      </WidgetCard>
    </div>
  )
}
