import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { staffMembers } from '../data/staff'
import { hasFullFarmAccess } from '../lib/staffRoleAccess'
import { MatrixStaffAuthContext, type StaffAuthContextValue } from './matrixStaffAuth'

const SESSION_KEY = 'matrix-staff-session-v1'

type Session = { employeeId: string }

function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const s = JSON.parse(raw) as Session
    if (!staffMembers.some((m) => m.id === s.employeeId && m.active)) return null
    return s
  } catch {
    return null
  }
}

export function StaffAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(loadSession)

  const employee = useMemo(
    () => (session ? staffMembers.find((m) => m.id === session.employeeId) ?? null : null),
    [session],
  )

  const login = useCallback((pin: string, employeeId?: string) => {
    const normalized = pin.replace(/\D/g, '').trim()
    if (!normalized) {
      return { ok: false as const, message: 'Введите PIN' }
    }
    let match: (typeof staffMembers)[number] | undefined
    if (employeeId) {
      match = staffMembers.find(
        (m) => m.id === employeeId && m.pin === normalized && m.active && m.hasAppAccess,
      )
    } else {
      const matches = staffMembers.filter((m) => m.pin === normalized && m.active && m.hasAppAccess)
      if (matches.length > 1) {
        return { ok: false as const, message: 'Общий PIN — выберите себя в списке ниже' }
      }
      match = matches[0]
    }
    if (!match) {
      return { ok: false as const, message: 'Неверный PIN или нет доступа к приложению' }
    }
    const next = { employeeId: match.id }
    localStorage.setItem(SESSION_KEY, JSON.stringify(next))
    setSession(next)
    return { ok: true as const }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY)
    setSession(null)
  }, [])

  const value = useMemo<StaffAuthContextValue>(
    () => ({
      employee,
      isLoggedIn: employee != null,
      isRestricted: employee != null && !hasFullFarmAccess(employee.roleId),
      login,
      logout,
    }),
    [employee, login, logout],
  )

  return <MatrixStaffAuthContext.Provider value={value}>{children}</MatrixStaffAuthContext.Provider>
}
