import { MATRIX_COPY } from '../lib/appCopy'
import { farmMeta, herdInventory, milkProduction } from '../data/matrixMocks'
import { fmtInt } from '../lib/format'

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/80 bg-white/90 px-4 py-2 shadow-sm backdrop-blur-sm">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-0.5 text-lg font-bold tabular-nums text-slate-900">{value}</p>
    </div>
  )
}

export function FarmHero() {
  const totalCows = herdInventory.find((s) => s.id === 'total')?.count ?? 0

  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-blue-50/90 px-4 py-8 text-center shadow-md sm:px-8 sm:py-10"
      aria-label="Ферма"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(37,99,235,0.12),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-400/10 blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-blue-500/10 blur-2xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-2xl">
        <p className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full border border-blue-200/70 bg-white/95 px-4 py-1.5 text-[11px] font-semibold tracking-wide text-blue-800 shadow-sm">
          <span className="font-mono text-blue-900/90">{farmMeta.siteCode}</span>
          <span className="hidden text-slate-300 sm:inline" aria-hidden>
            ·
          </span>
          <span className="text-slate-600">{farmMeta.afifarmVersion}</span>
        </p>

        <h1 className="mt-5 text-balance text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-[2rem]">
          {MATRIX_COPY.farmName}
        </h1>
        <p className="mt-2 text-pretty text-sm text-slate-600 sm:text-base">{MATRIX_COPY.farmTagline}</p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <StatChip label="Коров на ферме" value={fmtInt(totalCows)} />
          <StatChip label="Надой / день, л" value={fmtInt(milkProduction.dailyLiters)} />
          <StatChip label="Корпусов" value={fmtInt(farmMeta.barnCount)} />
        </div>
      </div>
    </section>
  )
}
