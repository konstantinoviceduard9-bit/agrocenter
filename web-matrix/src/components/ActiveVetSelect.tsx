import { useEffect, useState } from 'react'
import { loadActiveVet, saveActiveVet, veterinarians } from '../data/vetStaff'

export function ActiveVetSelect({ fullWidth = false }: { fullWidth?: boolean }) {
  const [vet, setVet] = useState(loadActiveVet)

  useEffect(() => {
    setVet(loadActiveVet())
  }, [])

  return (
    <label
      className={[
        'flex flex-col gap-0.5',
        fullWidth ? 'w-full' : 'shrink-0 items-end',
      ].join(' ')}
    >
      <span className="text-[10px] font-semibold text-slate-500">Ветеринар на смене</span>
      <select
        value={vet}
        onChange={(e) => {
          setVet(e.target.value)
          saveActiveVet(e.target.value)
        }}
        className={[
          'matrix-touch-input rounded-lg border border-blue-200 bg-blue-700 font-semibold text-white shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-400',
          fullWidth ? 'w-full px-3 py-2.5 text-sm' : 'max-w-[10.5rem] px-2 py-1 text-xs sm:max-w-none sm:px-2.5 sm:py-1 sm:text-sm',
        ].join(' ')}
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
