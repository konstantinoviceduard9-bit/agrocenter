import type { ReactNode } from 'react'

/** Горизонтальная прокрутка таблиц на узком экране + подсказка «листайте». */
export function TableScroll({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={['matrix-table-scroll', className].filter(Boolean).join(' ')}>
      <p className="matrix-table-scroll-hint mb-1 text-[10px] font-medium text-slate-500 md:hidden">
        Листайте таблицу влево →
      </p>
      {children}
    </div>
  )
}
