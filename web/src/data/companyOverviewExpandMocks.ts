/** Демо-раскрытия KPI на карточке компании (без API). Стабильно от companyId + индекса. */

export type MockEmployee = {
  id: string
  fullName: string
  position: string
  department: string
  tabNumber: string
  email: string
  phone: string
  /** логин без @, для ссылки t.me */
  telegramUsername: string
  residentialAddress: string
  hiredAt: string
  note: string
}

export type KpiLine = { label: string; valueMln: number; hint?: string }

function seedFromString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return Math.abs(h) || 1
}

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const FIRST = [
  'Алексей',
  'Мария',
  'Дмитрий',
  'Елена',
  'Игорь',
  'Ольга',
  'Сергей',
  'Анна',
  'Павел',
  'Наталья',
  'Виктор',
  'Татьяна',
  'Андрей',
  'Светлана',
  'Роман',
]

const LAST = [
  'Иванов',
  'Петрова',
  'Сидоров',
  'Козлова',
  'Морозов',
  'Волкова',
  'Новиков',
  'Соколова',
  'Лебедев',
  'Орлова',
  'Семёнов',
  'Егорова',
  'Павлов',
  'Зайцева',
  'Фёдоров',
]

const POS = [
  'Руководитель направления',
  'Главный бухгалтер',
  'Экономист',
  'Специалист по закупкам',
  'Инженер по качеству',
  'Агроном',
  'Механик',
  'Логист',
  'HR-специалист',
  'Юрист',
  'IT-специалист',
  'Кладовщик',
  'Водитель',
  'Оператор производства',
  'Менеджер по продажам',
]

const DEPT = [
  'Финансы и учёт',
  'Производство',
  'Закупки и снабжение',
  'АХО',
  'IT и цифровизация',
  'Продажи и логистика',
  'Кадры',
  'Юридический отдел',
  'Склад',
  'Агрономическая служба',
]

const STREETS = [
  'ул. Менделеева',
  'ул. Комсомольская',
  'ул. Лесная',
  'пр-кт Октября',
  'ул. Советская',
  'ул. Центральная',
  'ул. Зелёная',
  'ул. Садовая',
]

export function generateMockEmployees(companyId: string, count: number | null): MockEmployee[] {
  if (count == null || count <= 0) return []
  const rnd = mulberry32(seedFromString(`emp:${companyId}`))
  const out: MockEmployee[] = []
  const slug = companyId.replace(/[^a-z0-9]/gi, '').toLowerCase() || 'co'
  for (let i = 0; i < count; i++) {
    const fi = Math.floor(rnd() * FIRST.length)
    const li = Math.floor(rnd() * LAST.length)
    const pi = Math.floor(rnd() * POS.length)
    const di = Math.floor(rnd() * DEPT.length)
    const si = Math.floor(rnd() * STREETS.length)
    const n = i + 1
    const telegramUsername = `neral_demo_${slug}_e${n}`
    const house = 1 + ((seedFromString(companyId) + n * 31) % 120)
    const flat = 1 + ((seedFromString(companyId) + n * 7) % 200)
    out.push({
      id: `${companyId}-emp-${n}`,
      fullName: `${FIRST[fi]} ${LAST[li]}`,
      position: POS[pi],
      department: DEPT[di],
      tabNumber: `${1000 + ((seedFromString(companyId) + n * 17) % 9000)}`,
      email: `demo.${companyId}.${n}@staff.neral.local`,
      phone: `+7 (347) ${200 + (n % 700)}-${String(10 + (n % 89)).padStart(2, '0')}-${String(10 + (n % 89)).padStart(2, '0')}`,
      telegramUsername,
      residentialAddress: `Респ. Башкортостан, г. Уфа, ${STREETS[si]}, д. ${house}, кв. ${flat} (демо)`,
      hiredAt: `${2018 + (n % 7)}-${String(1 + (n % 12)).padStart(2, '0')}-${String(1 + (n % 27)).padStart(2, '0')}`,
      note: 'Карточка демо: реальные данные появятся после интеграции с кадровым учётом.',
    })
  }
  return out
}

/** Четыре строки, сумма valueMln = total (округление на последней строке). */
function split4(total: number | null, seed: string, labels: [string, string, string, string]): KpiLine[] | null {
  if (total == null || total <= 0) return null
  const rnd = mulberry32(seedFromString(seed))
  const w = [rnd(), rnd(), rnd(), rnd()]
  const s = w.reduce((a, b) => a + b, 0)
  const raw = w.map((x) => (total * x) / s)
  const rounded: number[] = []
  let acc = 0
  for (let i = 0; i < 3; i++) {
    const v = Math.round(raw[i] * 100) / 100
    rounded.push(v)
    acc += v
  }
  rounded.push(Math.round((total - acc) * 100) / 100)
  return labels.map((label, i) => ({
    label,
    valueMln: rounded[i],
    hint: 'Демо-разбиение для интерфейса',
  }))
}

export function getRevenueBreakdownDemo(companyId: string, total: number | null): KpiLine[] | null {
  return split4(total, `rev:${companyId}`, ['Основная деятельность', 'Сервис / торговля', 'Прочие доходы', 'Корректировки (демо)'])
}

export function getProfitBreakdownDemo(companyId: string, total: number | null): KpiLine[] | null {
  return split4(total, `prf:${companyId}`, ['Операционная прибыль', 'Финансовый результат', 'Налоги (оценка)', 'Прочее (демо)'])
}

export function getAssetsBreakdownDemo(companyId: string, total: number | null): KpiLine[] | null {
  return split4(total, `ast:${companyId}`, ['Основные средства', 'Оборотные активы', 'Финансовые вложения', 'Прочие активы'])
}
