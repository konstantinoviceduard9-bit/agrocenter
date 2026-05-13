export function fmtMln(n: number | null | undefined) {
  if (n == null) return '—'
  return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 }).format(n)
}

export function fmtInt(n: number | null | undefined) {
  if (n == null) return '—'
  return new Intl.NumberFormat('ru-RU').format(n)
}

export function fmtRubMln(n: number | null | undefined) {
  if (n == null) return '—'
  return `${fmtMln(n)} млн ₽`
}
