import { createContext } from 'react'
import type { StaffMember } from '../data/staff'

export type StaffAuthContextValue = {
  employee: StaffMember | null
  isLoggedIn: boolean
  isRestricted: boolean
  login: (pin: string, employeeId?: string) => { ok: true } | { ok: false; message: string }
  logout: () => void
}

export const MatrixStaffAuthContext = createContext<StaffAuthContextValue | null>(null)
