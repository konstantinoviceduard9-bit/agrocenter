import { useEffect, useState } from 'react'
import { loadActiveVet, saveActiveVet, veterinarians } from '../data/vetStaff'

export function ActiveVetSelect() {
  const [vet, setVet] = useState(loadActiveVet)

  useEffect(() => {
    setVet(loadActiveVet())
  }, [])

  return (
    <label className="flex shrink-0 flex-col items-end gap-0.5">
      <span className="text-[10px] font-semibold text-slate-500">Ветеринар</span>
      <select
        value={vet}
        onChange={(e) => {
          setVet(e.target.value)
          saveActiveVet(e.target.value)
        }}
        className="max-w-[10.5rem] rounded-lg border border-blue-200 bg-blue-700 px-2 py-1 text-xs font-semibold text-white shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-400 sm:max-w-none sm:px-2.5 sm:py-1 sm:text-sm"
        aria-label="Текущий ветеринар"
      >
        {veterinarians.map((name) => (
          <option key={name} value={name} className="bg-white text-slate-900">
            {name}
          </option>
        ))}
      </select>
    </label>
  )
}
