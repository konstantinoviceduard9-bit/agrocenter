/** Мок финансов: касса, дебиторка, кредиторка. База + возможность подмены через public/data/dashboard.snapshot.json */
import type { YearId } from '../types/period'

export type CashRow = {
  companyId: string
  /** млн ₽ ликвидных средств (условно) */
  cashMln: number
  /** дней покрытия платежей (условно) */
  runwayDays: number
}

export type ARRow = {
  companyId: string
  counterparty: string
  bucket: '0–30' | '31–60' | '61+'
  amountMln: number
}

export type APRow = {
  companyId: string
  vendor: string
  dueInDays: number
  amountMln: number
}

export type FinanceYearBlock = { cash: CashRow[]; ar: ARRow[]; ap: APRow[] }

export const builtinFinanceByYear: Record<YearId, FinanceYearBlock> = {
  2025: {
    cash: [
      { companyId: 'intelko', cashMln: 42.1, runwayDays: 38 },
      { companyId: 'agrocenter', cashMln: 2.4, runwayDays: 52 },
      { companyId: 'chishmy', cashMln: 18.6, runwayDays: 24 },
      { companyId: 'buzdyak', cashMln: 61.2, runwayDays: 90 },
      { companyId: 'matrix', cashMln: 33.0, runwayDays: 44 },
      { companyId: 'tsat', cashMln: 0.8, runwayDays: 120 },
    ],
    ar: [
      { companyId: 'chishmy', counterparty: 'ООО «АгроСбыт»', bucket: '0–30', amountMln: 12.4 },
      { companyId: 'chishmy', counterparty: 'АО «Переработка»', bucket: '31–60', amountMln: 6.2 },
      { companyId: 'matrix', counterparty: 'ИП Иванов', bucket: '61+', amountMln: 2.1 },
      { companyId: 'buzdyak', counterparty: 'ООО «ЗерноТрейд»', bucket: '0–30', amountMln: 9.8 },
      { companyId: 'intelko', counterparty: 'ООО «Логистик»', bucket: '31–60', amountMln: 3.5 },
      { companyId: 'agrocenter', counterparty: 'СХП «Сосед»', bucket: '0–30', amountMln: 1.2 },
    ],
    ap: [
      { companyId: 'chishmy', vendor: 'ООО «Семена»', dueInDays: 5, amountMln: 4.2 },
      { companyId: 'chishmy', vendor: 'АО «Топливо»', dueInDays: 12, amountMln: 8.9 },
      { companyId: 'matrix', vendor: 'ООО «Запчасти»', dueInDays: 3, amountMln: 1.7 },
      { companyId: 'buzdyak', vendor: 'ООО «ГСМ»', dueInDays: 7, amountMln: 6.0 },
      { companyId: 'intelko', vendor: 'Услуги связи', dueInDays: 20, amountMln: 0.35 },
    ],
  },
  2024: {
    cash: [
      { companyId: 'intelko', cashMln: 36.0, runwayDays: 30 },
      { companyId: 'agrocenter', cashMln: 2.1, runwayDays: 48 },
      { companyId: 'chishmy', cashMln: 22.0, runwayDays: 28 },
      { companyId: 'buzdyak', cashMln: 55.0, runwayDays: 85 },
      { companyId: 'matrix', cashMln: 28.0, runwayDays: 40 },
      { companyId: 'tsat', cashMln: 0.6, runwayDays: 100 },
    ],
    ar: [
      { companyId: 'chishmy', counterparty: 'ООО «АгроСбыт»', bucket: '0–30', amountMln: 10.0 },
      { companyId: 'buzdyak', counterparty: 'ООО «ЗерноТрейд»', bucket: '31–60', amountMln: 7.0 },
    ],
    ap: [
      { companyId: 'chishmy', vendor: 'ООО «Семена»', dueInDays: 6, amountMln: 3.8 },
      { companyId: 'matrix', vendor: 'ООО «Запчасти»', dueInDays: 4, amountMln: 1.5 },
    ],
  },
}

export function sumCashRows(rows: CashRow[]): number {
  return rows.reduce((s, r) => s + r.cashMln, 0)
}

export function arAgingTotalsForRows(rows: ARRow[]) {
  const buckets = { '0–30': 0, '31–60': 0, '61+': 0 } as Record<ARRow['bucket'], number>
  for (const r of rows) {
    buckets[r.bucket] += r.amountMln
  }
  const total = rows.reduce((s, r) => s + r.amountMln, 0)
  return { buckets, total }
}

export function apDue7dForRows(rows: APRow[]): number {
  return rows.filter((r) => r.dueInDays <= 7).reduce((s, r) => s + r.amountMln, 0)
}
