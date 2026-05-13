/** Мок-данные для UI. Позже заменить на API / 1С / warehouse. Округления как в внутренних материалах группы (2025). */
export type CompanyRole = 'holding' | 'farming' | 'service' | 'property'

export type Company = {
  id: string
  shortName: string
  fullName: string
  inn: string
  role: CompanyRole
  /** млн ₽ */
  revenue2025Mln: number | null
  netProfit2025Mln: number | null
  assets2025Mln: number | null
  employees: number | null
  note?: string
}

export const companies: Company[] = [
  {
    id: 'intelko',
    shortName: 'Концерн «Интел КО»',
    fullName: 'ООО «Концерн Интел КО»',
    inn: '0273002416',
    role: 'holding',
    revenue2025Mln: 158,
    netProfit2025Mln: 46,
    assets2025Mln: 2709,
    employees: 20,
  },
  {
    id: 'agrocenter',
    shortName: 'Нерал-Агроцентр',
    fullName: 'ООО «Нерал-Агроцентр»',
    inn: '0278068097',
    role: 'service',
    revenue2025Mln: 35,
    netProfit2025Mln: 1.3,
    assets2025Mln: 14,
    employees: 15,
  },
  {
    id: 'chishmy',
    shortName: 'СХП «Нерал-Чишмы»',
    fullName: 'ООО «СХП Нерал-Чишмы»',
    inn: '0250004985',
    role: 'farming',
    revenue2025Mln: 488,
    netProfit2025Mln: 16,
    assets2025Mln: 1466,
    employees: 131,
  },
  {
    id: 'buzdyak',
    shortName: 'СХП «Нерал-Буздяк»',
    fullName: 'ООО «СХП Нерал-Буздяк»',
    inn: '0216006189',
    role: 'farming',
    revenue2025Mln: 605,
    netProfit2025Mln: 331,
    assets2025Mln: 2061,
    employees: 119,
  },
  {
    id: 'matrix',
    shortName: 'СХП «Нерал-Матрикс»',
    fullName: 'ООО «СХП Нерал-Матрикс»',
    inn: '0269020691',
    role: 'farming',
    revenue2025Mln: 1041,
    netProfit2025Mln: 318,
    assets2025Mln: 2172,
    employees: 174,
  },
  {
    id: 'tsat',
    shortName: 'ООО «ЦАТ»',
    fullName: 'ООО «Центр Агротехнологий»',
    inn: '0250014172',
    role: 'property',
    revenue2025Mln: null,
    netProfit2025Mln: null,
    assets2025Mln: null,
    employees: 5,
    note: 'Публичная выручка в моке не заполнена — подтянуть из учёта.',
  },
]

export function getCompany(id: string): Company | undefined {
  return companies.find((c) => c.id === id)
}

export function groupTotals(companiesList: Company[]) {
  let revenue = 0
  let profit = 0
  let assets = 0
  let employees = 0
  for (const c of companiesList) {
    if (c.revenue2025Mln != null) revenue += c.revenue2025Mln
    if (c.netProfit2025Mln != null) profit += c.netProfit2025Mln
    if (c.assets2025Mln != null) assets += c.assets2025Mln
    if (c.employees != null) employees += c.employees
  }
  return { revenue, profit, assets, employees }
}

export const roleLabel: Record<CompanyRole, string> = {
  holding: 'Холдинг',
  farming: 'СХП / производство',
  service: 'Сервис',
  property: 'Недвижимость / прочее',
}
