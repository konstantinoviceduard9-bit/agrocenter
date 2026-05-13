import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

export type DemoRole = 'group_admin' | 'company_viewer'

export type AuthUser = {
  displayName: string
  role: DemoRole
}

type Ctx = {
  user: AuthUser | null
  login: (displayName: string, role: DemoRole) => void
  logout: () => void
}

const AuthContext = createContext<Ctx | null>(null)

const STORAGE_KEY = 'neral_dashboard_demo_user'

function readStored(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() =>
    typeof localStorage === 'undefined' ? null : readStored(),
  )

  const login = useCallback((displayName: string, role: DemoRole) => {
    const u: AuthUser = { displayName, role }
    setUser(u)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const v = useContext(AuthContext)
  if (!v) throw new Error('useAuth must be used within AuthProvider')
  return v
}
