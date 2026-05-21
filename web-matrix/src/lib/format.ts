export function fmtInt(n: number): string {
  return new Intl.NumberFormat('ru-RU').format(Math.round(n))
}

export function fmtDec(n: number, digits = 1): string {
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(n)
}

export function fmtPct(n: number): string {
  return `${fmtDec(n, 2)}%`
}
