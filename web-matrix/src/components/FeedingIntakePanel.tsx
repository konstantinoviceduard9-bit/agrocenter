import { useCallback, useRef, useState } from 'react'
import { WidgetCard } from './WidgetCard'
import {
  agroplemCsvTemplate,
  amtsCsvTemplate,
  demoOcrAgroplem,
  demoOcrAmts,
  parseAgroplemCsv,
  parseAmtsCsv,
  simulateOcrDelay,
  type ExtractedAmtsRow,
  type ExtractedLabRow,
  type IntakeMode,
  type PhotoDocType,
} from '../data/feedingIntake'
import type { AmtsIngredient, LabIndicator } from '../data/feedingPipeline'

function stripLabConfidence(rows: ExtractedLabRow[]): LabIndicator[] {
  return rows.map(({ name, unit, result, min, max, inRange }) => ({ name, unit, result, min, max, inRange }))
}

function stripAmtsConfidence(rows: ExtractedAmtsRow[]): AmtsIngredient[] {
  return rows.map(({ name, dmPct, dmKgDay, asFedKgDay }) => ({ name, dmPct, dmKgDay, asFedKgDay }))
}

type Props = {
  mode: IntakeMode
  onModeChange: (m: IntakeMode) => void
  onApplyLab: (rows: LabIndicator[]) => void
  onApplyAmts: (rows: AmtsIngredient[]) => void
  lastApplied: string | null
}

function confidenceBadge(c: number) {
  const pct = Math.round(c * 100)
  const cls =
    pct >= 90 ? 'bg-emerald-100 text-emerald-900' : pct >= 80 ? 'bg-amber-100 text-amber-900' : 'bg-red-100 text-red-900'
  return (
    <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${cls}`} title="Уверенность OCR">
      {pct}%
    </span>
  )
}

export function FeedingIntakePanel({ mode, onModeChange, onApplyLab, onApplyAmts, lastApplied }: Props) {
  const [docType, setDocType] = useState<PhotoDocType>('agroplem')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [ocrStatus, setOcrStatus] = useState<'idle' | 'scanning' | 'done' | 'error'>('idle')
  const [labDraft, setLabDraft] = useState<ExtractedLabRow[] | null>(null)
  const [amtsDraft, setAmtsDraft] = useState<ExtractedAmtsRow[] | null>(null)
  const [digitalMsg, setDigitalMsg] = useState<string | null>(null)
  const cameraRef = useRef<HTMLInputElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const clearPreview = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setFileName(null)
    setOcrStatus('idle')
    setLabDraft(null)
    setAmtsDraft(null)
  }, [previewUrl])

  const onPhotoSelected = (file: File | null) => {
    clearPreview()
    if (!file || !file.type.startsWith('image/')) return
    setPreviewUrl(URL.createObjectURL(file))
    setFileName(file.name)
    setOcrStatus('idle')
  }

  const runOcr = async () => {
    if (!previewUrl) return
    setOcrStatus('scanning')
    try {
      await simulateOcrDelay()
      if (docType === 'agroplem') {
        setLabDraft(demoOcrAgroplem())
        setAmtsDraft(null)
      } else {
        setAmtsDraft(demoOcrAmts())
        setLabDraft(null)
      }
      setOcrStatus('done')
    } catch {
      setOcrStatus('error')
    }
  }

  const applyPhoto = () => {
    if (labDraft) {
      onApplyLab(stripLabConfidence(labDraft))
      setDigitalMsg(`Агроплем с фото применён · ${new Date().toLocaleString('ru-RU')}`)
    }
    if (amtsDraft) {
      onApplyAmts(stripAmtsConfidence(amtsDraft))
      setDigitalMsg(`AMTS с фото применён · ${new Date().toLocaleString('ru-RU')}`)
    }
    clearPreview()
  }

  const handleDigitalFile = async (kind: 'agroplem' | 'amts', file: File | null) => {
    if (!file) return
    const text = await file.text()
    if (kind === 'agroplem') {
      const parsed = parseAgroplemCsv(text)
      if (parsed) {
        onApplyLab(stripLabConfidence(parsed))
        setDigitalMsg(`Файл ${file.name}: ${parsed.length} показателей`)
      } else {
        onApplyLab(stripLabConfidence(demoOcrAgroplem()))
        setDigitalMsg(`Файл ${file.name} принят (демо-данные Агроплем)`)
      }
    } else {
      const parsed = parseAmtsCsv(text)
      if (parsed) {
        onApplyAmts(stripAmtsConfidence(parsed))
        setDigitalMsg(`Файл ${file.name}: ${parsed.length} ингредиентов`)
      } else {
        onApplyAmts(stripAmtsConfidence(demoOcrAmts()))
        setDigitalMsg(`Файл ${file.name} принят (демо-данные AMTS)`)
      }
    }
  }

  const downloadTemplate = (name: string, content: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = name
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <WidgetCard title="Загрузка данных">
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onModeChange('digital')}
          className={[
            'rounded-lg px-4 py-2 text-sm font-semibold',
            mode === 'digital' ? 'bg-blue-700 text-white' : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
          ].join(' ')}
        >
          1 · Цифровая загрузка
        </button>
        <button
          type="button"
          onClick={() => onModeChange('photo')}
          className={[
            'rounded-lg px-4 py-2 text-sm font-semibold',
            mode === 'photo' ? 'bg-blue-700 text-white' : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
          ].join(' ')}
        >
          2 · Фото с планшета
        </button>
      </div>

      {lastApplied || digitalMsg ? (
        <p className="mb-3 rounded bg-emerald-50 px-3 py-2 text-xs text-emerald-900">
          {digitalMsg ?? lastApplied}
        </p>
      ) : null}

      {mode === 'digital' ? (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50/80 p-4">
            <p className="text-sm font-semibold text-slate-800">Агроплем (CSV / XML)</p>
            <p className="mt-1 text-xs text-slate-600">Файл из лаборатории или выгрузка по почте — без ручного ввода в таблицу.</p>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,.xml,.txt,text/csv"
              className="mt-3 w-full text-xs"
              onChange={(e) => handleDigitalFile('agroplem', e.target.files?.[0] ?? null)}
            />
            <button
              type="button"
              className="mt-2 text-xs font-medium text-blue-700 hover:underline"
              onClick={() => downloadTemplate('agroplem-template.csv', agroplemCsvTemplate)}
            >
              Скачать шаблон CSV
            </button>
          </div>
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50/80 p-4">
            <p className="text-sm font-semibold text-slate-800">AMTS / Koudijs (CSV)</p>
            <p className="mt-1 text-xs text-slate-600">Экспорт рациона «скормлен» — кг СВ и как скормлено.</p>
            <input
              type="file"
              accept=".csv,.xml,.txt,text/csv"
              className="mt-3 w-full text-xs"
              onChange={(e) => handleDigitalFile('amts', e.target.files?.[0] ?? null)}
            />
            <button
              type="button"
              className="mt-2 text-xs font-medium text-blue-700 hover:underline"
              onClick={() => downloadTemplate('amts-template.csv', amtsCsvTemplate)}
            >
              Скачать шаблон CSV
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Сфотографируйте бланк Агроплема или распечатку AMTS. После распознавания проверьте цифры и нажмите «Применить к
            черновику» — дальше та же сверка с DTM.
          </p>

          <div className="flex flex-wrap gap-2">
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm">
              <input
                type="radio"
                name="docType"
                checked={docType === 'agroplem'}
                onChange={() => {
                  setDocType('agroplem')
                  setLabDraft(null)
                  setAmtsDraft(null)
                  setOcrStatus('idle')
                }}
              />
              Бланк Агроплем
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm">
              <input
                type="radio"
                name="docType"
                checked={docType === 'amts'}
                onChange={() => {
                  setDocType('amts')
                  setLabDraft(null)
                  setAmtsDraft(null)
                  setOcrStatus('idle')
                }}
              />
              Рацион AMTS
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => cameraRef.current?.click()}
              className="rounded-lg bg-blue-700 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-800"
            >
              Сделать фото
            </button>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('feeding-gallery-input') as HTMLInputElement | null
                el?.click()
              }}
              className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Выбрать из галереи
            </button>
          </div>

          <input
            ref={cameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="sr-only"
            onChange={(e) => onPhotoSelected(e.target.files?.[0] ?? null)}
          />
          <input
            id="feeding-gallery-input"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => onPhotoSelected(e.target.files?.[0] ?? null)}
          />

          {previewUrl ? (
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <img src={previewUrl} alt="Снимок бланка" className="max-h-64 w-full rounded-lg border object-contain" />
                <p className="mt-1 text-[10px] text-slate-500">{fileName}</p>
                <button
                  type="button"
                  onClick={runOcr}
                  disabled={ocrStatus === 'scanning'}
                  className="mt-3 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
                >
                  {ocrStatus === 'scanning' ? 'Распознаём…' : 'Распознать автоматически'}
                </button>
                <p className="mt-2 text-[10px] text-amber-800">
                  Демо: OCR по шаблону бланка. В продакшене — серверное распознавание + ручная правка полей ниже.
                </p>
              </div>

              {ocrStatus === 'done' && labDraft ? (
                <div className="overflow-x-auto">
                  <p className="mb-2 text-xs font-semibold text-slate-700">Распознанные показатели — проверьте</p>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b text-slate-500">
                        <th className="py-1 text-left">Показатель</th>
                        <th className="py-1 text-right">Результат</th>
                        <th className="py-1 text-right">OCR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {labDraft.map((row, i) => (
                        <tr key={row.name} className={row.inRange ? '' : 'bg-amber-50'}>
                          <td className="py-1 pr-2">{row.name}</td>
                          <td className="py-1 text-right">
                            <input
                              className="w-16 rounded border px-1 text-right"
                              value={row.result}
                              onChange={(e) => {
                                const next = [...labDraft]
                                next[i] = { ...row, result: e.target.value }
                                setLabDraft(next)
                              }}
                            />
                          </td>
                          <td className="py-1 text-right">{confidenceBadge(row.confidence)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button
                    type="button"
                    onClick={applyPhoto}
                    className="mt-3 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
                  >
                    Применить к черновику
                  </button>
                </div>
              ) : null}

              {ocrStatus === 'done' && amtsDraft ? (
                <div className="overflow-x-auto">
                  <p className="mb-2 text-xs font-semibold text-slate-700">Распознанный рацион — проверьте кг</p>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b text-slate-500">
                        <th className="py-1 text-left">Ингредиент</th>
                        <th className="py-1 text-right">КС кг</th>
                        <th className="py-1 text-right">OCR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {amtsDraft.map((row, i) => (
                        <tr key={row.name} className="border-b border-slate-100">
                          <td className="py-1 pr-2">{row.name}</td>
                          <td className="py-1 text-right">
                            <input
                              type="number"
                              step="0.1"
                              className="w-16 rounded border px-1 text-right"
                              value={row.asFedKgDay}
                              onChange={(e) => {
                                const next = [...amtsDraft]
                                const v = parseFloat(e.target.value) || 0
                                next[i] = { ...row, asFedKgDay: v }
                                setAmtsDraft(next)
                              }}
                            />
                          </td>
                          <td className="py-1 text-right">{confidenceBadge(row.confidence)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button
                    type="button"
                    onClick={applyPhoto}
                    className="mt-3 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
                  >
                    Применить к черновику
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <p className="text-xs text-slate-500">Нет снимка. На планшете кнопка «Сделать фото» откроет камеру.</p>
          )}
        </div>
      )}
    </WidgetCard>
  )
}
