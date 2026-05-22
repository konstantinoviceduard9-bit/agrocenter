import { countAllUnassigned } from '../data/barnAssignment'
import type { StaffRoleId } from '../data/staff'
import { vetTasks } from '../data/vetTasks'
import { canRoleAccessPath, hasFullFarmAccess } from './staffRoleAccess'

export type MatrixNavLink = {
  to: string
  end?: boolean
  label: string
  hint: string
  badge?: number
}

export type MatrixNavSection = {
  heading: string
  links: MatrixNavLink[]
}

const myTasksLink: MatrixNavLink = {
  to: '/my-tasks',
  label: 'Мои задачи',
  hint: 'От руководства и по роли',
}

export const matrixNavSections: MatrixNavSection[] = [
  {
    heading: 'Операции дня',
    links: [
      { to: '/', end: true, label: 'Пульт «Сегодня»', hint: 'Молоко, стадо, алерты' },
      { to: '/milking', label: 'Дойка', hint: 'Смена, доильный зал' },
      myTasksLink,
    ],
  },
  {
    heading: 'Стадо и кормление',
    links: [
      { to: '/tasks', label: 'Задачи ветслужбы', hint: 'Очередь, статусы, карточки', badge: vetTasks.length },
      {
        to: '/barn-assignment',
        label: 'Разделение по коровникам',
        hint: 'Кого куда перевести · Т-30, Т-35…',
        badge: countAllUnassigned() || undefined,
      },
      { to: '/feeding', label: 'Кормление · DTM', hint: 'Файлы, фото, сверка, Afimilk' },
    ],
  },
  {
    heading: 'Персонал',
    links: [
      { to: '/staff', label: 'Сотрудники и роли', hint: 'Доярки, ветеринары, задачи от руководства' },
      { to: '/reports', label: 'Отчёты по работам', hint: 'Выполненные задачи, вет, передачи по коровникам' },
    ],
  },
  {
    heading: 'Техника',
    links: [
      { to: '/machines', label: 'Машины · Аксента', hint: 'Кормораздатчики, карта GPS' },
    ],
  },
]

const flatLinks = matrixNavSections.flatMap((s) => s.links)

export function navSectionsForRole(roleId: StaffRoleId | null): MatrixNavSection[] {
  if (!roleId || hasFullFarmAccess(roleId)) return matrixNavSections
  return matrixNavSections
    .map((sec) => ({
      ...sec,
      links: sec.links.filter((link) => canRoleAccessPath(roleId, link.to)),
    }))
    .filter((sec) => sec.links.length > 0)
}

export function navLabelForPath(pathname: string): string {
  if (pathname === '/login') return 'Вход'
  if (pathname.startsWith('/my-tasks')) return 'Мои задачи'
  if (pathname.startsWith('/reports')) return 'Отчёты по работам'
  if (pathname.startsWith('/animals/')) return 'Карточка животного'
  const exact = flatLinks.find((l) => (l.end ? pathname === l.to || pathname === `${l.to}/` : pathname === l.to || pathname.startsWith(`${l.to}/`)))
  if (exact) return exact.label
  const match = [...flatLinks].reverse().find((l) => !l.end && pathname.startsWith(l.to))
  return match?.label ?? 'Пульт'
}
