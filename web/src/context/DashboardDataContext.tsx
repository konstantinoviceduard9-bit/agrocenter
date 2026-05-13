import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Company } from '../data/companies'
import { companies as builtinCompanies, groupTotals } from '../data/companies'
import type { APRow, ARRow, CashRow, FinanceYearBlock } from '../data/financeMocks'
import {
  apDue7dForRows,
  arAgingTotalsForRows,
  builtinFinanceByYear,
  sumCashRows,
} from '../data/financeMocks'
import { applyDashboardSnapshot } from '../lib/applyDashboardSnapshot'
import type { YearId } from '../types/period'

export type DashboardDataSource = 'builtin' | 'file'

type Ctx = {
  companies: Company[]
  getCompany: (id: string) => Company | undefined
  groupTotals: typeof groupTotals
  getCashRows: (year: YearId) => CashRow[]
  getARRows: (year: YearId) => ARRow[]
  getAPRows: (year: YearId) => APRow[]
  sumCashMln: (year: YearId) => number
  arAgingTotals: (year: YearId) => ReturnType<typeof arAgingTotalsForRows>
  apDue7d: (year: YearId) => number
  dataSource: DashboardDataSource
  loadError: string | null
  loadWarnings: string[]
}

const DashboardDataContext = createContext<Ctx | null>(null)

const SNAPSHOT_URL = '/data/dashboard.snapshot.json'

export function DashboardDataProvider({ children }: { children: ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>(() => builtinCompanies.map((c) => ({ ...c })))
  const [financeByYear, setFinanceByYear] = useState<Record<YearId, FinanceYearBlock>>(() =>
    structuredClone(builtinFinanceByYear),
  )
  const [dataSource, setDataSource] = useState<DashboardDataSource>('builtin')
  const [loadError, setLoadError] = useState<string | null>(null)
  const [loadWarnings, setLoadWarnings] = useState<string[]>([])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(SNAPSHOT_URL, { cache: 'no-store' })
        if (res.status === 404) {
          if (!cancelled) {
            setLoadError(null)
            setLoadWarnings([])
            setDataSource('builtin')
          }
          return
        }
        if (!res.ok) {
          if (!cancelled) setLoadError(`Снимок: HTTP ${res.status}`)
          return
        }
        const json: unknown = await res.json()
        const parsed = applyDashboardSnapshot(json)
        if (!parsed.ok) {
          if (!cancelled) setLoadError(parsed.error)
          return
        }
        if (!cancelled) {
          setCompanies(parsed.mergedCompanies)
          setFinanceByYear(parsed.financeByYear)
          setDataSource('file')
          setLoadError(null)
          setLoadWarnings(parsed.warnings)
        }
      } catch (e) {
        if (!cancelled) setLoadError(e instanceof Error ? e.message : 'Не удалось загрузить снимок')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const getCompany = useCallback(
    (id: string) => companies.find((c) => c.id === id),
    [companies],
  )

  const getCashRows = useCallback(
    (year: YearId) => financeByYear[year]?.cash ?? [],
    [financeByYear],
  )
  const getARRows = useCallback(
    (year: YearId) => financeByYear[year]?.ar ?? [],
    [financeByYear],
  )
  const getAPRows = useCallback(
    (year: YearId) => financeByYear[year]?.ap ?? [],
    [financeByYear],
  )

  const sumCashMln = useCallback((year: YearId) => sumCashRows(getCashRows(year)), [getCashRows])
  const arAgingTotals = useCallback((year: YearId) => arAgingTotalsForRows(getARRows(year)), [getARRows])
  const apDue7d = useCallback((year: YearId) => apDue7dForRows(getAPRows(year)), [getAPRows])

  const value = useMemo<Ctx>(
    () => ({
      companies,
      getCompany,
      groupTotals,
      getCashRows,
      getARRows,
      getAPRows,
      sumCashMln,
      arAgingTotals,
      apDue7d,
      dataSource,
      loadError,
      loadWarnings,
    }),
    [
      companies,
      getCompany,
      getCashRows,
      getARRows,
      getAPRows,
      sumCashMln,
      arAgingTotals,
      apDue7d,
      dataSource,
      loadError,
      loadWarnings,
    ],
  )

  return <DashboardDataContext.Provider value={value}>{children}</DashboardDataContext.Provider>
}

export function useDashboardData() {
  const v = useContext(DashboardDataContext)
  if (!v) throw new Error('useDashboardData must be used within DashboardDataProvider')
  return v
}
