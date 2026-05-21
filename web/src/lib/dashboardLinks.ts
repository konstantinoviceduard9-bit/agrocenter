/** Ссылки между двумя приложениями на GitHub Pages (один репозиторий). */

export function siteBasePath(): string {
  const b = import.meta.env.BASE_URL || '/'
  return b.endsWith('/') ? b : `${b}/`
}

/** Дашборд группы — только финансы (текущее приложение web/). */
export function groupDashboardHref(): string {
  return siteBasePath()
}

/** Пульт фермы Матрикс (отдельное приложение web-matrix/). */
export function matrixFarmHref(path = ''): string {
  const base = `${siteBasePath()}matrix/`
  const tail = path.replace(/^\//, '')
  return tail ? `${base}${tail}` : base
}
