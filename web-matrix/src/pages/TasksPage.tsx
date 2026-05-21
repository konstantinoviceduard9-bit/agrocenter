import { Link } from 'react-router-dom'
import { WidgetCard } from '../components/WidgetCard'
import { VetTaskQueue } from '../components/VetTaskQueue'
import { PageTitle } from '../components/MatrixLayout'

export function TasksPage() {
  return (
    <>
      <PageTitle
        title="Задачи ветслужбы"
        subtitle="Очередь из Afimilk + ранние сигналы (модули 4.1 и 4.4). Нажмите на корову — карточка, лечение и комментарии, как в списках по категориям."
      />

      <WidgetCard title="На сегодня" footer="Статус задачи сохраняется в браузере (демо)">
        <VetTaskQueue />
      </WidgetCard>

      <p className="mt-3 text-xs text-slate-600">
        Все задачи также доступны из сводки:{' '}
        <Link to="/" className="font-medium text-blue-700 hover:underline">
          пульт «Сегодня»
        </Link>
        {' · '}
        <Link to="/animals/mastitis" className="font-medium text-blue-700 hover:underline">
          мастит
        </Link>
      </p>
    </>
  )
}
