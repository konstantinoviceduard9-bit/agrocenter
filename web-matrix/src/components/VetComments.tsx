import { useEffect, useState } from 'react'

const STORAGE_PREFIX = 'matrix-vet-comment-'

type CommentEntry = {
  at: string
  author: string
  text: string
}

function loadHistory(cowNumber: string): CommentEntry[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${cowNumber}`)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CommentEntry[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveHistory(cowNumber: string, entries: CommentEntry[]) {
  localStorage.setItem(`${STORAGE_PREFIX}${cowNumber}`, JSON.stringify(entries))
}

export function VetComments({ cowNumber }: { cowNumber: string }) {
  const [draft, setDraft] = useState('')
  const [history, setHistory] = useState<CommentEntry[]>(() => loadHistory(cowNumber))

  useEffect(() => {
    setHistory(loadHistory(cowNumber))
    setDraft('')
  }, [cowNumber])

  const addComment = () => {
    const text = draft.trim()
    if (!text) return
    const entry: CommentEntry = {
      at: new Date().toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      author: 'Ветеринар (демо)',
      text,
    }
    const next = [entry, ...history]
    setHistory(next)
    saveHistory(cowNumber, next)
    setDraft('')
  }

  return (
    <div className="rounded border border-slate-300 bg-white">
      <header className="border-b border-blue-800/20 bg-gradient-to-r from-blue-700 to-blue-600 px-3 py-2">
        <h2 className="text-sm font-semibold text-white">Комментарии ветеринара</h2>
        <p className="text-[11px] text-blue-100/90">Сохраняются локально в браузере (демо)</p>
      </header>
      <div className="space-y-3 p-3">
        <div>
          <label htmlFor={`vet-comment-${cowNumber}`} className="text-xs font-semibold text-slate-600">
            Новый комментарий
          </label>
          <textarea
            id={`vet-comment-${cowNumber}`}
            rows={3}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Осмотр, диагноз, назначение, рекомендации…"
            className="mt-1 w-full resize-y rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
          />
          <button
            type="button"
            onClick={addComment}
            disabled={!draft.trim()}
            className="mt-2 rounded bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-40"
          >
            Сохранить комментарий
          </button>
        </div>

        {history.length > 0 ? (
          <ul className="max-h-64 space-y-2 overflow-y-auto border-t border-slate-200 pt-3">
            {history.map((c, i) => (
              <li key={`${c.at}-${i}`} className="rounded bg-slate-50 px-3 py-2 text-sm ring-1 ring-slate-200/80">
                <p className="text-xs text-slate-500">
                  {c.at} · {c.author}
                </p>
                <p className="mt-1 whitespace-pre-wrap text-slate-800">{c.text}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="border-t border-slate-200 pt-3 text-xs text-slate-500">Комментариев пока нет.</p>
        )}
      </div>
    </div>
  )
}
