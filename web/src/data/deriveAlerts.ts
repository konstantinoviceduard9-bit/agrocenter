import type { Company } from './companies'
import type { APRow, ARRow, CashRow } from './financeMocks'
import type { YearId } from '../types/period'
import { fmtMln } from '../lib/format'

export type AlertCategory = 'debitor' | 'liquidity' | 'creditor'

/** Сигналы, выведенные из моков финансов (без отдельного API). */
export type DerivedAlert = {
  id: string
  companyId: string
  companyName: string
  severity: 1 | 2 | 3
  category: AlertCategory
  title: string
  detail: string
}

function slug(s: string): string {
  return s.replace(/\s+/g, '-').slice(0, 48)
}

export function deriveAlerts(
  companies: Company[],
  year: YearId,
  ar: ARRow[],
  ap: APRow[],
  cash: CashRow[],
): DerivedAlert[] {
  const name = (id: string) => companies.find((c) => c.id === id)?.shortName ?? id
  const out: DerivedAlert[] = []

  for (const r of ar) {
    if (r.bucket === '61+') {
      out.push({
        id: `ar61-${year}-${r.companyId}-${slug(r.counterparty)}`,
        companyId: r.companyId,
        companyName: name(r.companyId),
        severity: 3,
        category: 'debitor',
        title: 'Дебиторка 61+',
        detail: `${r.counterparty} · ${fmtMln(r.amountMln)} млн ₽`,
      })
    } else if (r.bucket === '31–60') {
      out.push({
        id: `ar31-${year}-${r.companyId}-${slug(r.counterparty)}`,
        companyId: r.companyId,
        companyName: name(r.companyId),
        severity: 2,
        category: 'debitor',
        title: 'Дебиторка 31–60 дн.',
        detail: `${r.counterparty} · ${fmtMln(r.amountMln)} млн ₽`,
      })
    }
  }

  for (const r of cash) {
    if (r.runwayDays < 28) {
      out.push({
        id: `cash-${year}-${r.companyId}`,
        companyId: r.companyId,
        companyName: name(r.companyId),
        severity: r.runwayDays < 18 ? 3 : 2,
        category: 'liquidity',
        title: 'Низкий горизонт кассы (мок)',
        detail: `${fmtMln(r.cashMln)} млн ₽ на счетах · ${r.runwayDays} дн. покрытия`,
      })
    }
  }

  for (const r of ap) {
    if (r.dueInDays <= 3) {
      out.push({
        id: `ap-${year}-${r.companyId}-${slug(r.vendor)}`,
        companyId: r.companyId,
        companyName: name(r.companyId),
        severity: 2,
        category: 'creditor',
        title: 'Оплата поставщику ≤ 3 дн.',
        detail: `${r.vendor} · ${fmtMln(r.amountMln)} млн ₽ · через ${r.dueInDays} дн.`,
      })
    }
  }

  return out.sort((a, b) => {
    if (b.severity !== a.severity) return b.severity - a.severity
    return a.companyName.localeCompare(b.companyName, 'ru')
  })
}
