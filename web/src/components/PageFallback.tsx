export function PageFallback() {
  return (
    <div className="flex min-h-[12rem] items-center justify-center p-6" role="status" aria-live="polite">
      <p className="text-sm font-medium text-slate-500">Загрузка…</p>
    </div>
  )
}
