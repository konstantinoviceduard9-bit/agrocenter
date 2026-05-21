import { vetTasks } from '../data/vetTasks'

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

export const matrixNavSections: MatrixNavSection[] = [
  {
    heading: 'Операции дня',
    links: [
      { to: '/', end: true, label: 'Пульт «Сегодня»', hint: 'Молоко, стадо, алерты' },
      { to: '/milking', label: 'Дойка', hint: 'Смена, доильный зал' },
    ],
  },
  {
    heading: 'Стадо и кормление',
    links: [
      { to: '/tasks', label: 'Задачи ветслужбы', hint: 'Очередь, статусы, карточки', badge: vetTasks.length },
      { to: '/feeding', label: 'Кормление · DTM', hint: 'Файлы, фото, сверка, Afimilk' },
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

export function navLabelForPath(pathname: string): string {
  if (pathname.startsWith('/animals/')) return 'Карточка животного'
  const exact = flatLinks.find((l) => (l.end ? pathname === l.to || pathname === `${l.to}/` : pathname === l.to || pathname.startsWith(`${l.to}/`)))
  if (exact) return exact.label
  const match = [...flatLinks].reverse().find((l) => !l.end && pathname.startsWith(l.to))
  return match?.label ?? 'Пульт'
}
