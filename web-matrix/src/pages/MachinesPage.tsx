import { WidgetCard } from '../components/WidgetCard'
import { PageTitle } from '../components/MatrixLayout'
import { machines } from '../data/matrixMocks'

export function MachinesPage() {
  return (
    <>
      <PageTitle title="Машины · Аксента" subtitle="GPS-телематика (демо). На общем экране — рядом с стадом и кормлением." />
      <div className="grid gap-4 lg:grid-cols-2">
        <WidgetCard title="Список техники">
          <ul className="space-y-3">
            {machines.map((m) => (
              <li key={m.name} className="rounded border border-slate-200 bg-slate-50 px-3 py-2">
                <p className="font-semibold text-slate-900">{m.name}</p>
                <p className="text-sm text-slate-600">{m.status}</p>
                <p className="mt-1 font-mono text-[10px] text-slate-500">
                  {m.lat.toFixed(2)}, {m.lng.toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        </WidgetCard>
        <WidgetCard title="Карта (заглушка)">
          <div className="flex h-48 items-center justify-center rounded border border-dashed border-slate-300 bg-slate-50 text-center text-sm text-slate-500">
            Карта Аксента подключится при интеграции API
          </div>
        </WidgetCard>
      </div>
    </>
  )
}
