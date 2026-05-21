type Item = { label: string; count: number; highlight?: boolean }

export function CountList({ items }: { items: Item[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((row) => (
        <li key={row.label} className="flex items-center justify-between gap-2">
          <span className={row.highlight ? 'font-medium text-red-800' : 'text-slate-700'}>{row.label}</span>
          <span
            className={[
              'min-w-[2rem] rounded px-1.5 py-0.5 text-right font-semibold tabular-nums',
              row.highlight ? 'bg-red-100 text-red-900' : 'bg-slate-100 text-slate-900',
            ].join(' ')}
          >
            {row.count}
          </span>
        </li>
      ))}
    </ul>
  )
}
