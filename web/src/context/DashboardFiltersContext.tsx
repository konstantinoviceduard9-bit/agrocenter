import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { QuarterId, YearId } from '../types/period'

type Ctx = {
  year: YearId
  quarter: QuarterId
  setYear: (y: YearId) => void
  setQuarter: (q: QuarterId) => void
  periodLabel: string
}

const DashboardFiltersContext = createContext<Ctx | null>(null)

export function DashboardFiltersProvider({ children }: { children: ReactNode }) {
  const [year, setYearState] = useState<YearId>('2025')
  const [quarter, setQuarterState] = useState<QuarterId>('all')

  const setYear = useCallback((y: YearId) => setYearState(y), [])
  const setQuarter = useCallback((q: QuarterId) => setQuarterState(q), [])

  const periodLabel = useMemo(() => {
    if (quarter === 'all') return `Год ${year}`
    return `${quarter} ${year}`
  }, [year, quarter])

  const value = useMemo(
    () => ({
      year,
      quarter,
      setYear,
      setQuarter,
      periodLabel,
    }),
    [year, quarter, setYear, setQuarter, periodLabel],
  )

  return <DashboardFiltersContext.Provider value={value}>{children}</DashboardFiltersContext.Provider>
}

export function useDashboardFilters() {
  const v = useContext(DashboardFiltersContext)
  if (!v) throw new Error('useDashboardFilters must be used within DashboardFiltersProvider')
  return v
}
