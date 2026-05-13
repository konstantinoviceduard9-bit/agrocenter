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
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
        {empty ?? 'Нет данных для выбранного периода.'}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            {columns.map((c) => (
              <th key={c.id} className="px-4 py-3">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-slate-50/80">
              {columns.map((c) => (
                <td key={c.id} className="max-w-md px-4 py-2.5 text-slate-800">
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
