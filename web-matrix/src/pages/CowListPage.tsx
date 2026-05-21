import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PageTitle } from '../components/MatrixLayout'
import {
  COW_LIST_PAGE_SIZE,
  getCategoryById,
  getCowsForCategory,
  type CowRecord,
} from '../data/cowLists'
import { fmtDec, fmtInt } from '../lib/format'

const sectionBack: Record<string, { label: string; to: string }> = {
  health: { label: 'Сводка · Здоровье', to: '/' },
  today: { label: 'Сводка · Выполнить сегодня', to: '/' },
  reproduction: { label: 'Сводка', to: '/' },
  groups: { label: 'Сводка', to: '/' },
  malfunctions: { label: 'Сводка · Неисправности', to: '/' },
  herd: { label: 'Сводка · Стадо', to: '/' },
}

function CowTable({ rows }: { rows: CowRecord[] }) {
  return (
    <div className="overflow-x-auto rounded border border-slate-300 bg-white">
      <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-300 bg-slate-100 text-xs text-slate-600">
            <th className="px-3 py-2 font-semibold">№ коровы</th>
            <th className="px-3 py-2 font-semibold">Коровник</th>
            <th className="px-3 py-2 font-semibold">Группа</th>
            <th className="px-3 py-2 text-right font-semibold">Лактация</th>
            <th className="px-3 py-2 text-right font-semibold">DIM</th>
            <th className="px-3 py-2 text-right font-semibold">Надой, л</th>
            <th className="px-3 py-2 font-semibold">Примечание</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.number}-${row.barn}`} className="border-b border-slate-100 hover:bg-blue-50/50">
              <td className="px-3 py-2 font-semibold tabular-nums text-blue-900">{row.number}</td>
              <td className="px-3 py-2 text-slate-800">{row.barn}</td>
              <td className="px-3 py-2 text-slate-700">{row.group}</td>
              <td className="px-3 py-2 text-right tabular-nums">{row.lactation}</td>
              <td className="px-3 py-2 text-right tabular-nums text-slate-600">
                {row.daysInMilk == null ? '—' : fmtInt(row.daysInMilk)}
              </td>
              <td className="px-3 py-2 text-right tabular-nums text-slate-800">
                {row.yieldLiters == null ? '—' : fmtDec(row.yieldLiters, 1)}
              </td>
              <td className="px-3 py-2 text-xs text-slate-600">{row.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function CowListPage() {
  const { categoryId } = useParams<{ categoryId: string }>()
  const category = getCategoryById(categoryId)
  const allCows = useMemo(() => (categoryId ? getCowsForCategory(categoryId) : []), [categoryId])
  const [page, setPage] = useState(0)

  useEffect(() => {
    setPage(0)
  }, [categoryId])

  if (!category) {
    return (
      <div>
        <p className="text-slate-600">Категория не найдена.</p>
        <Link to="/" className="mt-3 inline-block text-blue-700 hover:underline">
          На сводку
        </Link>
      </div>
    )
  }

  const totalPages = Math.max(1, Math.ceil(allCows.length / COW_LIST_PAGE_SIZE))
  const safePage = Math.min(page, totalPages - 1)
  const slice = allCows.slice(safePage * COW_LIST_PAGE_SIZE, (safePage + 1) * COW_LIST_PAGE_SIZE)
  const back = sectionBack[category.section] ?? { label: 'Сводка', to: '/' }

  return (
    <>
      <nav className="mb-3 text-sm">
        <Link to={back.to} className="font-medium text-blue-700 hover:underline">
          ← {back.label}
        </Link>
      </nav>

      <PageTitle
        title={category.label}
        subtitle={
          <>
            {fmtInt(category.count)} голов · источник: <strong>{category.source}</strong>
            {category.hint ? <> · {category.hint}</> : null}
          </>
        }
      />

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-600">
        <span>
          Показано {slice.length} из {fmtInt(allCows.length)}
          {allCows.length > COW_LIST_PAGE_SIZE ? ` (страница ${safePage + 1} из ${totalPages})` : null}
        </span>
        <span className="rounded bg-amber-50 px-2 py-1 text-xs text-amber-900 ring-1 ring-amber-200">
          Демо-список · в проде из Afimilk API
        </span>
      </div>

      <CowTable rows={slice} />

      {totalPages > 1 ? (
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={safePage === 0}
            className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium disabled:opacity-40"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            Назад
          </button>
          <span className="text-sm tabular-nums text-slate-600">
            {safePage + 1} / {totalPages}
          </span>
          <button
            type="button"
            disabled={safePage >= totalPages - 1}
            className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium disabled:opacity-40"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          >
            Вперёд
          </button>
        </div>
      ) : null}
    </>
  )
}
