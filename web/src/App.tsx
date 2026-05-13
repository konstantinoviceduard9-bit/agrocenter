import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { DashboardFiltersProvider } from './context/DashboardFiltersContext'
import { DashboardDataProvider } from './context/DashboardDataContext'
import { Layout } from './components/Layout'
import { GroupOverview } from './pages/GroupOverview'
import { CompanyPage } from './pages/CompanyPage'
import { LoginPage } from './pages/LoginPage'
import { CashPage } from './pages/CashPage'
import { DebtorsPage } from './pages/DebtorsPage'
import { CreditorsPage } from './pages/CreditorsPage'
import { AlertsPage } from './pages/AlertsPage'
import { AdminSettingsPage } from './pages/AdminSettingsPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DashboardFiltersProvider>
          <DashboardDataProvider>
            <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<Layout />}>
              <Route index element={<GroupOverview />} />
              <Route path="finance/cash" element={<CashPage />} />
              <Route path="finance/debtors" element={<DebtorsPage />} />
              <Route path="finance/creditors" element={<CreditorsPage />} />
              <Route path="operations/alerts" element={<AlertsPage />} />
              <Route path="admin/settings" element={<AdminSettingsPage />} />
              <Route path="company/:companyId" element={<CompanyPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </DashboardDataProvider>
        </DashboardFiltersProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
