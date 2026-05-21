import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { WidgetCard } from '../components/WidgetCard'
import { PageTitle } from '../components/MatrixLayout'
import {
  BARN_TRANSFER_CATEGORY,
  barnDestinations,
  barnLabel,
  countUnassigned,
  loadAssignmentState,
  saveAssignments,
  saveHandover,
  transferAnimals,
  transferGroups,
  type TransferAnimal,
} from '../data/barnAssignment'
import { cowDetailPath } from '../data/cowDetail'
import { farmMeta } from '../data/matrixMocks'
import { fmtDec, fmtInt } from '../lib/format'

type Filter = 'all' | 'pending' | 'done'

function AssignmentTable({
  rows,
  assignments,
  onAssign,
}: {
  rows: TransferAnimal[]
  assignments: Record<string, string>
  onAssign: (cowNumber: string, barnId: string) => void
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[44rem] border-collapse text-left text-xs">
        <thead>
          <tr className="border-b border-slate-300 bg-slate-100 text-slate-600">
            <th className="px-2 py-2 font-semibold">№</th>
            <th className="px-2 py-2 font-semibold">Корова</th>
            <th className="px-2 py-2 font-semibold">Пол</th>
            <th className="px-2 py-2 font-semibold">Рожд.</th>
            <th className="px-2 py-2 text-right font-semibold">Дней</th>
            <th className="px-2 py-2 font-semibold">Отец</th>
            <th className="px-2 py-2 font-semibold">Мать</th>
            <th className="px-2 py-2 text-right font-semibold">Вес</th>
            <th className="px-2 py-2 font-semibold">Коровник →</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((a, i) => {
            const assigned = assignments[a.cowNumber]
            const pending = !assigned
            return (
              <tr
                key={a.id}
                className={[
                  'border-b border-slate-100',
                  pending ? 'bg-amber-50/80' : 'hover:bg-blue-50/40',
                ].join(' ')}
              >
                <td className="px-2 py-1.5 tabular-nums text-slate-500">{i + 1}</td>
                <td className="px-2 py-1.5 font-semibold tabular-nums">
                  <Link
                    to={cowDetailPath(BARN_TRANSFER_CATEGORY, a.cowNumber)}
                    className="text-blue-800 hover:underline"
                  >
                    {a.cowNumber}
                  </Link>
                </td>
                <td className="px-2 py-1.5">{a.gender}</td>
                <td className="px-2 py-1.5">{a.birthDate}</td>
                <td className="px-2 py-1.5 text-right tabular-nums">{a.ageDays}</td>
                <td className="px-2 py-1.5">{a.sire}</td>
                <td className="px-2 py-1.5 tabular-nums">{a.damId}</td>
                <td className="px-2 py-1.5 text-right tabular-nums">{fmtDec(a.weightKg, 0)}</td>
                <td className="px-2 py-1.5">
                  <select
                    value={assigned ?? ''}
                    onChange={(e) => onAssign(a.cowNumber, e.target.value)}
                    className={[
                      'w-full min-w-[7rem] rounded border px-2 py-1 text-xs font-semibold',
                      pending ? 'border-amber-400 bg-white' : 'border-emerald-400 bg-emerald-50 text-emerald-900',
                    ].join(' ')}
                    aria-label={`Коровник для ${a.cowNumber}`}
                  >
                    <option value="">Выберите…</option>
                    {barnDestinations.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.label} — {b.hint}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export function BarnAssignmentPage() {
  const [groupId, setGroupId] = useState(transferGroups[0].id)
  const [filter, setFilter] = useState<Filter>('all')
  const [{ assignments, handover }, setState] = useState(loadAssignmentState)

  const group = transferGroups.find((g) => g.id === groupId) ?? transferGroups[0]
  const groupAnimals = transferAnimals.filter((a) => a.groupId === groupId)

  const filtered = useMemo(() => {
    if (filter === 'pending') return groupAnimals.filter((a) => !assignments[a.cowNumber])
    if (filter === 'done') return groupAnimals.filter((a) => assignments[a.cowNumber])
    return groupAnimals
  }, [groupAnimals, assignments, filter])

  const pendingCount = countUnassigned(groupId, assignments)
  const byBarn = useMemo(() => {
    const map = new Map<string, number>()
    for (const a of groupAnimals) {
      const b = assignments[a.cowNumber]
      if (!b) continue
      map.set(b, (map.get(b) ?? 0) + 1)
    }
    return [...map.entries()].map(([id, count]) => ({
      id,
      label: barnLabel(id),
      count,
    }))
  }, [groupAnimals, assignments])

  const assign = (cowNumber: string, barnId: string) => {
    const next = { ...assignments }
    if (barnId) next[cowNumber] = barnId
    else delete next[cowNumber]
    saveAssignments(next)
    setState((s) => ({ ...s, assignments: next }))
  }

  const assignAllPending = (barnId: string) => {
    const next = { ...assignments }
    for (const a of groupAnimals) {
      if (!next[a.cowNumber]) next[a.cowNumber] = barnId
    }
    saveAssignments(next)
    setState((s) => ({ ...s, assignments: next }))
  }

  const confirmHandover = () => {
    if (!handover.handedBy.trim() || !handover.receivedBy.trim()) return
    const next = {
      ...handover,
      confirmedAt: new Date().toLocaleString('ru-RU'),
    }
    saveHandover(next)
    setState((s) => ({ ...s, handover: next }))
  }

  return (
    <>
      <PageTitle
        title="Разделение по коровникам"
        subtitle="Кого в какой коровник отправить — как на бланке AfiFarm с ручными пометками Т-30, Т-35. Список из отчёта, назначение ветслужбой, подпись «сдал / принял»."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {transferGroups.map((g) => (
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
          </button>
        ))}
      </div>

      <WidgetCard
        title={`Отчёт Afimilk · ${group.label}`}
        footer={`${farmMeta.siteCode} · ${farmMeta.afifarmVersion} · дата отчёта ${group.reportDate}`}
      >
        <p className="mb-3 text-xs text-slate-600">
          Жёлтым подсвечены коровы <strong>без назначения</strong>. Ветеринар выбирает коровник — как раньше на
          распечатке от руки.
        </p>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          {(
            [
              ['all', 'Все'],
              ['pending', `Без коровника (${pendingCount})`],
              ['done', 'Назначено'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={[
                'rounded-full px-3 py-1 text-xs font-semibold',
                filter === id ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
          {pendingCount > 0 ? (
            <select
              className="ml-auto rounded border border-slate-300 px-2 py-1 text-xs"
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) assignAllPending(e.target.value)
                e.target.value = ''
              }}
              aria-label="Назначить всем оставшимся"
            >
              <option value="">Всем без назначения →</option>
              {barnDestinations.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.label}
                </option>
              ))}
            </select>
          ) : null}
        </div>

        {byBarn.length > 0 ? (
          <div className="mb-4 flex flex-wrap gap-2">
            {byBarn.map((b) => (
              <span
                key={b.id}
                className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-900"
              >
                {b.label}: {fmtInt(b.count)}
              </span>
            ))}
          </div>
        ) : null}

        <AssignmentTable rows={filtered} assignments={assignments} onAssign={assign} />
      </WidgetCard>

      <WidgetCard title="Передача списка (как на бланке)" className="mt-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-slate-600">Сдал (ветслужба)</label>
            <input
              value={handover.handedBy}
              onChange={(e) => {
                const next = { ...handover, handedBy: e.target.value, confirmedAt: null }
                saveHandover(next)
                setState((s) => ({ ...s, handover: next }))
              }}
              placeholder="Фамилия И.О."
              className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600">Принял (по коровнику)</label>
            <input
              value={handover.receivedBy}
              onChange={(e) => {
                const next = { ...handover, receivedBy: e.target.value, confirmedAt: null }
                saveHandover(next)
                setState((s) => ({ ...s, handover: next }))
              }}
              placeholder="Фамилия И.О."
              className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={confirmHandover}
          disabled={pendingCount > 0 || !handover.handedBy.trim() || !handover.receivedBy.trim()}
          className="mt-4 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-40"
        >
          Подтвердить передачу
        </button>
        {handover.confirmedAt ? (
          <p className="mt-2 text-xs text-emerald-800">
            Передача зафиксирована: {handover.handedBy} → {handover.receivedBy} · {handover.confirmedAt}
          </p>
        ) : pendingCount > 0 ? (
          <p className="mt-2 text-xs text-amber-800">Назначьте коровник всем животным в списке перед подтверждением.</p>
        ) : null}
      </WidgetCard>

      <p className="mt-4 text-xs text-slate-600">
        <Link to="/tasks" className="font-medium text-blue-700 hover:underline">
          Задачи ветслужбы
        </Link>
        {' · '}
        <Link to="/" className="font-medium text-blue-700 hover:underline">
          Пульт «Сегодня»
        </Link>
      </p>
    </>
  )
}
