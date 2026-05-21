import type { StaffRoleId } from '../data/staff'

/** Префиксы маршрутов, доступных роли (полный доступ: manager, admin). */
const accessByRole: Record<StaffRoleId, string[] | '*'> = {
  milker: ['/', '/milking', '/my-tasks', '/animals'],
  vet: ['/', '/tasks', '/barn-assignment', '/feeding', '/my-tasks', '/animals'],
  driver: ['/', '/machines', '/my-tasks'],
  zootech: ['/', '/feeding', '/my-tasks'],
  agronomist: ['/', '/feeding', '/my-tasks'],
  mechanic: ['/', '/machines', '/my-tasks'],
  security: ['/', '/my-tasks'],
  manager: '*',
  admin: '*',
}

export function hasFullFarmAccess(roleId: StaffRoleId): boolean {
  return roleId === 'manager' || roleId === 'admin'
}

export type MobileNavItem = {
  to: string
  end?: boolean
  label: string
  icon: 'today' | 'my' | 'tasks' | 'barn' | 'feed' | 'milk' | 'machines'
}

const fullMobile: MobileNavItem[] = [
  { to: '/', end: true, label: 'Сегодня', icon: 'today' },
  { to: '/tasks', label: 'Задачи', icon: 'tasks' },
  { to: '/barn-assignment', label: 'Коровники', icon: 'barn' },
  { to: '/feeding', label: 'Корм', icon: 'feed' },
]

export function mobileNavForRole(roleId: StaffRoleId | null, isLoggedIn: boolean): MobileNavItem[] {
  if (!isLoggedIn || !roleId || hasFullFarmAccess(roleId)) return fullMobile

  const candidates: MobileNavItem[] = [
    { to: '/my-tasks', label: 'Мои', icon: 'my' },
    { to: '/', end: true, label: 'Сегодня', icon: 'today' },
    { to: '/milking', label: 'Дойка', icon: 'milk' },
    { to: '/tasks', label: 'Вет', icon: 'tasks' },
    { to: '/barn-assignment', label: 'Корпуса', icon: 'barn' },
    { to: '/feeding', label: 'Корм', icon: 'feed' },
    { to: '/machines', label: 'Машины', icon: 'machines' },
  ]

  const picked = candidates.filter((item) => canRoleAccessPath(roleId, item.to))
  return picked.slice(0, 4)
}

export function canRoleAccessPath(roleId: StaffRoleId, pathname: string): boolean {
  const rules = accessByRole[roleId]
  if (rules === '*') return true
  if (pathname === '/login' || pathname.startsWith('/login/')) return true
  return rules.some((prefix) => {
    if (prefix === '/') return pathname === '/' || pathname === ''
    return pathname === prefix || pathname.startsWith(`${prefix}/`)
  })
}
