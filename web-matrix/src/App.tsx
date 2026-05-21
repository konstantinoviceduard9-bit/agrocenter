import { lazy, Suspense, type ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { MatrixLayout } from './components/MatrixLayout'
import { PageFallback } from './components/PageFallback'

const TodayPage = lazy(() => import('./pages/TodayPage').then((m) => ({ default: m.TodayPage })))
const MilkingPage = lazy(() => import('./pages/MilkingPage').then((m) => ({ default: m.MilkingPage })))
const FeedingPage = lazy(() => import('./pages/FeedingPage').then((m) => ({ default: m.FeedingPage })))
const TasksPage = lazy(() => import('./pages/TasksPage').then((m) => ({ default: m.TasksPage })))
const MachinesPage = lazy(() => import('./pages/MachinesPage').then((m) => ({ default: m.MachinesPage })))
const BarnAssignmentPage = lazy(() =>
  import('./pages/BarnAssignmentPage').then((m) => ({ default: m.BarnAssignmentPage })),
)
const CowListPage = lazy(() => import('./pages/CowListPage').then((m) => ({ default: m.CowListPage })))
const CowDetailPage = lazy(() => import('./pages/CowDetailPage').then((m) => ({ default: m.CowDetailPage })))

const routerBasename =
  import.meta.env.BASE_URL === '/' ? undefined : import.meta.env.BASE_URL.replace(/\/$/, '')

function Lazy({ children }: { children: ReactNode }) {
  return <Suspense fallback={<PageFallback />}>{children}</Suspense>
}

export default function App() {
  return (
    <BrowserRouter basename={routerBasename}>
      <Routes>
        <Route element={<MatrixLayout />}>
          <Route
            index
            element={
              <Lazy>
                <TodayPage />
              </Lazy>
            }
          />
          <Route
            path="milking"
            element={
              <Lazy>
                <MilkingPage />
              </Lazy>
            }
          />
          <Route
            path="feeding"
            element={
              <Lazy>
                <FeedingPage />
              </Lazy>
            }
          />
          <Route
            path="tasks"
            element={
              <Lazy>
                <TasksPage />
              </Lazy>
            }
          />
          <Route
            path="barn-assignment"
            element={
              <Lazy>
                <BarnAssignmentPage />
              </Lazy>
            }
          />
          <Route
            path="machines"
            element={
              <Lazy>
                <MachinesPage />
              </Lazy>
            }
          />
          <Route
            path="animals/:categoryId/cow/:cowNumber"
            element={
              <Lazy>
                <CowDetailPage />
              </Lazy>
            }
          />
          <Route
            path="animals/:categoryId"
            element={
              <Lazy>
                <CowListPage />
              </Lazy>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
