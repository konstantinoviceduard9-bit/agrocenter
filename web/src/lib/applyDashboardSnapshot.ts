import type { Company, CompanyRole } from '../data/companies'
import { companies as builtinCompanies } from '../data/companies'
import type { APRow, ARRow, CashRow } from '../data/financeMocks'
import { builtinFinanceByYear } from '../data/financeMocks'
import type { YearId } from '../types/period'

const YEARS: YearId[] = ['2024', '2025']
const ROLES: CompanyRole[] = ['holding', 'farming', 'service', 'property']
const AR_BUCKETS: ARRow['bucket'][] = ['0–30', '31–60', '61+']

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null && !Array.isArray(x)
}

function isYearId(x: string): x is YearId {
  return x === '2024' || x === '2025'
}

function isCompanyRole(x: string): x is CompanyRole {
  return (ROLES as string[]).includes(x)
}

function pickRole(raw: unknown): CompanyRole | undefined {
  if (typeof raw !== 'string' || !isCompanyRole(raw)) return undefined
  return raw
}

function pickNumber(raw: unknown): number | null | undefined {
  if (raw === undefined) return undefined
  if (raw === null) return null
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw
  if (typeof raw === 'string' && raw.trim() !== '' && Number.isFinite(Number(raw))) return Number(raw)
  return undefined
}

function pickInt(raw: unknown): number | null | undefined {
  const n = pickNumber(raw)
  if (n === undefined) return undefined
  if (n === null) return null
  return Math.round(n)
}

function pickString(raw: unknown): string | undefined {
  if (typeof raw !== 'string') return undefined
  const t = raw.trim()
  return t === '' ? undefined : t
}

function parseCompanyPatch(raw: unknown, warnings: string[]): Partial<Company> | null {
  if (!isRecord(raw)) {
    warnings.push('Элемент companies[] не объект — пропуск.')
    return null
  }
  const id = pickString(raw.id)
  if (!id) {
    warnings.push('В companies[] нет id — пропуск.')
    return null
  }
  const patch: Partial<Company> = { id }
  const shortName = pickString(raw.shortName)
  const fullName = pickString(raw.fullName)
  const inn = pickString(raw.inn)
  const note = pickString(raw.note)
  const role = pickRole(raw.role)
  if (shortName !== undefined) patch.shortName = shortName
  if (fullName !== undefined) patch.fullName = fullName
  if (inn !== undefined) patch.inn = inn
  if (raw.note === null) patch.note = undefined
  else if (note !== undefined) patch.note = note
  if (role !== undefined) patch.role = role
  if (raw.role !== undefined && role === undefined) warnings.push(`Компания ${id}: неизвестная роль — поле проигнорировано.`)

  const r = pickNumber(raw.revenue2025Mln)
  const p = pickNumber(raw.netProfit2025Mln)
  const a = pickNumber(raw.assets2025Mln)
  const e = pickInt(raw.employees)
  if (r !== undefined) patch.revenue2025Mln = r
  if (p !== undefined) patch.netProfit2025Mln = p
  if (a !== undefined) patch.assets2025Mln = a
  if (e !== undefined) patch.employees = e

  return patch
}

function parseCashRow(raw: unknown, warnings: string[], validCompanyIds: Set<string>): CashRow | null {
  if (!isRecord(raw)) {
    warnings.push('Строка cash не объект — пропуск.')
    return null
  }
  const companyId = pickString(raw.companyId)
  const cashMln = pickNumber(raw.cashMln)
  const runwayDays = pickInt(raw.runwayDays)
  if (!companyId || cashMln === undefined || cashMln === null || runwayDays === undefined || runwayDays === null) {
    warnings.push('Строка cash: нужны companyId, cashMln, runwayDays — пропуск.')
    return null
  }
  if (!validCompanyIds.has(companyId)) warnings.push(`cash: неизвестный companyId «${companyId}» — строка всё же принята.`)
  return { companyId, cashMln, runwayDays }
}

function parseARRow(raw: unknown, warnings: string[], validCompanyIds: Set<string>): ARRow | null {
  if (!isRecord(raw)) {
    warnings.push('Строка ar не объект — пропуск.')
    return null
  }
  const companyId = pickString(raw.companyId)
  const counterparty = pickString(raw.counterparty)
  const bucket = typeof raw.bucket === 'string' && (AR_BUCKETS as string[]).includes(raw.bucket) ? (raw.bucket as ARRow['bucket']) : undefined
  const amountMln = pickNumber(raw.amountMln)
  if (!companyId || !counterparty || bucket === undefined || amountMln === undefined || amountMln === null) {
    warnings.push('Строка ar: нужны companyId, counterparty, bucket (0–30|31–60|61+), amountMln — пропуск.')
    return null
  }
  if (!validCompanyIds.has(companyId)) warnings.push(`ar: неизвестный companyId «${companyId}».`)
  return { companyId, counterparty, bucket, amountMln }
}

function parseAPRow(raw: unknown, warnings: string[], validCompanyIds: Set<string>): APRow | null {
  if (!isRecord(raw)) {
    warnings.push('Строка ap не объект — пропуск.')
    return null
  }
  const companyId = pickString(raw.companyId)
  const vendor = pickString(raw.vendor)
  const dueInDays = pickInt(raw.dueInDays)
  const amountMln = pickNumber(raw.amountMln)
  if (!companyId || !vendor || dueInDays === undefined || dueInDays === null || amountMln === undefined || amountMln === null) {
    warnings.push('Строка ap: нужны companyId, vendor, dueInDays, amountMln — пропуск.')
    return null
  }
  if (!validCompanyIds.has(companyId)) warnings.push(`ap: неизвестный companyId «${companyId}».`)
  return { companyId, vendor, dueInDays, amountMln }
}

function cloneFinance() {
  return structuredClone(builtinFinanceByYear) as Record<YearId, { cash: CashRow[]; ar: ARRow[]; ap: APRow[] }>
}

export type ApplySnapshotResult =
  | { ok: true; mergedCompanies: Company[]; financeByYear: Record<YearId, { cash: CashRow[]; ar: ARRow[]; ap: APRow[] }>; warnings: string[] }
  | { ok: false; error: string }

/** Слияние встроенных моков с JSON-снимком (редактируемый файл в public/data/). */
export function applyDashboardSnapshot(raw: unknown): ApplySnapshotResult {
  const warnings: string[] = []
  if (!isRecord(raw)) return { ok: false, error: 'Корень снимка должен быть JSON-объектом.' }

  const patchById = new Map<string, Partial<Company>>()
  if (raw.companies !== undefined) {
    if (!Array.isArray(raw.companies)) return { ok: false, error: 'Поле companies должно быть массивом.' }
    for (const item of raw.companies) {
      const p = parseCompanyPatch(item, warnings)
      if (p?.id) patchById.set(p.id, p)
    }
  }

  const mergedCompanies: Company[] = builtinCompanies.map((c) => {
    const patch = patchById.get(c.id)
    if (!patch) return { ...c }
    const { id: _id, ...rest } = patch
    return { ...c, ...rest }
  })

  for (const id of patchById.keys()) {
    if (!builtinCompanies.some((c) => c.id === id)) warnings.push(`Компания «${id}» в файле не совпала со справочником — блок companies проигнорирован для неё.`)
  }

  const validIds = new Set(mergedCompanies.map((c) => c.id))
  const financeByYear = cloneFinance()

  if (raw.finance !== undefined) {
    if (!isRecord(raw.finance)) return { ok: false, error: 'Поле finance должно быть объектом по годам.' }
    for (const key of Object.keys(raw.finance)) {
      if (!isYearId(key)) {
        warnings.push(`Ключ года «${key}» не поддерживается (только 2024, 2025).`)
        continue
      }
      const block = raw.finance[key]
      if (!isRecord(block)) {
        warnings.push(`finance.${key} не объект — пропуск года.`)
        continue
      }
      if (!financeByYear[key]) financeByYear[key] = { cash: [], ar: [], ap: [] }

      if (block.cash !== undefined) {
        if (!Array.isArray(block.cash)) {
          warnings.push(`finance.${key}.cash должен быть массивом.`)
        } else {
          const rows = block.cash.map((r) => parseCashRow(r, warnings, validIds)).filter((x): x is CashRow => x != null)
          financeByYear[key].cash = rows
        }
      }
      if (block.ar !== undefined) {
        if (!Array.isArray(block.ar)) {
          warnings.push(`finance.${key}.ar должен быть массивом.`)
        } else {
          financeByYear[key].ar = block.ar.map((r) => parseARRow(r, warnings, validIds)).filter((x): x is ARRow => x != null)
        }
      }
      if (block.ap !== undefined) {
        if (!Array.isArray(block.ap)) {
          warnings.push(`finance.${key}.ap должен быть массивом.`)
        } else {
          financeByYear[key].ap = block.ap.map((r) => parseAPRow(r, warnings, validIds)).filter((x): x is APRow => x != null)
        }
      }
    }
  }

  for (const y of YEARS) {
    if (!financeByYear[y]) financeByYear[y] = { cash: [], ar: [], ap: [] }
  }

  return { ok: true, mergedCompanies, financeByYear, warnings }
}
