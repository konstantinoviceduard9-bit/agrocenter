import { useEffect, useState } from 'react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

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
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    setHidden(isStandalone())
  }, [])

  useEffect(() => {
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      setInstallPrompt(event as BeforeInstallPromptEvent)
      setHidden(false)
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
  }, [])

  const installApp = async () => {
    if (!installPrompt) return
    await installPrompt.prompt()
    const choice = await installPrompt.userChoice
    if (choice.outcome === 'accepted') setHidden(true)
    setInstallPrompt(null)
  }

  if (hidden) return null

  if (compact) {
    return installPrompt ? (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-950">
        <p>
          <strong>Установить как приложение:</strong> откроется без адресной строки Chrome.
        </p>
        <button
          type="button"
          onClick={installApp}
          className="mt-2 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white"
        >
          Установить Матрикс
        </button>
      </div>
    ) : (
      <p className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-950">
        <strong>На экран «Домой»:</strong>{' '}
        {isIos() ? (
          <>Safari → «Поделиться» → «На экран Домой»</>
        ) : (
          <>Chrome → ⋮ → «Установить приложение» (удобнее, чем вкладка в браузере)</>
        )}
      </p>
    )
  }

  return (
    <div className="rounded-xl border border-blue-300 bg-gradient-to-br from-blue-50 to-white px-4 py-3 text-sm text-blue-950 shadow-sm">
      <p className="font-bold">Установить как приложение (без магазина)</p>
      {installPrompt ? (
        <button
          type="button"
          onClick={installApp}
          className="matrix-touch-btn mt-3 w-full rounded-xl bg-emerald-700 text-sm font-bold text-white hover:bg-emerald-800"
        >
          Установить Матрикс
        </button>
      ) : null}
      <ol className="mt-2 list-decimal space-y-1 pl-5 text-xs leading-relaxed">
        {isIos() ? (
          <>
            <li>Откройте эту страницу в Safari (не во встроенном браузере Telegram).</li>
            <li>Нажмите «Поделиться» (квадрат со стрелкой вверх).</li>
            <li>Выберите «На экран Домой» → «Добавить».</li>
          </>
        ) : (
          <>
            <li>
              Если кнопки установки нет: меню Chrome (⋮) → <strong>«Установить приложение»</strong>.
            </li>
            <li>
              Пункт <strong>«Добавить на главный экран»</strong> может создать обычный ярлык сайта с адресной строкой.
            </li>
            <li>После установки иконка откроет вход сотрудника сразу, без верхней панели Chrome.</li>
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
