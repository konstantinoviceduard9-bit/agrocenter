import { WidgetCard } from '../components/WidgetCard'
import { MilkingShiftPanel } from '../components/MilkingShiftPanel'
import { PageTitle } from '../components/MatrixLayout'
import { categoryCountItems } from '../data/cowLists'
import { CountList } from '../components/CountList'

export function MilkingPage() {
  return (
    <>
      <PageTitle
        title="Дойка"
        subtitle="Сводка по последней дойке и проблемам идентификации (как в AfiFarm → вкладка «Дойка»)."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <MilkingShiftPanel />
        <WidgetCard title="Идентификация и метки">
          <CountList items={categoryCountItems('malfunctions')} />
        </WidgetCard>
      </div>
    </>
  )
}
