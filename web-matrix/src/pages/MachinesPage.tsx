import { PageTitle } from '../components/MatrixLayout'
import { AxentaMonitoring } from '../components/AxentaMonitoring'

export function MachinesPage() {
  return (
    <>
      <PageTitle
        title="Машины · Аксента"
        subtitle="Мониторинг техники в стиле Axenta: список объектов, поиск, карта с маркерами (демо)."
      />
      <AxentaMonitoring />
    </>
  )
}
