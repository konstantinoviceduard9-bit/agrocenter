import { MATRIX_COPY } from '../lib/appCopy'

export function DataStrip() {
  return (
    <div
      className="border-b border-amber-200/90 bg-amber-50 px-4 py-2 text-xs leading-relaxed text-amber-950"
      role="status"
    >
      <span className="font-semibold uppercase tracking-wide text-amber-800/90">Демо</span>
      <span className="mx-2 text-amber-700/60">·</span>
      {MATRIX_COPY.dataStrip}
    </div>
  )
}
