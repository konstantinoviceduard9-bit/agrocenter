import { useContext } from 'react'
import { MatrixStaffAuthContext, type StaffAuthContextValue } from '../context/matrixStaffAuth'

export function useStaffAuth(): StaffAuthContextValue {
  const ctx = useContext(MatrixStaffAuthContext)
  if (!ctx) throw new Error('useStaffAuth must be used within StaffAuthProvider')
  return ctx
}
