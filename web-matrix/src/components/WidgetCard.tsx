import type { ReactNode } from 'react'

type Props = {
  title: string
  icon?: ReactNode
  className?: string
  children: ReactNode
  footer?: ReactNode
}

export function WidgetCard({ title, icon, className = '', children, footer }: Props) {
  return (
    <section
      className={`flex min-h-0 flex-col overflow-hidden rounded border border-slate-300/80 bg-white shadow-sm ${className}`}
    >
      <header className="flex shrink-0 items-center gap-2 border-b border-blue-800/20 bg-gradient-to-r from-blue-700 to-blue-600 px-3 py-2 text-white">
        {icon ? <span className="opacity-90">{icon}</span> : null}
        <h2 className="min-w-0 truncate text-sm font-semibold tracking-tight">{title}</h2>
      </header>
      <div className="min-h-0 flex-1 p-3 text-sm text-slate-800">{children}</div>
      {footer ? (
        <footer className="shrink-0 border-t border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
          {footer}
        </footer>
      ) : null}
    </section>
  )
}
