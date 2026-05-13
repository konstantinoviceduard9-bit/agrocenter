import { Link } from 'react-router-dom'

export type BreadcrumbItem = { label: string; to?: string }

type Props = {
  items: BreadcrumbItem[]
}

/** Последний элемент без `to` — текущая страница. */
export function Breadcrumbs({ items }: Props) {
  if (items.length === 0) return null
  return (
    <nav aria-label="Навигация по разделам" className="text-[11px] text-slate-500">
      <ol className="flex flex-wrap items-center gap-x-1 gap-y-0.5">
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex items-center gap-x-1">
            {i > 0 ? (
              <span className="select-none text-slate-300" aria-hidden>
                /
              </span>
            ) : null}
            {item.to ? (
              <Link to={item.to} className="font-medium text-emerald-800 hover:underline">
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-slate-700" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
