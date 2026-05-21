import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { WidgetCard } from '../components/WidgetCard'
import { VetComments } from '../components/VetComments'
import { VetTreatments } from '../components/VetTreatments'
import { PageTitle } from '../components/MatrixLayout'
import { buildCowDetail } from '../data/cowDetail'
import { animalListPath, getCategoryById } from '../data/cowLists'
import { fmtDec, fmtInt, fmtPct } from '../lib/format'

function DlGrid({ rows }: { rows: { term: string; value: string }[] }) {
  return (
    <dl className="grid gap-x-4 gap-y-2 text-sm sm:grid-cols-2">
      {rows.map((r) => (
        <div key={r.term} className="flex justify-between gap-2 border-b border-slate-100 pb-1.5 sm:block">
          <dt className="text-slate-500">{r.term}</dt>
          <dd className="font-medium text-slate-900 sm:text-right">{r.value}</dd>
        </div>
      ))}
    </dl>
  )
}

function KpiTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-0.5 text-lg font-bold tabular-nums text-slate-900">{value}</p>
    </div>
  )
}

export function CowDetailPage() {
  const { categoryId, cowNumber } = useParams<{ categoryId: string; cowNumber: string }>()
  const detail = useMemo(
    () => (categoryId && cowNumber ? buildCowDetail(categoryId, cowNumber) : null),
    [categoryId, cowNumber],
  )
  const category = getCategoryById(categoryId)

  if (!detail || !categoryId || !cowNumber) {
    return (
      <div>
        <p className="text-slate-600">Корова не найдена.</p>
        <Link to="/" className="mt-3 inline-block text-blue-700 hover:underline">
          На сводку
        </Link>
      </div>
    )
  }

  const { summary: s } = detail

  return (
    <>
      <nav className="mb-3 flex flex-wrap gap-x-3 gap-y-1 text-sm">
        <Link to="/" className="text-blue-700 hover:underline">
          ← Сводка
        </Link>
        <span className="text-slate-400">/</span>
        <Link to={animalListPath(categoryId)} className="text-blue-700 hover:underline">
          {category?.label ?? 'Список'}
        </Link>
        <span className="text-slate-400">/</span>
        <span className="font-semibold text-slate-800">№ {cowNumber}</span>
      </nav>

      <PageTitle
        title={`Корова № ${cowNumber}`}
        subtitle={
          <>
            {s.barn} · {s.group} · {detail.categoryLabel}
            {!detail.rfidOk ? (
              <span className="ml-2 rounded bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-800">
                Метка неисправна
              </span>
            ) : null}
          </>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
        <KpiTile label="Надой сегодня" value={`${fmtDec(detail.yieldTodayLiters, 1)} л`} />
        <KpiTile label="Средний 7 дней" value={`${fmtDec(detail.yield7dAvgLiters, 1)} л`} />
        <KpiTile label="305 дней" value={`${fmtInt(detail.yield305dLiters)} л`} />
        <KpiTile label="Жир / белок" value={`${fmtPct(detail.fatPct)} / ${fmtPct(detail.proteinPct)}`} />
        <KpiTile label="Соматика" value={`${fmtInt(detail.somaticCells)} тыс`} />
        <KpiTile label="Проводимость" value={fmtDec(detail.conductivity, 1)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <WidgetCard title="Идентификация и стадо" className="lg:col-span-4">
          <DlGrid
            rows={[
              { term: 'Метка / RFID', value: detail.earTag },
              { term: 'Порода', value: detail.breed },
              { term: 'Дата рождения', value: detail.birthDate },
              { term: 'Отец', value: detail.sire },
              { term: 'Мать', value: detail.dam },
              { term: 'Лактация', value: String(s.lactation) },
              { term: 'DIM', value: s.daysInMilk == null ? '—' : fmtInt(s.daysInMilk) },
              { term: 'Статус', value: detail.healthStatus },
            ]}
          />
        </WidgetCard>

        <WidgetCard title="Отёл и воспроизводство" className="lg:col-span-4">
          <DlGrid
            rows={[
              { term: 'Дата отёла', value: detail.calvingDate },
              { term: 'Лёгкость отёла', value: detail.calvingEase },
              { term: 'Телёнок', value: `${detail.calfSex}, ${detail.calfWeightKg} кг` },
              { term: 'Молозиво, л', value: fmtDec(detail.colostrumLiters, 1) },
              { term: 'Статус стельности', value: detail.pregnancyStatus },
              { term: 'Дней открытой', value: fmtInt(detail.daysOpen) },
              { term: 'Последнее осеменение', value: detail.lastInsemination },
              { term: 'Бык', value: detail.inseminationBull },
              {
                term: 'Ожидаемый отёл',
                value: detail.expectedCalving ?? '—',
              },
            ]}
          />
        </WidgetCard>

        <WidgetCard title="Активность и поведение" className="lg:col-span-4">
          <DlGrid
            rows={[
              { term: 'Индекс активности', value: fmtInt(detail.activityIndex) },
              { term: 'Лежит, % суток', value: `${fmtInt(detail.lyingPct)}%` },
              { term: 'Руминация, мин/сут', value: fmtInt(detail.ruminationMin) },
              { term: 'Шаги / час', value: fmtInt(detail.stepsPerHour) },
              { term: 'Последняя дойка', value: detail.lastMilking },
              { term: 'Доений сегодня', value: fmtInt(detail.milkingsToday) },
            ]}
          />
        </WidgetCard>

        <WidgetCard title="Кормление (DTM)" className="lg:col-span-4">
          <DlGrid
            rows={[
              { term: 'Кормогруппа', value: detail.feedGroup },
              { term: 'Рецепт', value: detail.rationName },
              { term: 'СВ по рациону, кг', value: fmtDec(detail.dmiKg, 1) },
              { term: 'Остатки на столе, кг', value: fmtDec(detail.refusalsKg, 1) },
            ]}
          />
        </WidgetCard>

        <WidgetCard title="Сигналы и примечания Afimilk" className="lg:col-span-4">
          <ul className="mb-3 space-y-1">
            {detail.activeAlerts.map((a) => (
              <li key={a} className="rounded bg-amber-50 px-2 py-1 text-sm text-amber-950 ring-1 ring-amber-200/80">
                {a}
              </li>
            ))}
          </ul>
          <ul className="space-y-1 text-xs text-slate-600">
            {detail.systemNotes.map((n) => (
              <li key={n}>· {n}</li>
            ))}
            <li>· {s.note}</li>
          </ul>
        </WidgetCard>

        <div className="lg:col-span-4">
          <VetComments cowNumber={cowNumber} />
        </div>

        <VetTreatments
          cowNumber={cowNumber}
          defaultReason={detail.categoryLabel}
          demoTreatments={detail.treatments}
        />

        <WidgetCard title="Надой по дням (14 дней)" className="lg:col-span-12">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[48rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-300 bg-slate-100 text-xs text-slate-600">
                  <th className="px-2 py-2 font-semibold">Дата</th>
                  <th className="px-2 py-2 text-right font-semibold">Надой, л</th>
                  <th className="px-2 py-2 text-right font-semibold">Жир %</th>
                  <th className="px-2 py-2 text-right font-semibold">Белок %</th>
                  <th className="px-2 py-2 text-right font-semibold">Проводимость</th>
                </tr>
              </thead>
              <tbody>
                {detail.milkHistory.map((row) => (
                  <tr key={row.date} className="border-b border-slate-100 hover:bg-blue-50/40">
                    <td className="px-2 py-1.5">{row.date}</td>
                    <td className="px-2 py-1.5 text-right font-semibold tabular-nums">{fmtDec(row.liters, 1)}</td>
                    <td className="px-2 py-1.5 text-right tabular-nums">{fmtPct(row.fatPct)}</td>
                    <td className="px-2 py-1.5 text-right tabular-nums">{fmtPct(row.proteinPct)}</td>
                    <td className="px-2 py-1.5 text-right tabular-nums">{fmtDec(row.conductivity, 1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </WidgetCard>
      </div>

      <p className="mt-4 text-xs text-slate-500">
        Демо-карточка · в проде данные из Afimilk, DTM, дойки.{' '}
        <Link to={animalListPath(categoryId)} className="text-blue-700 hover:underline">
          Вернуться к списку
        </Link>
      </p>
    </>
  )
}
