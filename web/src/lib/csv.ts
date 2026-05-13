/** Скачивание CSV в браузере (UTF-8 BOM для Excel). */
export function downloadCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const bom = '\uFEFF'
  const esc = (c: string | number) => {
    const s = String(c)
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
    return s
  }
  const body = [headers.map(esc).join(';'), ...rows.map((r) => r.map(esc).join(';'))].join('\n')
  const blob = new Blob([bom + body], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
