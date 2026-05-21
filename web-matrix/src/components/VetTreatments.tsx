import { useEffect, useMemo, useState } from 'react'
import type { TreatmentRecord } from '../data/cowDetail'

const STORAGE_PREFIX = 'matrix-vet-treatment-'
const VET_NAME_KEY = 'matrix-vet-display-name'

const ROUTE_OPTIONS = ['в/м', 'per os', 'интрамаммарно', 'в/в', 'подкожно'] as const

const DRUG_SUGGESTIONS = [
  'Синулокс LC',
  'Мастимаст',
  'Кетофен',
  'Пропиленгликоль 30%',
  'Окситоцин',
  'Пенстреп',
  'Цефтен',
  'Альбендазол',
]

export type VetTreatmentEntry = TreatmentRecord & {
  id: string
  enteredAt: string
}

type FormState = {
  date: string
  drug: string
  dose: string
  route: string
  vet: string
  reason: string
}

function todayIso(): string {
  const d = new Date()
  return d.toISOString().slice(0, 10)
}

function formatDisplayDate(iso: string): string {
  const [y, m, day] = iso.split('-')
  if (!y || !m || !day) return iso
  return `${day}.${m}.${y}`
}

function loadVetTreatments(cowNumber: string): VetTreatmentEntry[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${cowNumber}`)
    if (!raw) return []
    const parsed = JSON.parse(raw) as VetTreatmentEntry[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveVetTreatments(cowNumber: string, entries: VetTreatmentEntry[]) {
  localStorage.setItem(`${STORAGE_PREFIX}${cowNumber}`, JSON.stringify(entries))
}

function loadVetName(): string {
  return localStorage.getItem(VET_NAME_KEY) ?? ''
}

function saveVetName(name: string) {
  if (name.trim()) localStorage.setItem(VET_NAME_KEY, name.trim())
}

function emptyForm(defaultReason: string, vetName: string): FormState {
  return {
    date: todayIso(),
    drug: '',
    dose: '',
    route: 'в/м',
    vet: vetName,
    reason: defaultReason,
  }
}

const fieldClass =
  'mt-0.5 w-full rounded border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30'

export function VetTreatments({
  cowNumber,
  defaultReason,
  demoTreatments,
}: {
  cowNumber: string
  defaultReason: string
  demoTreatments: TreatmentRecord[]
}) {
  const [vetEntries, setVetEntries] = useState<VetTreatmentEntry[]>(() => loadVetTreatments(cowNumber))
  const [form, setForm] = useState<FormState>(() => emptyForm(defaultReason, loadVetName()))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setVetEntries(loadVetTreatments(cowNumber))
    setForm(emptyForm(defaultReason, loadVetName()))
    setError(null)
  }, [cowNumber, defaultReason])

  const allRows = useMemo(() => {
    const vet = vetEntries.map((e) => ({ ...e, isVet: true as const }))
    const demo = demoTreatments.map((e, i) => ({ ...e, isVet: false as const, id: `demo-${i}` }))
    return [...vet, ...demo]
  }, [vetEntries, demoTreatments])

  const update = (patch: Partial<FormState>) => {
    setForm((f) => ({ ...f, ...patch }))
    setError(null)
  }

  const addTreatment = () => {
    if (!form.drug.trim()) {
      setError('Укажите препарат')
      return
    }
    if (!form.dose.trim()) {
      setError('Укажите дозу')
      return
    }
    if (!form.vet.trim()) {
      setError('Укажите ветеринара')
      return
    }

    const entry: VetTreatmentEntry = {
      id: crypto.randomUUID(),
      enteredAt: new Date().toISOString(),
      date: formatDisplayDate(form.date),
      drug: form.drug.trim(),
      dose: form.dose.trim(),
      route: form.route,
      vet: form.vet.trim(),
      reason: form.reason.trim() || defaultReason,
    }

    saveVetName(form.vet)
    const next = [entry, ...vetEntries]
    setVetEntries(next)
    saveVetTreatments(cowNumber, next)
    setForm(emptyForm(defaultReason, form.vet.trim()))
    setError(null)
  }

  const removeVetEntry = (id: string) => {
    const next = vetEntries.filter((e) => e.id !== id)
    setVetEntries(next)
    saveVetTreatments(cowNumber, next)
  }

  return (
    <div className="rounded border border-slate-300 bg-white lg:col-span-8">
      <header className="border-b border-blue-800/20 bg-gradient-to-r from-blue-700 to-blue-600 px-3 py-2">
        <h2 className="text-sm font-semibold text-white">Лечение — препараты и инъекции</h2>
        <p className="text-[11px] text-blue-100/90">
          Записи ветеринара сохраняются в браузере · серые строки — демо Afimilk
        </p>
      </header>

      <div className="border-b border-slate-200 bg-slate-50/80 p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Добавить назначение</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label htmlFor={`tx-date-${cowNumber}`} className="text-xs font-medium text-slate-600">
              Дата
            </label>
            <input
              id={`tx-date-${cowNumber}`}
              type="date"
              value={form.date}
              onChange={(e) => update({ date: e.target.value })}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor={`tx-drug-${cowNumber}`} className="text-xs font-medium text-slate-600">
              Препарат *
            </label>
            <input
              id={`tx-drug-${cowNumber}`}
              list={`tx-drugs-${cowNumber}`}
              value={form.drug}
              onChange={(e) => update({ drug: e.target.value })}
              placeholder="Название"
              className={fieldClass}
            />
            <datalist id={`tx-drugs-${cowNumber}`}>
              {DRUG_SUGGESTIONS.map((d) => (
                <option key={d} value={d} />
              ))}
            </datalist>
          </div>
          <div>
            <label htmlFor={`tx-dose-${cowNumber}`} className="text-xs font-medium text-slate-600">
              Доза *
            </label>
            <input
              id={`tx-dose-${cowNumber}`}
              value={form.dose}
              onChange={(e) => update({ dose: e.target.value })}
              placeholder="10 мл, 500 мл…"
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor={`tx-route-${cowNumber}`} className="text-xs font-medium text-slate-600">
              Путь введения
            </label>
            <select
              id={`tx-route-${cowNumber}`}
              value={form.route}
              onChange={(e) => update({ route: e.target.value })}
              className={fieldClass}
            >
              {ROUTE_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`tx-vet-${cowNumber}`} className="text-xs font-medium text-slate-600">
              Ветеринар *
            </label>
            <input
              id={`tx-vet-${cowNumber}`}
              value={form.vet}
              onChange={(e) => update({ vet: e.target.value })}
              placeholder="Фамилия И.О."
              className={fieldClass}
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <label htmlFor={`tx-reason-${cowNumber}`} className="text-xs font-medium text-slate-600">
              Причина
            </label>
            <input
              id={`tx-reason-${cowNumber}`}
              value={form.reason}
              onChange={(e) => update({ reason: e.target.value })}
              className={fieldClass}
            />
          </div>
        </div>
        {error ? <p className="mt-2 text-xs font-medium text-red-700">{error}</p> : null}
        <button
          type="button"
          onClick={addTreatment}
          className="mt-3 rounded bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
        >
          Добавить в журнал
        </button>
      </div>

      <div className="overflow-x-auto p-0">
        <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-300 bg-slate-100 text-xs text-slate-600">
              <th className="px-2 py-2 font-semibold">Дата</th>
              <th className="px-2 py-2 font-semibold">Препарат</th>
              <th className="px-2 py-2 font-semibold">Доза</th>
              <th className="px-2 py-2 font-semibold">Путь</th>
              <th className="px-2 py-2 font-semibold">Ветеринар</th>
              <th className="px-2 py-2 font-semibold">Причина</th>
              <th className="w-10 px-2 py-2" aria-label="Действия" />
            </tr>
          </thead>
          <tbody>
            {allRows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3 py-6 text-center text-slate-500">
                  Записей нет — добавьте назначение выше
                </td>
              </tr>
            ) : (
              allRows.map((row) => (
                <tr
                  key={row.id}
                  className={[
                    'border-b border-slate-100',
                    row.isVet ? 'bg-emerald-50/60' : 'bg-white text-slate-600',
                  ].join(' ')}
                >
                  <td className="px-2 py-1.5 tabular-nums">{row.date}</td>
                  <td className="px-2 py-1.5 font-medium text-slate-900">{row.drug}</td>
                  <td className="px-2 py-1.5">{row.dose}</td>
                  <td className="px-2 py-1.5">{row.route}</td>
                  <td className="px-2 py-1.5">{row.vet}</td>
                  <td className="px-2 py-1.5">{row.reason}</td>
                  <td className="px-2 py-1.5">
                    {row.isVet ? (
                      <button
                        type="button"
                        title="Удалить запись"
                        onClick={() => removeVetEntry(row.id)}
                        className="rounded px-1.5 py-0.5 text-xs text-red-700 hover:bg-red-100"
                      >
                        ✕
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400">демо</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
