import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { WorkReportsPanel } from '../components/WorkReportsPanel'
import { PageTitle } from '../components/MatrixLayout'
import { useStaffAuth } from '../hooks/useStaffAuth'
import { hasFullFarmAccess } from '../lib/staffRoleAccess'

/** Только для сотрудников без раздела «Сотрудники»; руководство → /staff#reports */
export function WorkReportsPage() {
  const { employee } = useStaffAuth()
  const navigate = useNavigate()
  const isManager = !employee || hasFullFarmAccess(employee.roleId)

  useEffect(() => {
    if (isManager) navigate('/staff#reports', { replace: true })
  }, [isManager, navigate])

  if (isManager) return null

  return (
    <>
      <PageTitle title="Мои отчёты по работам" subtitle="Выполненные задачи и работы по вашей роли." />
      <WorkReportsPanel />
      <p className="mt-4 text-xs text-slate-600">
        <Link to="/my-tasks" className="font-medium text-blue-700 hover:underline">
          Мои задачи
        </Link>
      </p>
    </>
  )
}
