import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { TableScroll } from '../components/TableScroll'
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
import { saveLastVetHandover, veterinarians } from '../data/vetStaff'
import { fmtDec, fmtInt } from '../lib/format'
import { recordBarnHandover } from '../lib/workReports'

type Filter = 'all' | 'pending' | 'done'

function AssignmentMobileCards({
  rows,
  assignments,
  onAssign,
}: {
  rows: TransferAnimal[]
  assignments: Record<string, string>
  onAssign: (cowNumber: string, barnId: string) => void
}) {
  return (
    <ul className="space-y-3 md:hidden">
      {rows.map((a, i) => {
        const assigned = assignments[a.cowNumber]
        const pending = !assigned
        return (
          <li
            key={a.id}
            className={[
              'rounded-xl border p-3 shadow-sm',
              pending ? 'border-amber-300 bg-amber-50/90' : 'border-slate-200 bg-white',
            ].join(' ')}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[10px] font-semibold uppercase text-slate-500">#{i + 1}</p>
                <Link
                  to={cowDetailPath(BARN_TRANSFER_CATEGORY, a.cowNumber)}
                  className="text-lg font-bold tabular-nums text-blue-800 hover:underline"
                >
                  {a.cowNumber}
                </Link>
              </div>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium">{a.gender}</span>
            </div>
            <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-slate-600">
              <div>
                <dt className="text-slate-500">Рождение</dt>
                <dd className="font-medium text-slate-800">{a.birthDate}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Возраст</dt>
                <dd className="font-medium text-slate-800">{a.ageDays} дн.</dd>
              </div>
              <div>
                <dt className="text-slate-500">Вес</dt>
                <dd className="font-medium text-slate-800">{fmtDec(a.weightKg, 0)} кг</dd>
              </div>
              <div>
                <dt className="text-slate-500">Мать</dt>
                <dd className="font-medium tabular-nums text-slate-800">{a.damId}</dd>
              </div>
            </dl>
            <label className="mt-3 block text-xs font-semibold text-slate-700">Коровник →</label>
            <select
              value={assigned ?? ''}
              onChange={(e) => onAssign(a.cowNumber, e.target.value)}
              className={[
                'matrix-touch-input mt-1 w-full rounded-lg border px-3 font-semibold',
                pending ? 'border-amber-400 bg-white' : 'border-emerald-400 bg-emerald-50 text-emerald-900',
              ].join(' ')}
            >
              <option value="">Выберите коровник…</option>
              {barnDestinations.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.label} — {b.hint}
                </option>
              ))}
            </select>
          </li>
        )
      })}
    </ul>
  )
}

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
    <TableScroll className="hidden md:block">
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
    </TableScroll>
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
    saveLastVetHandover(handover.handedBy, handover.receivedBy)
    setState((s) => ({ ...s, handover: next }))
    const assignedInGroup = groupAnimals.filter((a) => assignments[a.cowNumber]).length
    recordBarnHandover(
      handover.handedBy,
      handover.receivedBy,
      next.confirmedAt!,
      assignedInGroup,
      group.label,
    )
  }

  const selectClass =
    'mt-1 w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-sm font-medium text-slate-900'

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
              'matrix-touch-btn rounded-lg font-semibold',
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

        <AssignmentMobileCards rows={filtered} assignments={assignments} onAssign={assign} />
        <AssignmentTable rows={filtered} assignments={assignments} onAssign={assign} />
      </WidgetCard>

      <WidgetCard title="Передача списка (как на бланке)" className="mt-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="handover-vet" className="text-xs font-semibold text-slate-600">
              Сдал (ветслужба)
            </label>
            <select
              id="handover-vet"
              value={handover.handedBy}
              onChange={(e) => {
                const next = { ...handover, handedBy: e.target.value, confirmedAt: null }
                saveHandover(next)
                setState((s) => ({ ...s, handover: next }))
              }}
              className={`matrix-touch-input ${selectClass}`}
            >
              <option value="">Выберите ветеринара…</option>
              {veterinarians.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="handover-receiver" className="text-xs font-semibold text-slate-600">
              Принял (по коровнику)
            </label>
            <select
              id="handover-receiver"
              value={handover.receivedBy}
              onChange={(e) => {
                const next = { ...handover, receivedBy: e.target.value, confirmedAt: null }
                saveHandover(next)
                setState((s) => ({ ...s, handover: next }))
              }}
              className={`matrix-touch-input ${selectClass}`}
            >
              <option value="">Выберите ветеринара…</option>
              {veterinarians.map((name) => (
                <option key={`recv-${name}`} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="button"
          onClick={confirmHandover}
          disabled={pendingCount > 0 || !handover.handedBy.trim() || !handover.receivedBy.trim()}
          className="matrix-touch-btn mt-4 w-full rounded-lg bg-blue-700 font-semibold text-white hover:bg-blue-800 disabled:opacity-40 sm:w-auto"
        >
          Подтвердить передачу
        </button>
        {handover.confirmedAt ? (
          <p className="mt-2 text-xs text-emerald-800">
            Передача зафиксирована: {handover.handedBy} → {handover.receivedBy} · {handover.confirmedAt}
            {' · '}
            <Link to="/reports" className="font-medium text-blue-800 hover:underline">
              в отчётах
            </Link>
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
