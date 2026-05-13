import type { Company, CompanyRole } from './companies'

/** Настраиваемый триггер мониторинга (мок: без бэкенда, только справочник под юрлицо). */
export type CompanyTrigger = {
  id: string
  area: string
  title: string
  description: string
}

type Tpl = { code: string; area: string; title: string; description: string }

const HOLDING: Tpl[] = [
  {
    code: 'cash-gap-group',
    area: 'Финансы',
    title: 'Прогноз кассового разрыва по группе',
    description: 'Остаток денег vs платежи в горизонте 30 дней по консолидации; алерт при отрицательном «окне».',
  },
  {
    code: 'ebitda-variance',
    area: 'Финансы',
    title: 'Отклонение EBITDA «дочек» от плана',
    description: 'Суммарная операционная прибыль по юрлицам vs квартальный бюджет холдинга.',
  },
  {
    code: 'ar-concentration',
    area: 'Финансы',
    title: 'Концентрация дебиторки',
    description: 'Топ-3 контрагента группы дают более 45% дебиторки — риск ликвидности.',
  },
  {
    code: 'related-party',
    area: 'Управление',
    title: 'Внутригрупповые обязательства',
    description: 'Крупные займы/гарантии между юрлицами: срок возврата, пролонгация, нарушение лимитов.',
  },
  {
    code: 'legal-kad',
    area: 'Риски',
    title: 'Новые материалы в арбитраже',
    description: 'Появление новых дел kad.arbitr.ru против юрлиц группы или сумма иска > порога.',
  },
  {
    code: 'liquidity-rank',
    area: 'Финансы',
    title: 'Рейтинг ликвидности юрлиц',
    description: 'Юрлицо в «красной зоне» по горизонту кассы — эскалация на ИД.',
  },
]

const SERVICE: Tpl[] = [
  {
    code: 'ar-aging',
    area: 'Финансы',
    title: 'Дебиторка сервиса по срокам',
    description: 'Контрагенты B2B: ведро 61+ или сумма просрочки выше порога по сегменту.',
  },
  {
    code: 'sla-field',
    area: 'Операции',
    title: 'SLA выездов и поставок',
    description: 'Нарушение SLA сервисных бригад / отгрузок относительно договорных окон.',
  },
  {
    code: 'warehouse-load',
    area: 'Операции',
    title: 'Загрузка склада и очереди',
    description: 'Пиковая очередь отгрузки, простой линий упаковки, риск срыва отгрузки клиенту.',
  },
  {
    code: 'cash-cycle',
    area: 'Финансы',
    title: 'Длина операционного цикла',
    description: 'Запасы + дебиторка растут быстрее выручки — сигнал по оборотному капиталу.',
  },
  {
    code: 'b2b-claims',
    area: 'Качество',
    title: 'Претензии B2B',
    description: 'Порог по открытым претензиям/возвратам за период (интеграция с CRM позже).',
  },
  {
    code: 'critical-supplier',
    area: 'Закупки',
    title: 'Критичные поставщики',
    description: 'Задержка поставки упаковки/запчастей, риск остановки сервисной цепочки.',
  },
]

const FARMING_BASE: Tpl[] = [
  {
    code: 'weather-window',
    area: 'Полевые работы',
    title: 'Окно посева / уборки vs погода',
    description: 'Прогноз осадков <3 дня и поле не убрано/не засеяно в расчётном окне.',
  },
  {
    code: 'machinery-idle',
    area: 'Техника',
    title: 'Простой техники в пик сезона',
    description: 'Комбайн/трактор без движения >12 ч в окне посева/уборки (телематика).',
  },
  {
    code: 'gsm-mom',
    area: 'ГСМ',
    title: 'Аномалия расхода ГСМ',
    description: 'Расход топлива MoM выше порога (часто поломка, маршрут или риск хищений).',
  },
  {
    code: 'ndvi-yield',
    area: 'Агрономия',
    title: 'NDVI и прогноз урожайности',
    description: 'Падение вегетационного индекса по ключевым полям относительно нормы года.',
  },
  {
    code: 'input-delay',
    area: 'Закупки сезона',
    title: 'Срыв поставок СЗР / семян / ГСМ',
    description: 'Ключевой поставщик в сезон: просрочка поставки X дней — риск срыва операций.',
  },
]

const PROPERTY: Tpl[] = [
  {
    code: 'occupancy',
    area: 'Аренда',
    title: 'Загрузка площадей',
    description: 'Фактическая занятость сдаваемых площадей % vs план и сезонность.',
  },
  {
    code: 'rent-arrears',
    area: 'Аренда',
    title: 'Просрочка арендной платы',
    description: 'Арендаторы с задолженностью свыше N дней или суммы по договору.',
  },
  {
    code: 'lease-renewal',
    area: 'Договоры',
    title: 'Сроки продления договоров',
    description: 'До окончания договора аренды <90 дней без решения о пролонгации/выходе.',
  },
  {
    code: 'vacant',
    area: 'Объекты',
    title: 'Длительно пустующие единицы',
    description: 'Площадь без арендатора дольше порога — обзор маркетинга и ставки.',
  },
  {
    code: 'capex-utility',
    area: 'Финансы',
    title: 'Коммуналка и капремонт',
    description: 'Фактические затраты на содержание и ремонт превышают бюджет периода.',
  },
  {
    code: 'cadastre',
    area: 'Риски',
    title: 'Страхование и обременения',
    description: 'Истечение полисов, новые обременения по объектам в кадастре.',
  },
]

function tplToTrigger(companyId: string, t: Tpl): CompanyTrigger {
  return {
    id: `${companyId}-${t.code}`,
    area: t.area,
    title: t.title,
    description: t.description,
  }
}

/** Триггеры по роду деятельности + точечные уточнения для СХП. */
export function getCompanyTriggers(c: Company): CompanyTrigger[] {
  let templates: Tpl[] = []
  switch (c.role) {
    case 'holding':
      templates = HOLDING
      break
    case 'service':
      templates = SERVICE
      break
    case 'property':
      templates = PROPERTY
      break
    case 'farming':
      templates = [...FARMING_BASE]
      if (c.id === 'chishmy') {
        templates.splice(2, 0, {
          code: 'milk-yield',
          area: 'Животноводство',
          title: 'Падение надоя к средней',
          description: 'Отклонение надоя от 30-дневной средней >5% за 3 дня — корма, здоровье стада.',
        })
      }
      if (c.id === 'buzdyak') {
        templates.splice(2, 0, {
          code: 'grain-reception',
          area: 'Зерно',
          title: 'Качество приёмки зерна',
          description: 'Влажность/класс/засорённость вне допуска на элеваторе — риск штрафа и потерь.',
        })
      }
      if (c.id === 'matrix') {
        templates.splice(2, 0, {
          code: 'throughput-plan',
          area: 'Производство',
          title: 'Выпуск vs план (тонны)',
          description: 'Суточный/недельный выпуск ключевых SKU ниже плана — MES / 1С УПП.',
        })
      }
      break
    default:
      templates = []
  }
  return templates.map((t) => tplToTrigger(c.id, t))
}

export function roleTriggersSummary(role: CompanyRole): string {
  const map: Record<CompanyRole, string> = {
    holding: 'финансы группы, консолидация, риски',
    farming: 'поля, техника, сезон, закупки ввода',
    service: 'SLA, склад, дебиторка, сервисная цепочка',
    property: 'аренда, объекты, договоры, капзатраты',
  }
  return map[role]
}
