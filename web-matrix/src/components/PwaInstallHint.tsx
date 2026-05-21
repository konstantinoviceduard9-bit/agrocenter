import { useEffect, useState } from 'react'

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

function isIos(): boolean {
  if (typeof navigator === 'undefined') return false
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

export function PwaInstallHint({ compact = false }: { compact?: boolean }) {
  const [hidden, setHidden] = useState(true)

  useEffect(() => {
    setHidden(isStandalone())
  }, [])

  if (hidden) return null

  if (compact) {
    return (
      <p className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-950">
        <strong>На экран «Домой»:</strong>{' '}
        {isIos() ? (
          <>«Поделиться» → «На экран Домой»</>
        ) : (
          <>меню браузера → «Установить приложение» или «Добавить на главный экран»</>
        )}
      </p>
    )
  }

  return (
    <div className="rounded-xl border border-blue-300 bg-gradient-to-br from-blue-50 to-white px-4 py-3 text-sm text-blue-950 shadow-sm">
      <p className="font-bold">Установить как приложение (без магазина)</p>
      <ol className="mt-2 list-decimal space-y-1 pl-5 text-xs leading-relaxed">
        {isIos() ? (
          <>
            <li>Откройте эту страницу в Safari (не во встроенном браузере Telegram).</li>
            <li>Нажмите «Поделиться» (квадрат со стрелкой вверх).</li>
            <li>Выберите «На экран Домой» → «Добавить».</li>
          </>
        ) : (
          <>
            <li>Меню браузера (⋮) → «Установить приложение» или «Добавить на главный экран».</li>
            <li>После установки иконка откроет вход сотрудника сразу.</li>
          </>
        )}
      </ol>
      <button
        type="button"
        className="mt-3 text-xs font-semibold text-blue-800 underline"
        onClick={() => setHidden(true)}
      >
        Скрыть подсказку
      </button>
    </div>
  )
}
