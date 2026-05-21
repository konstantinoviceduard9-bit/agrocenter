export function siteBasePath(): string {
  const b = import.meta.env.BASE_URL || '/'
  return b.endsWith('/') ? b : `${b}/`
}

export function matrixFarmHref(path = ''): string {
  const base = siteBasePath()
  const tail = path.replace(/^\//, '')
  return tail ? `${base}${tail}` : base
}

/** Финансовый дашборд группы (приложение web/ в корне репозитория). */
export function groupDashboardHref(): string {
  const matrixBase = siteBasePath()
  // BASE_URL для matrix = /repo/matrix/ → группа на уровень выше
  if (matrixBase.endsWith('/matrix/')) {
    return matrixBase.slice(0, -'matrix/'.length)
  }
  return matrixBase.replace(/matrix\/?$/, '') || '/'
}
