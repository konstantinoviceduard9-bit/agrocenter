import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { MatrixLayout } from './components/MatrixLayout'
import { TodayPage } from './pages/TodayPage'
import { MilkingPage } from './pages/MilkingPage'
import { FeedingPage } from './pages/FeedingPage'
import { TasksPage } from './pages/TasksPage'
import { MachinesPage } from './pages/MachinesPage'
import { BarnAssignmentPage } from './pages/BarnAssignmentPage'
import { CowListPage } from './pages/CowListPage'
import { CowDetailPage } from './pages/CowDetailPage'

const routerBasename =
  import.meta.env.BASE_URL === '/' ? undefined : import.meta.env.BASE_URL.replace(/\/$/, '')

export default function App() {
  return (
    <BrowserRouter basename={routerBasename}>
      <Routes>
        <Route element={<MatrixLayout />}>
          <Route index element={<TodayPage />} />
          <Route path="milking" element={<MilkingPage />} />
          <Route path="feeding" element={<FeedingPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="barn-assignment" element={<BarnAssignmentPage />} />
          <Route path="machines" element={<MachinesPage />} />
          <Route path="animals/:categoryId/cow/:cowNumber" element={<CowDetailPage />} />
          <Route path="animals/:categoryId" element={<CowListPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
