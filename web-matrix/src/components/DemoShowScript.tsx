const steps = [
  { n: 1, title: 'Пульт «Сегодня»', text: 'Молоко, стадо, здоровье — единая картина смены (как в презентации AI/автоматизация).' },
  { n: 2, title: 'Сотрудники и отчёты', text: 'Назначить задачу доярке → на телефоне «Мои задачи» → выполнение попадает в журнал.' },
  { n: 3, title: 'Ветслужба и коровники', text: 'Очередь Afimilk, разделение телят Т-30/Т-35, подпись «сдал / принял».' },
  { n: 4, title: 'Связь с финансами', text: 'Ссылка «Финансы группы» — дашборд выручки и юрлиц (отдельное приложение).' },
]

export function DemoShowScript() {
  return (
    <details className="mb-4 rounded-xl border border-emerald-200 bg-white shadow-sm">
      <summary className="cursor-pointer list-none px-4 py-3 text-sm font-bold text-emerald-900 [&::-webkit-details-marker]:hidden">
        Сценарий показа · ~5 минут
        <span className="ml-2 text-xs font-normal text-emerald-700">(развернуть)</span>
      </summary>
      <ol className="space-y-3 border-t border-emerald-100 px-4 py-3 text-sm">
        {steps.map((s) => (
          <li key={s.n} className="flex gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">
              {s.n}
            </span>
            <div>
              <p className="font-semibold text-slate-900">{s.title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-600">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </details>
  )
}
