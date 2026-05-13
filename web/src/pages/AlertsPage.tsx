import { PageShell } from '../components/PageShell'

export function AlertsPage() {
  return (
    <>
      <PageShell
        title="Алерты и пороги"
        subtitle="Заготовка под раздел плана: пороговые сигналы, расписание, доставка в Telegram / MAX."
      />
      <div className="space-y-4 px-6 py-8 lg:px-10">
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>Правила вида «дебиторка 61+ &gt; X млн → уведомление».</li>
          <li>Подписка ролей: финдиректор, гендиректор, ответственный по юрлицу.</li>
          <li>Журнал срабатываний и подтверждение «прочитано».</li>
        </ul>
        <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Реализация после появления <code className="rounded bg-white px-1">api/</code> и стабильных метрик.
        </p>
      </div>
    </>
  )
}
