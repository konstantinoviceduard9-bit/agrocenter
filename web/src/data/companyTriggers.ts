import type { Company, CompanyRole } from './companies'

/** Настраиваемый триггер мониторинга (мок: без бэкенда, справочник под юрлицо + демо-пороги). */
export type CompanyTrigger = {
  id: string
  area: string
  title: string
  description: string
  /** Условное значение порога для демо-экрана */
  thresholdDemo?: string
  /** План доставки алерта в демо (реальная настройка — позже) */
  notifyDemo?: string
}

type Tpl = {
  code: string
  area: string
  title: string
  description: string
  thresholdDemo?: string
  notifyDemo?: string
}

const HOLDING: Tpl[] = [
  {
    code: 'cash-gap-group',
    area: 'Финансы',
    title: 'Прогноз кассового разрыва по группе',
    description: 'Остаток денег vs платежи в горизонте 30 дней по консолидации; алерт при отрицательном «окне».',
    thresholdDemo: 'Окно < 0 ₽ в любой из 5 ближайших рабочих дней',
    notifyDemo: 'TG + MAX',
  },
  {
    code: 'ebitda-variance',
    area: 'Финансы',
    title: 'Отклонение EBITDA «дочек» от плана',
    description: 'Суммарная операционная прибыль по юрлицам vs квартальный бюджет холдинга.',
    thresholdDemo: 'Σ отклонение > 8% к плану квартала',
    notifyDemo: 'MAX',
  },
  {
    code: 'ar-concentration',
    area: 'Финансы',
    title: 'Концентрация дебиторки',
    description: 'Топ-3 контрагента группы дают более 45% дебиторки — риск ликвидности.',
    thresholdDemo: 'Доля топ-3 ≥ 45%',
    notifyDemo: 'TG',
  },
  {
    code: 'related-party',
    area: 'Управление',
    title: 'Внутригрупповые обязательства',
    description: 'Крупные займы/гарантии между юрлицами: срок возврата, пролонгация, нарушение лимитов.',
    thresholdDemo: 'Сумма > 50 млн ₽ или просрочка > 7 дней',
    notifyDemo: 'TG + Email',
  },
  {
    code: 'legal-kad',
    area: 'Риски',
    title: 'Новые материалы в арбитраже',
    description: 'Появление новых дел kad.arbitr.ru против юрлиц группы или сумма иска > порога.',
    thresholdDemo: 'Новое дело или иск > 10 млн ₽',
    notifyDemo: 'TG + MAX',
  },
  {
    code: 'liquidity-rank',
    area: 'Финансы',
    title: 'Рейтинг ликвидности юрлиц',
    description: 'Юрлицо в «красной зоне» по горизонту кассы — эскалация на ИД.',
    thresholdDemo: 'Runway < 21 дня',
    notifyDemo: 'MAX',
  },
  {
    code: 'covenant-bank',
    area: 'Финансы',
    title: 'Ковенанты по кредитным линиям',
    description: 'Net debt/EBITDA, чистые активы, минимальный остаток на счёте — нарушение зоны комфорта.',
    thresholdDemo: 'Отклонение > 0,05× от лимита договора',
    notifyDemo: 'Email + TG',
  },
  {
    code: 'consolidation-lag',
    area: 'Учёт',
    title: 'Задержка закрытия периода по дочкам',
    description: 'Отчётность не собрана в срок для консолидации — риск ошибок в сводке.',
    thresholdDemo: 'D+5 после дедлайна без статуса «закрыто»',
    notifyDemo: 'MAX',
  },
  {
    code: 'dividend-policy',
    area: 'Корпоративное',
    title: 'Дивиденды и промежуточные выплаты',
    description: 'Согласованные выплаты vs фактический cash-out; превышение лимита без протокола.',
    thresholdDemo: 'Сумма выплат > утверждённого лимита периода',
    notifyDemo: 'TG',
  },
  {
    code: 'fx-exposure',
    area: 'Финансы',
    title: 'Валютная позиция группы',
    description: 'Чистая позиция по валюте vs лимит хеджирования (после подключения казначейства).',
    thresholdDemo: '|Net FX| > 2 млн USD-экв.',
    notifyDemo: 'Email',
  },
]

const SERVICE: Tpl[] = [
  {
    code: 'ar-aging',
    area: 'Финансы',
    title: 'Дебиторка сервиса по срокам',
    description: 'Контрагенты B2B: ведро 61+ или сумма просрочки выше порога по сегменту.',
    thresholdDemo: '61+ > 1,5 млн ₽ или рост 61+ за неделю > 15%',
    notifyDemo: 'TG',
  },
  {
    code: 'sla-field',
    area: 'Операции',
    title: 'SLA выездов и поставок',
    description: 'Нарушение SLA сервисных бригад / отгрузок относительно договорных окон.',
    thresholdDemo: 'SLA < 92% за rolling 7 дней',
    notifyDemo: 'MAX',
  },
  {
    code: 'warehouse-load',
    area: 'Операции',
    title: 'Загрузка склада и очереди',
    description: 'Пиковая очередь отгрузки, простой линий упаковки, риск срыва отгрузки клиенту.',
    thresholdDemo: 'Очередь отгрузки > 6 ч в пик',
    notifyDemo: 'TG + MAX',
  },
  {
    code: 'cash-cycle',
    area: 'Финансы',
    title: 'Длина операционного цикла',
    description: 'Запасы + дебиторка растут быстрее выручки — сигнал по оборотному капиталу.',
    thresholdDemo: 'DIO+DSO выросли MoM > 5 дней',
    notifyDemo: 'Email',
  },
  {
    code: 'b2b-claims',
    area: 'Качество',
    title: 'Претензии B2B',
    description: 'Порог по открытым претензиям/возвратам за период (интеграция с CRM позже).',
    thresholdDemo: '> 8 активных претензий или сумма > 0,8 млн ₽',
    notifyDemo: 'TG',
  },
  {
    code: 'critical-supplier',
    area: 'Закупки',
    title: 'Критичные поставщики',
    description: 'Задержка поставки упаковки/запчастей, риск остановки сервисной цепочки.',
    thresholdDemo: 'Просрочка поставки > 3 дней по категории A',
    notifyDemo: 'MAX',
  },
  {
    code: 'helpdesk-backlog',
    area: 'Клиенты',
    title: 'Очередь заявок в поддержку',
    description: 'Накопление необработанных заявок B2B — риск эскалаций и потери SLA.',
    thresholdDemo: '> 40 тикетов в статусе «новый» > 4 ч',
    notifyDemo: 'TG',
  },
  {
    code: 'price-list-drift',
    area: 'Коммерция',
    title: 'Расхождение цен прайс vs 1С',
    description: 'Контроль расхождений между выставленными ценами и учётной номенклатурой.',
    thresholdDemo: '> 12 строк с расхождением > 2%',
    notifyDemo: 'Email',
  },
  {
    code: 'fleet-availability',
    area: 'Логистика',
    title: 'Доступность автопарка',
    description: 'Доля машин на линии vs план на смену — риск срыва маршрутов.',
    thresholdDemo: 'Доступность < 85% в пиковую смену',
    notifyDemo: 'TG + MAX',
  },
  {
    code: 'returns-spike',
    area: 'Качество',
    title: 'Всплеск возвратов',
    description: 'Рост возвратов по SKU/контрагенту за короткий период.',
    thresholdDemo: 'WoW +25% по сумме возвратов',
    notifyDemo: 'TG',
  },
]

const FARMING_BASE: Tpl[] = [
  {
    code: 'weather-window',
    area: 'Полевые работы',
    title: 'Окно посева / уборки vs погода',
    description: 'Прогноз осадков <3 дня и поле не убрано/не засеяно в расчётном окне.',
    thresholdDemo: 'Осадки > 5 мм в окне 48 ч и поле не готово',
    notifyDemo: 'MAX',
  },
  {
    code: 'machinery-idle',
    area: 'Техника',
    title: 'Простой техники в пик сезона',
    description: 'Комбайн/трактор без движения >12 ч в окне посева/уборки (телематика).',
    thresholdDemo: 'Простой > 12 ч при активном сезонном флаге',
    notifyDemo: 'TG',
  },
  {
    code: 'gsm-mom',
    area: 'ГСМ',
    title: 'Аномалия расхода ГСМ',
    description: 'Расход топлива MoM выше порога (часто поломка, маршрут или риск хищений).',
    thresholdDemo: 'MoM расхода > +18% при том же парке работ',
    notifyDemo: 'TG + MAX',
  },
  {
    code: 'ndvi-yield',
    area: 'Агрономия',
    title: 'NDVI и прогноз урожайности',
    description: 'Падение вегетационного индекса по ключевым полям относительно нормы года.',
    thresholdDemo: 'NDVI ниже нормы −0,12 на поле > 80 га',
    notifyDemo: 'Email',
  },
  {
    code: 'input-delay',
    area: 'Закупки сезона',
    title: 'Срыв поставок СЗР / семян / ГСМ',
    description: 'Ключевой поставщик в сезон: просрочка поставки X дней — риск срыва операций.',
    thresholdDemo: 'Просрочка > 5 дней по заказу категории A',
    notifyDemo: 'MAX',
  },
  {
    code: 'soil-moisture',
    area: 'Агрономия',
    title: 'Влажность почвы и полив',
    description: 'Критические зоны по влаге при высокой эвапотранспирации — риск стресса культуры.',
    thresholdDemo: '< 25% FC на участке > 40 га 2 дня подряд',
    notifyDemo: 'TG',
  },
  {
    code: 'harvest-moisture',
    area: 'Зерно / сырьё',
    title: 'Влажность убранного зерна',
    description: 'Приёмка: влажность вне коридора — риск штрафа на элеваторе и простоя транспорта.',
    thresholdDemo: 'Влажность > целевого +1,5 п.п.',
    notifyDemo: 'TG + MAX',
  },
  {
    code: 'contractor-safety',
    area: 'Безопасность',
    title: 'Допуски подрядчиков на полях',
    description: 'Истекающие медосмотры/инструктажи у подрядчиков в сезон.',
    thresholdDemo: 'Допуск истекает < 7 дней при активных работах',
    notifyDemo: 'MAX',
  },
]

const PROPERTY: Tpl[] = [
  {
    code: 'occupancy',
    area: 'Аренда',
    title: 'Загрузка площадей',
    description: 'Фактическая занятость сдаваемых площадей % vs план и сезонность.',
    thresholdDemo: 'Загрузка < 78% 2 месяца подряд',
    notifyDemo: 'Email',
  },
  {
    code: 'rent-arrears',
    area: 'Аренда',
    title: 'Просрочка арендной платы',
    description: 'Арендаторы с задолженностью свыше N дней или суммы по договору.',
    thresholdDemo: 'Просрочка > 14 дней или долг > 0,5 млн ₽',
    notifyDemo: 'TG',
  },
  {
    code: 'lease-renewal',
    area: 'Договоры',
    title: 'Сроки продления договоров',
    description: 'До окончания договора аренды <90 дней без решения о пролонгации/выходе.',
    thresholdDemo: '< 90 дней без статуса в CRM',
    notifyDemo: 'MAX',
  },
  {
    code: 'vacant',
    area: 'Объекты',
    title: 'Длительно пустующие единицы',
    description: 'Площадь без арендатора дольше порога — обзор маркетинга и ставки.',
    thresholdDemo: 'Простой > 120 дней',
    notifyDemo: 'Email + TG',
  },
  {
    code: 'capex-utility',
    area: 'Финансы',
    title: 'Коммуналка и капремонт',
    description: 'Фактические затраты на содержание и ремонт превышают бюджет периода.',
    thresholdDemo: 'Превышение бюджета > 10% за месяц',
    notifyDemo: 'TG',
  },
  {
    code: 'cadastre',
    area: 'Риски',
    title: 'Страхование и обременения',
    description: 'Истечение полисов, новые обременения по объектам в кадастре.',
    thresholdDemo: 'Полис истекает < 30 дней',
    notifyDemo: 'MAX',
  },
  {
    code: 'cam-reconciliation',
    area: 'Финансы',
    title: 'CAM и коммунальные начисления',
    description: 'Расхождение фактических коммунальных/CAM с начислениями арендаторам.',
    thresholdDemo: 'Расхождение > 5% по объекту за квартал',
    notifyDemo: 'Email',
  },
  {
    code: 'tenant-churn',
    area: 'Аренда',
    title: 'Отток арендаторов',
    description: 'Расторжения и отказы от продления выше нормы — сигнал по продукту/ставке.',
    thresholdDemo: '> 2 расторжения за квартал на одном объекте',
    notifyDemo: 'TG + MAX',
  },
  {
    code: 'indexation',
    area: 'Договоры',
    title: 'Индексация аренды',
    description: 'Наступление даты индексации без обновлённого счёта и акта.',
    thresholdDemo: 'D−14 до даты индексации без документов',
    notifyDemo: 'Email',
  },
  {
    code: 'engineering-tickets',
    area: 'Эксплуатация',
    title: 'Заявки инженерной службы',
    description: 'Накопление аварийных/критичных заявок по зданиям.',
    thresholdDemo: '> 5 критичных заявок без закрытия > 72 ч',
    notifyDemo: 'TG',
  },
]

function tplToTrigger(companyId: string, t: Tpl): CompanyTrigger {
  return {
    id: `${companyId}-${t.code}`,
    area: t.area,
    title: t.title,
    description: t.description,
    thresholdDemo: t.thresholdDemo,
    notifyDemo: t.notifyDemo,
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
          thresholdDemo: '−5% к скользящей средней 3 дня подряд',
          notifyDemo: 'TG + MAX',
        })
      }
      if (c.id === 'buzdyak') {
        templates.splice(2, 0, {
          code: 'grain-reception',
          area: 'Зерно',
          title: 'Качество приёмки зерна',
          description: 'Влажность/класс/засорённость вне допуска на элеваторе — риск штрафа и потерь.',
          thresholdDemo: 'Класс или влажность вне коридора договора',
          notifyDemo: 'MAX',
        })
      }
      if (c.id === 'matrix') {
        templates.splice(2, 0, {
          code: 'throughput-plan',
          area: 'Производство',
          title: 'Выпуск vs план (тонны)',
          description: 'Суточный/недельный выпуск ключевых SKU ниже плана — MES / 1С УПП.',
          thresholdDemo: 'Выпуск < 93% плана 2 смены подряд',
          notifyDemo: 'TG',
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
