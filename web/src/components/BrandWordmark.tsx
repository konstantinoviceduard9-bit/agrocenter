import { Link } from 'react-router-dom'

type Variant = 'dark' | 'light'
type Size = 'sm' | 'md' | 'lg'

const sizeClasses: Record<
  Size,
  { row: string; brand: string; sep: string; product: string; tag: string }
> = {
  sm: {
    row: 'gap-0.5',
    brand: 'text-[1.05rem] font-extrabold leading-none sm:text-lg',
    sep: 'text-sm font-light leading-none sm:text-base',
    product: 'text-[1.05rem] font-semibold leading-none sm:text-lg',
    tag: 'mt-0.5 text-[9px] leading-tight',
  },
  md: {
    row: 'gap-1',
    brand: 'text-xl font-extrabold leading-tight tracking-tight sm:text-2xl',
    sep: 'text-lg font-light leading-none sm:text-xl',
    product: 'text-xl font-semibold leading-tight tracking-tight sm:text-2xl',
    tag: 'mt-1 text-[10px] leading-tight',
  },
  lg: {
    row: 'gap-1',
    brand: 'text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl',
    sep: 'text-xl font-light leading-none sm:text-2xl',
    product: 'text-2xl font-semibold leading-tight tracking-tight sm:text-3xl',
    tag: 'mt-1.5 text-[11px] leading-tight',
  },
}

type Props = {
  variant: Variant
  size?: Size
  /** Подпись под названием; `null` — не показывать. */
  tagline?: string | null
  /** Обёртка в ссылку на главную (например, в шапке страницы). */
  linkToHome?: boolean
  className?: string
}

/**
 * Единый локап названия продукта (роль V, AGENTS.md).
 * «Нерал» — основной носитель; «·» — акцент; «дашборд» — вторичный вес.
 */
export function BrandWordmark({
  variant,
  size = 'md',
  tagline = variant === 'dark' ? 'Группа компаний' : null,
  linkToHome = false,
  className = '',
}: Props) {
  const s = sizeClasses[size]
  const isDark = variant === 'dark'
  const sepColor = isDark ? 'text-emerald-400/95' : 'text-emerald-600'

  const inner = (
    <div className={`select-none ${className}`}>
      <div className={`flex flex-wrap items-baseline ${s.row}`}>
        <span
          className={[
            s.brand,
            isDark
              ? 'bg-gradient-to-br from-white via-white to-slate-200 bg-clip-text text-transparent'
              : 'bg-gradient-to-br from-slate-900 via-slate-900 to-slate-600 bg-clip-text text-transparent',
          ].join(' ')}
        >
          Нерал
        </span>
        <span className={[s.sep, sepColor].join(' ')} aria-hidden>
          ·
        </span>
        <span
          className={[
            s.product,
            isDark ? 'text-slate-200' : 'text-slate-600',
          ].join(' ')}
        >
          дашборд
        </span>
      </div>
      {tagline ? (
        <p
          className={[
            s.tag,
            'font-semibold uppercase tracking-[0.18em]',
            isDark ? 'text-slate-500' : 'text-slate-500',
          ].join(' ')}
        >
          {tagline}
        </p>
      ) : null}
    </div>
  )

  if (linkToHome) {
    return (
      <Link
        to="/"
        className="inline-block max-w-full rounded-lg outline-none ring-emerald-600/0 transition ring-offset-2 ring-offset-white hover:ring-emerald-600/20 focus-visible:ring-2 focus-visible:ring-emerald-600/40"
        aria-label="Нерал · дашборд — на сводку"
      >
        {inner}
      </Link>
    )
  }

  return inner
}
