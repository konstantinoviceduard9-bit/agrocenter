import { PageShell } from '../components/PageShell'

export function AdminSettingsPage() {
  return (
    <>
      <PageShell
        title="Администрирование"
        subtitle="Справочники, доступы, allowlist для мессенджеров — заготовка под прод."
      />
      <div className="space-y-6 px-6 py-8 lg:px-10">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900">Данные без API (снимок JSON)</h3>
          <p className="mt-2 text-sm text-slate-600">
            Файл <code className="rounded bg-slate-100 px-1">web/public/data/dashboard.snapshot.json</code> подгружается
            при старте приложения и <strong>накладывается</strong> на встроенный справочник компаний и моки финансов за 2024–2025.
            Удалите файл или верните пустой объект <code className="rounded bg-slate-100 px-1">{}</code>, чтобы снова были только моки из кода
            (в dev при отсутствии файла будет 404 — тоже ок, останутся моки).
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
            <li>
              <code className="rounded bg-slate-100 px-1">companies[]</code> — только существующие <code className="rounded bg-slate-100 px-1">id</code> из
              справочника; поля частичные, как в TypeScript <code className="rounded bg-slate-100 px-1">Partial&lt;Company&gt;</code>.
            </li>
            <li>
              <code className="rounded bg-slate-100 px-1">finance.2024|2025.cash|ar|ap</code> — если секция указана, она <strong>целиком</strong> заменяет
              мок за этот год (не merge по строкам).
            </li>
          </ul>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900">Мессенджеры (TG / MAX)</h3>
          <p className="mt-2 text-sm text-slate-600">
            Таблица сопоставления: сотрудник ↔ Telegram user id ↔ MAX id ↔ доступные юрлица. Сейчас — в документации проекта (`docs/integraciya-telegram-i-max.md`).
          </p>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900">Интеграции</h3>
          <p className="mt-2 text-sm text-slate-600">URL 1С, расписание выгрузок, секреты (только на сервере после появления API).</p>
        </section>
      </div>
    </>
  )
}
