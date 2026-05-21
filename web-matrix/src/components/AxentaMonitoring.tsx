import { useMemo, useState } from 'react'
import {
  axentaMachines,
  machineMapPosition,
  type MachineUnit,
} from '../data/machinesAxenta'

type SortKey = 'name' | 'status' | 'updated'

function SignalIcon({ pct, online }: { pct: number; online: boolean }) {
  const color = !online ? 'text-slate-300' : pct > 70 ? 'text-emerald-600' : 'text-amber-600'
  return (
    <svg className={`h-3.5 w-3.5 ${color}`} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M2 20h2V10H2v10zm4 0h2V7H6v13zm4 0h2V4h-2v16zm4 0h2V1h-2v19zm4 0h2v-6h-2v6z" />
    </svg>
  )
}

function BatteryIcon({ pct }: { pct: number }) {
  const color = pct > 50 ? 'text-slate-600' : 'text-amber-700'
  return (
    <span className={`text-[10px] font-semibold tabular-nums ${color}`} title="Заряд">
      {pct}%
    </span>
  )
}

function MachineRow({
  unit,
  selected,
  onSelect,
}: {
  unit: MachineUnit
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        'w-full border-b border-slate-200 px-3 py-2.5 text-left transition-colors',
        selected ? 'bg-blue-50 ring-1 ring-inset ring-blue-300/60' : 'bg-white hover:bg-slate-50',
      ].join(' ')}
    >
      <div className="flex gap-2">
        <span
          className={[
            'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white',
            unit.online ? 'bg-blue-600' : 'bg-slate-400',
          ].join(' ')}
          aria-hidden
        >
          {unit.name.slice(0, 1)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">
            {unit.name} <span className="font-normal text-slate-500">{unit.plate}</span>
          </p>
          <p className="truncate text-xs text-slate-500">{unit.address}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <SignalIcon pct={unit.signalPct} online={unit.online} />
            <BatteryIcon pct={unit.batteryPct} />
            <span
              className={[
                'inline-flex h-3.5 w-3.5 items-center justify-center rounded-sm text-[9px]',
                unit.ignitionOn ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-600',
              ].join(' ')}
              title={unit.ignitionOn ? 'Зажигание вкл.' : 'Зажигание выкл.'}
            >
              ⛭
            </span>
            <span className="text-[10px] text-slate-500">
              {unit.speedKmh > 0 ? `${unit.speedKmh} км/ч` : 'стоит'} · {unit.lastUpdate}
            </span>
          </div>
        </div>
      </div>
    </button>
  )
}

export function AxentaMonitoring() {
  const [selectedId, setSelectedId] = useState(axentaMachines[0]?.id ?? '')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortKey>('name')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    let list = axentaMachines
    if (q) {
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.plate.toLowerCase().includes(q) ||
          m.address.toLowerCase().includes(q) ||
          m.status.toLowerCase().includes(q),
      )
    }
    const sorted = [...list]
    if (sort === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name, 'ru'))
    if (sort === 'status') sorted.sort((a, b) => a.status.localeCompare(b.status, 'ru'))
    if (sort === 'updated') sorted.sort((a, b) => b.lastUpdate.localeCompare(a.lastUpdate))
    return sorted
  }, [search, sort])

  const selected = axentaMachines.find((m) => m.id === selectedId) ?? filtered[0]

  return (
    <div className="grid min-h-[28rem] gap-0 overflow-hidden rounded border border-slate-300 bg-white lg:grid-cols-[minmax(18rem,22rem)_1fr]">
      <div className="flex min-h-0 flex-col border-b border-slate-300 lg:border-b-0 lg:border-r">
        <div className="border-b border-slate-200 bg-slate-50 p-2">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск объекта…"
            className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-sm outline-none focus:border-blue-500"
          />
          <label className="mt-2 flex items-center gap-2 text-xs text-slate-600">
            Сортировка
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="flex-1 rounded border border-slate-300 bg-white px-2 py-1 text-xs"
            >
              <option value="name">по названию</option>
              <option value="status">по статусу</option>
              <option value="updated">по обновлению</option>
            </select>
          </label>
        </div>
        <div className="max-h-[22rem] overflow-y-auto lg:max-h-[32rem]">
          {filtered.length === 0 ? (
            <p className="p-4 text-center text-sm text-slate-500">Ничего не найдено</p>
          ) : (
            filtered.map((m) => (
              <MachineRow
                key={m.id}
                unit={m}
                selected={selected?.id === m.id}
                onSelect={() => setSelectedId(m.id)}
              />
            ))
          )}
        </div>
        <p className="border-t border-slate-200 px-3 py-2 text-[10px] text-slate-500">
          Демо · {filtered.length} из {axentaMachines.length} объектов
        </p>
      </div>

      <div className="flex min-h-[20rem] flex-col">
        <div className="relative min-h-[16rem] flex-1 overflow-hidden bg-slate-200 lg:min-h-[24rem]">
          <iframe
            title="Карта — демо OpenStreetMap"
            className="absolute inset-0 h-full w-full border-0"
            src="https://www.openstreetmap.org/export/embed.html?bbox=55.915%2C54.075%2C56.065%2C54.17&layer=mapnik&marker=54.124%2C55.982"
            loading="lazy"
          />
          {filtered.map((m) => {
            const pos = machineMapPosition(m.lat, m.lng)
            const active = selected?.id === m.id
            return (
              <button
                key={m.id}
                type="button"
                title={m.name}
                onClick={() => setSelectedId(m.id)}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                style={{ left: pos.left, top: pos.top }}
              >
                <span
                  className={[
                    'block h-4 w-4 rounded-full border-2 border-white shadow-md',
                    active ? 'scale-125 bg-blue-700 ring-2 ring-blue-300' : m.online ? 'bg-blue-500' : 'bg-slate-500',
                  ].join(' ')}
                />
              </button>
            )
          })}
          <div className="absolute left-2 top-2 z-20 rounded bg-white/95 px-2 py-1 text-[10px] font-medium text-slate-700 shadow ring-1 ring-slate-200">
            zoom: 17 · демо OSM
          </div>
        </div>

        {selected ? (
          <div className="border-t border-slate-300 bg-slate-50 px-4 py-3 text-sm">
            <p className="font-semibold text-slate-900">
              {selected.name} · {selected.plate}
            </p>
            <p className="mt-0.5 text-slate-600">{selected.status}</p>
            <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs sm:grid-cols-4">
              <div>
                <dt className="text-slate-500">Координаты</dt>
                <dd className="font-mono tabular-nums">
                  {selected.lat.toFixed(3)}, {selected.lng.toFixed(3)}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Скорость</dt>
                <dd>{selected.speedKmh} км/ч</dd>
              </div>
              <div>
                <dt className="text-slate-500">Связь</dt>
                <dd>{selected.online ? `GPS ${selected.signalPct}%` : 'нет связи'}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Обновлено</dt>
                <dd>{selected.lastUpdate}</dd>
              </div>
            </dl>
            {selected.driver ? (
              <p className="mt-2 text-xs text-slate-500">Водитель / оператор: {selected.driver}</p>
            ) : null}
            <p className="mt-2 text-[10px] text-slate-500">
              В проде — карта и треки из API Аксента (axenta.cloud), как на ферме.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
