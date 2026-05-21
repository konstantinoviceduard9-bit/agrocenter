import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { WidgetCard } from '../components/WidgetCard'
import { PageTitle } from '../components/MatrixLayout'
import {
  BARN_ROUTING_CATEGORY,
  barnTargets,
  countUnassigned,
  getAnimalsForGroup,
  loadAssignments,
  loadHandover,
  routingGroups,
  saveAssignments,
  saveHandover,
  type AnimalToRoute,
} from '../data/barnAssignment'
import { cowDetailPath } from '../data/cowDetail'
import { fmtDec, fmtInt } from '../lib/format'

function applySuggestions(groupId: string, animals: AnimalToRoute[]): Record<string, string> {
  const current = loadAssignments(groupId)
  const next = { ...current }
  for (const a of animals) {
    if (!next[a.id] && a.suggestedBarn) next[a.id] = a.suggestedBarn
  }
  return next
}

export function BarnRoutingPage() {
  const [groupId, setGroupId] = useState(routingGroups[0].id)
  const group = routingGroups.find((g) => g.id === groupId) ?? routingGroups[0]
  const animals = getAnimalsForGroup(groupId)
  const [assignments, setAssignments] = useState<Record<string, string>>(() => loadAssignments(groupId))
  const [handover, setHandover] = useState(() => loadHandover(groupId))
  const [filter, setFilter] = useState<'all' | 'pending' | 'done'>('all')

  useEffect(() => {
    setAssignments(loadAssignments(groupId))
    setHandover(loadHandover(groupId))
    setFilter('all')
  }, [groupId])

  useEffect(() => {
    saveHandover(groupId, handover)
  }, [groupId, handover])

  const persistAssign = (next: Record<string, string>) => {
    setAssignments(next)
    saveAssignments(groupId, next)
  }

  const setBarn = (animalId: string, code: string) => {
    const next = { ...assignments }
    if (code) next[animalId] = code
    else delete next[animalId]
    persistAssign(next)
  }

  const applyAllSuggestions = () => {
    persistAssign(applySuggestions(groupId, animals))
  }

  const filtered = useMemo(() => {
    return animals.filter((a) => {
      const has = Boolean(assignments[a.id])
      if (filter === 'pending') return !has
      if (filter === 'done') return has
      return true
    })
  }, [animals, assignments, filter])

  const byBarn = useMemo(() => {
    const map = new Map<string, number>()
    for (const code of Object.values(assignments)) {
      map.set(code, (map.get(code) ?? 0) + 1)
    }
    return map
  }, [assignments])

  const pending = countUnassigned(groupId)
  const allAssigned = pending === 0 && animals.length > 0

  const confirmHandover = () => {
    if (!handover.handedBy.trim() || !handover.receivedBy.trim() || !allAssigned) return
    const next = { ...handover, confirmedAt: new Date().toLocaleString('ru-RU') }
    setHandover(next)
    saveHandover(groupId, next)
  }

  return (
    <>
      <PageTitle
        title="Разделение по коровникам"
        subtitle="Вместо распечатки AfiFarm и ручных пометок — назначьте коровник, передайте смену (сдал / принял). Данные сохраняются для ветслужбы (демо)."
      />

      <div className="mb-4 rounded-lg border border-amber-200/80 bg-amber-50/90 px-4 py-3 text-sm text-amber-950">
        <strong>Как раньше:</strong> отчёт из AfiFarm → на бланке вручную писали «№ коровы → T-30» → подписи сдал/принял.
        Здесь то же в цифре: выберите группу, назначьте коровник, подтвердите передачу.
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {routingGroups.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => setGroupId(g.id)}
            className={[
              'rounded-lg px-4 py-2 text-sm font-semibold',
              g.id === groupId ? 'bg-blue-700 text-white' : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
            ].join(' ')}
          >
            {g.label}
            {countUnassigned(g.id) > 0 ? (
              <span className="ml-2 rounded-full bg-amber-400 px-1.5 py-0.5 text-[10px] font-bold text-amber-950">
                {countUnassigned(g.id)}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {barnTargets.map((b) => {
          const n = byBarn.get(b.code) ?? 0
          if (n === 0) return null
          return (
            <span
              key={b.code}
              className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-900"
            >
              {b.code}: {fmtInt(n)} голов
            </span>
          )
        })}
        {pending > 0 ? (
          <span className="rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
            Без коровника: {fmtInt(pending)}
          </span>
        ) : (
          <span className="rounded-full border border-emerald-300 bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-900">
            Все назначены
          </span>
        )}
      </div>

      <WidgetCard
        title={`${group.reportTitle} · группа ${group.afifarmGroup}`}
        footer={`AfiFarm · ${group.reportDate} ${group.reportTime} · демо-данные`}
      >
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-600">Показать:</span>
          {(['all', 'pending', 'done'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={[
                'rounded px-2 py-1 text-xs font-semibold',
                filter === f ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
              ].join(' ')}
            >
              {f === 'all' ? 'Все' : f === 'pending' ? 'Без коровника' : 'Назначены'}
            </button>
          ))}
          <button
            type="button"
            onClick={applyAllSuggestions}
            className="ml-auto rounded-lg border border-blue-300 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-900 hover:bg-blue-100"
          >
            Подставить подсказки (T-30…)
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[52rem] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-300 bg-slate-100 text-slate-600">
                <th className="px-2 py-2 font-semibold">№</th>
                <th className="px-2 py-2 font-semibold">Корова</th>
                <th className="px-2 py-2 font-semibold">Пол</th>
                <th className="px-2 py-2 font-semibold">Рожд.</th>
                <th className="px-2 py-2 text-right font-semibold">Дни</th>
                <th className="px-2 py-2 text-right font-semibold">Вес</th>
                <th className="px-2 py-2 font-semibold">Откуда</th>
                <th className="px-2 py-2 font-semibold">Коровник →</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => {
                const assigned = assignments[a.id]
                return (
                  <tr
                    key={a.id}
                    className={assigned ? 'border-b border-slate-100' : 'border-b border-slate-100 bg-amber-50/50'}
                  >
                    <td className="px-2 py-1.5 tabular-nums text-slate-500">{a.index}</td>
                    <td className="px-2 py-1.5 font-semibold tabular-nums">
                      <Link
                        to={cowDetailPath(BARN_ROUTING_CATEGORY, a.number)}
                        className="text-blue-800 hover:underline"
                      >
                        {a.number}
                      </Link>
                    </td>
                    <td className="px-2 py-1.5">{a.sex}</td>
                    <td className="px-2 py-1.5">{a.birthDate}</td>
                    <td className="px-2 py-1.5 text-right tabular-nums">{a.ageDays}</td>
                    <td className="px-2 py-1.5 text-right tabular-nums">{fmtDec(a.weightKg, 0)}</td>
                    <td className="px-2 py-1.5 text-slate-600">{a.fromLocation}</td>
                    <td className="px-2 py-1.5">
                      <select
                        value={assigned ?? ''}
                        onChange={(e) => setBarn(a.id, e.target.value)}
                        className="w-full min-w-[8rem] rounded border border-slate-300 bg-white px-2 py-1 text-xs font-medium"
                        aria-label={`Коровник для ${a.number}`}
                      >
                        <option value="">— выбрать —</option>
                        {barnTargets.map((b) => (
                          <option key={b.code} value={b.code}>
                            {b.code} · {b.label}
                          </option>
                        ))}
                      </select>
                      {!assigned && a.suggestedBarn ? (
                        <p className="mt-0.5 text-[10px] text-slate-500">Подсказка: {a.suggestedBarn}</p>
                      ) : null}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </WidgetCard>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <WidgetCard title="Передача смены (как на бланке)">
          <p className="mb-3 text-xs text-slate-600">
            Заполните «сдал» и «принял», когда все головы распределены по коровникам.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-slate-600">Сдал</label>
              <input
                value={handover.handedBy}
                onChange={(e) => setHandover((h) => ({ ...h, handedBy: e.target.value }))}
                placeholder="Фамилия ветслужбы"
                className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">Принял</label>
              <input
                value={handover.receivedBy}
                onChange={(e) => setHandover((h) => ({ ...h, receivedBy: e.target.value }))}
                placeholder="Фамилия на площадке"
                className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={confirmHandover}
            disabled={!allAssigned || !handover.handedBy.trim() || !handover.receivedBy.trim()}
            className="mt-4 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-40"
          >
            Подтвердить передачу
          </button>
          {handover.confirmedAt ? (
            <p className="mt-2 text-xs text-emerald-800">
              Передача зафиксирована: {handover.confirmedAt}
              {handover.handedBy && handover.receivedBy
                ? ` · ${handover.handedBy} → ${handover.receivedBy}`
                : ''}
            </p>
          ) : null}
        </WidgetCard>

        <WidgetCard title="Справочник коровников">
          <ul className="space-y-2 text-xs">
            {barnTargets.map((b) => (
              <li key={b.code} className="flex justify-between gap-2 border-b border-slate-100 pb-2">
                <span>
                  <strong className="text-slate-900">{b.code}</strong>
                  <span className="text-slate-600"> — {b.label}</span>
                </span>
                {b.capacity != null ? (
                  <span className="shrink-0 text-slate-500">до {fmtInt(b.capacity)} мест</span>
                ) : null}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[10px] text-slate-500">
            В продакшене коды синхронизируются с AfiFarm / справочником площадок Матрикс.
          </p>
        </WidgetCard>
      </div>
    </>
  )
}
