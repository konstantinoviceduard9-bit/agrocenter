import { MATRIX_COPY } from '../lib/appCopy'
import { isPresentationMode } from '../lib/presentationMode'

export function DataStrip() {
  if (isPresentationMode()) return null

  return (
    <div
      className="border-b border-amber-200/90 bg-amber-50 px-3 py-1.5 text-[11px] leading-snug text-amber-950 sm:px-4 sm:py-2 sm:text-xs"
      role="status"
    >
      <span className="font-semibold uppercase tracking-wide text-amber-800/90">Демо</span>
      <span className="mx-2 text-amber-700/60">·</span>
      {MATRIX_COPY.dataStrip}
    </div>
  )
}
