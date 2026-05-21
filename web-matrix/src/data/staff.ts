/**
 * Персонал фермы: роли и задачи от руководства (демо).
 */

export type StaffRoleId =
  | 'milker'
  | 'vet'
  | 'driver'
  | 'zootech'
  | 'agronomist'
  | 'mechanic'
  | 'security'
  | 'manager'
  | 'admin'

export type StaffRole = {
  id: StaffRoleId
  label: string
  shortLabel: string
  color: string
  appHint: string
}

export const staffRoles: StaffRole[] = [
  { id: 'milker', label: 'Доярка', shortLabel: 'Дойка', color: 'bg-blue-100 text-blue-900', appHint: 'Дойка, смена' },
  { id: 'vet', label: 'Ветеринар', shortLabel: 'Вет', color: 'bg-emerald-100 text-emerald-900', appHint: 'Задачи, стадо, коровники' },
  { id: 'driver', label: 'Водитель', shortLabel: 'Водит.', color: 'bg-slate-200 text-slate-800', appHint: 'Маршруты, машины' },
  { id: 'zootech', label: 'Зоотехник', shortLabel: 'Зоо', color: 'bg-amber-100 text-amber-900', appHint: 'Кормление, DTM' },
  { id: 'agronomist', label: 'Агроном', shortLabel: 'Агро', color: 'bg-lime-100 text-lime-900', appHint: 'Корма, поля' },
  { id: 'mechanic', label: 'Слесарь', shortLabel: 'Слес.', color: 'bg-orange-100 text-orange-900', appHint: 'Техника, ремонт' },
  { id: 'security', label: 'Охрана', shortLabel: 'Охр.', color: 'bg-violet-100 text-violet-900', appHint: 'Пропускной режим' },
  { id: 'manager', label: 'Руководитель смены', shortLabel: 'Рук.', color: 'bg-indigo-100 text-indigo-900', appHint: 'Все разделы + задачи' },
  { id: 'admin', label: 'Администратор', shortLabel: 'Адм.', color: 'bg-rose-100 text-rose-900', appHint: 'Сотрудники, доступы' },
]

export type StaffMember = {
  id: string
  name: string
  roleId: StaffRoleId
  phone: string
  shift: string
  active: boolean
  hasAppAccess: boolean
  /** Демо-PIN для входа в приложение (4 цифры). */
  pin: string
}

export type LeadershipTask = {
  id: string
  employeeId: string
  title: string
  assignedBy: string
  dueDate: string
  status: 'open' | 'in_progress' | 'done'
  createdAt: string
}

export const staffMembers: StaffMember[] = [
  { id: 'e1', name: 'Забиров Г.И.', roleId: 'vet', phone: '+7 *** *** 12-01', shift: 'День', active: true, hasAppAccess: true, pin: '1001' },
  { id: 'e2', name: 'Мухаметшин Р.А.', roleId: 'vet', phone: '+7 *** *** 12-02', shift: 'Ночь', active: true, hasAppAccess: true, pin: '1002' },
  { id: 'e3', name: 'Кузнецов П.С.', roleId: 'zootech', phone: '+7 *** *** 12-10', shift: 'День', active: true, hasAppAccess: true, pin: '1010' },
  { id: 'e4', name: 'Ямалетдинов И.Р.', roleId: 'milker', phone: '+7 *** *** 12-20', shift: 'Утро', active: true, hasAppAccess: true, pin: '1020' },
  { id: 'e5', name: 'Валеев Р.Н.', roleId: 'milker', phone: '+7 *** *** 12-21', shift: 'Вечер', active: true, hasAppAccess: true, pin: '1021' },
  { id: 'e6', name: 'Гарифуллин А.Х.', roleId: 'driver', phone: '+7 *** *** 12-30', shift: 'День', active: true, hasAppAccess: true, pin: '1030' },
  { id: 'e7', name: 'Петров С.В.', roleId: 'mechanic', phone: '+7 *** *** 12-40', shift: 'День', active: true, hasAppAccess: false, pin: '1040' },
  { id: 'e8', name: 'Сидоров К.М.', roleId: 'security', phone: '+7 *** *** 12-50', shift: 'Сутки', active: true, hasAppAccess: true, pin: '1050' },
  { id: 'e9', name: 'Иванова М.П.', roleId: 'agronomist', phone: '+7 *** *** 12-60', shift: 'День', active: true, hasAppAccess: true, pin: '1060' },
  { id: 'e10', name: 'Сафин А.Р.', roleId: 'manager', phone: '+7 *** *** 12-70', shift: 'День', active: true, hasAppAccess: true, pin: '1070' },
  { id: 'e11', name: 'Нуриахметов Д.Ф.', roleId: 'driver', phone: '+7 *** *** 12-31', shift: 'Ночь', active: false, hasAppAccess: false, pin: '1031' },
  { id: 'e12', name: 'Хабибуллин М.Ф.', roleId: 'admin', phone: '+7 *** *** 12-99', shift: 'Офис', active: true, hasAppAccess: true, pin: '1099' },
]

export function staffMemberById(id: string): StaffMember | undefined {
  return staffMembers.find((m) => m.id === id)
}

const defaultTasks: LeadershipTask[] = [
  {
    id: 'lt1',
    employeeId: 'e4',
    title: 'Проверить идентификацию в дойке 3',
    assignedBy: 'Сафин А.Р.',
    dueDate: '21.05.2026',
    status: 'open',
    createdAt: '21.05.2026 08:00',
  },
  {
    id: 'lt2',
    employeeId: 'e1',
    title: 'Осмотр новотельных · корпус 7',
    assignedBy: 'Сафин А.Р.',
    dueDate: '21.05.2026',
    status: 'in_progress',
    createdAt: '21.05.2026 07:30',
  },
  {
    id: 'lt3',
    employeeId: 'e6',
    title: 'Доставка силоса · маршрут Т-2',
    assignedBy: 'Сафин А.Р.',
    dueDate: '21.05.2026',
    status: 'open',
    createdAt: '21.05.2026 06:00',
  },
]

const TASKS_KEY = 'matrix-leadership-tasks-v1'

export function loadLeadershipTasks(): LeadershipTask[] {
  try {
    const raw = localStorage.getItem(TASKS_KEY)
    if (!raw) return [...defaultTasks]
    return JSON.parse(raw) as LeadershipTask[]
  } catch {
    return [...defaultTasks]
  }
}

export function saveLeadershipTasks(tasks: LeadershipTask[]) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
}

export function roleById(id: StaffRoleId): StaffRole {
  return staffRoles.find((r) => r.id === id) ?? staffRoles[0]!
}

export function openTasksForEmployee(tasks: LeadershipTask[], employeeId: string): LeadershipTask[] {
  return tasks.filter((t) => t.employeeId === employeeId && t.status !== 'done')
}
