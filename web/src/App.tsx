import { lazy, Suspense, type ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { DashboardFiltersProvider } from './context/DashboardFiltersContext'
import { DashboardDataProvider } from './context/DashboardDataContext'
import { Layout } from './components/Layout'
import { PageFallback } from './components/PageFallback'
import { companies } from './data/companies'

const LoginPage = lazy(() => import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })))
const GroupOverview = lazy(() => import('./pages/GroupOverview').then((m) => ({ default: m.GroupOverview })))
const CompanyPage = lazy(() => import('./pages/CompanyPage').then((m) => ({ default: m.CompanyPage })))
const CashPage = lazy(() => import('./pages/CashPage').then((m) => ({ default: m.CashPage })))
const DebtorsPage = lazy(() => import('./pages/DebtorsPage').then((m) => ({ default: m.DebtorsPage })))
const CreditorsPage = lazy(() => import('./pages/CreditorsPage').then((m) => ({ default: m.CreditorsPage })))
const AlertsPage = lazy(() => import('./pages/AlertsPage').then((m) => ({ default: m.AlertsPage })))
const AdminSettingsPage = lazy(() =>
  import('./pages/AdminSettingsPage').then((m) => ({ default: m.AdminSettingsPage })),
)

const routerBasename =
  import.meta.env.BASE_URL === '/' ? undefined : import.meta.env.BASE_URL.replace(/\/$/, '')

function Lazy({ children }: { children: ReactNode }) {
  return <Suspense fallback={<PageFallback />}>{children}</Suspense>
}

export default function App() {
  return (
    <BrowserRouter basename={routerBasename}>
      <AuthProvider>
        <DashboardFiltersProvider>
          <DashboardDataProvider>
            <Routes>
              <Route
                path="/login"
                element={
                  <Lazy>
                    <LoginPage />
                  </Lazy>
                }
              />
              {companies.map((c) => (
                <Route
                  key={`legacy-company-${c.id}`}
                  path={c.id}
                  element={<Navigate to={`/company/${c.id}`} replace />}
                />
              ))}
              <Route element={<Layout />}>
                <Route
                  index
                  element={
                    <Lazy>
                      <GroupOverview />
                    </Lazy>
                  }
                />
                <Route
                  path="finance/cash"
                  element={
                    <Lazy>
                      <CashPage />
                    </Lazy>
                  }
                />
                <Route
                  path="finance/debtors"
                  element={
                    <Lazy>
                      <DebtorsPage />
                    </Lazy>
                  }
                />
                <Route
                  path="finance/creditors"
                  element={
                    <Lazy>
                      <CreditorsPage />
                    </Lazy>
                  }
                />
                <Route
                  path="operations/alerts"
                  element={
                    <Lazy>
                      <AlertsPage />
                    </Lazy>
                  }
                />
                <Route
                  path="admin/settings"
                  element={
                    <Lazy>
                      <AdminSettingsPage />
                    </Lazy>
                  }
                />
                <Route
                  path="company/:companyId"
                  element={
                    <Lazy>
                      <CompanyPage />
                    </Lazy>
                  }
                />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </DashboardDataProvider>
        </DashboardFiltersProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
