import { MATRIX_COPY } from '../lib/appCopy'
import { farmMeta } from '../data/matrixMocks'

type Props = {
  /** На мобилке — вторая строка: текущий раздел */
  sectionLabel?: string
}

export function FarmHeaderBrand({ sectionLabel }: Props) {
  return (
    <div className="min-w-0 flex-1">
      <p className="truncate text-[10px] font-semibold text-slate-500">
        <span className="font-mono text-slate-600">{farmMeta.siteCode}</span>
        <span className="mx-1 text-slate-300">·</span>
        <span>{farmMeta.afifarmVersion}</span>
      </p>
      <h1 className="truncate text-sm font-bold tracking-tight text-slate-900 sm:text-base">{MATRIX_COPY.farmName}</h1>
      <p className="truncate text-[11px] text-slate-500">
        {sectionLabel ? (
          <>
            <span className="font-medium text-slate-700 lg:hidden">{sectionLabel}</span>
            <span className="hidden lg:inline">{MATRIX_COPY.farmTagline}</span>
          </>
        ) : (
          MATRIX_COPY.farmTagline
        )}
      </p>
    </div>
  )
}
