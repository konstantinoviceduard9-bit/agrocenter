import { Link } from 'react-router-dom'

export type CountListItem = {
  label: string
  count: number
  highlight?: boolean
  /** Маршрут к списку коров, например /animals/mastitis */
  to?: string
}

export function CountList({ items }: { items: CountListItem[] }) {
  return (
    <ul className="space-y-1">
      {items.map((row) => {
        const badge = (
          <span
            className={[
              'min-w-[2rem] shrink-0 rounded px-1.5 py-0.5 text-right font-semibold tabular-nums',
              row.highlight ? 'bg-red-100 text-red-900' : 'bg-slate-100 text-slate-900',
            ].join(' ')}
          >
            {row.count}
          </span>
        )

        const labelClass = row.highlight ? 'font-medium text-red-800' : 'text-slate-700'

        if (row.to) {
          return (
            <li key={row.to}>
              <Link
                to={row.to}
                className="group flex items-center justify-between gap-2 rounded-md px-1 py-1.5 outline-none transition-colors hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-500/40"
              >
                <span className={`${labelClass} group-hover:text-blue-900 group-hover:underline`}>{row.label}</span>
                {badge}
              </Link>
            </li>
          )
        }

        return (
          <li key={row.label} className="flex items-center justify-between gap-2 px-1 py-1.5">
            <span className={labelClass}>{row.label}</span>
            {badge}
          </li>
        )
      })}
    </ul>
  )
}
