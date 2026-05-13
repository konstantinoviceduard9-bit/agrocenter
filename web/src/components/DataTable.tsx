import type { ReactNode } from 'react'

export type Column<T extends object> = {
  id: string
  header: string
  cell: (row: T) => ReactNode
}

type Props<T extends object> = {
  columns: Column<T>[]
  rows: T[]
  empty?: ReactNode
}

export function DataTable<T extends object>({ columns, rows, empty }: Props<T>) {
  if (!rows.length) {
    return (
      <div className="surface-card border-dashed border-slate-300/90 bg-slate-50/90 px-4 py-12 text-center text-sm text-slate-500">
        {empty ?? 'Нет данных для выбранного периода.'}
      </div>
    )
  }

  return (
    <div className="surface-card overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="sticky top-0 z-10 bg-slate-50/95 text-xs font-semibold uppercase tracking-wide text-slate-500 shadow-[inset_0_-1px_0_0_rgb(241_245_249)] backdrop-blur-sm">
          <tr>
            {columns.map((c) => (
              <th key={c.id} className="whitespace-nowrap px-4 py-3.5 first:pl-5 last:pr-5">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, i) => (
            <tr key={i} className="transition-colors hover:bg-emerald-50/40">
              {columns.map((c) => (
                <td key={c.id} className="max-w-md px-4 py-3 text-slate-800 first:pl-5 last:pr-5">
                  {c.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
