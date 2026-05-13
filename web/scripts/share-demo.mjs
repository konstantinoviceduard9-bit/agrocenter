/**
 * Временная публичная ссылка на собранный дашборд (без своего домена и без Vercel).
 * Использует localtunnel → поддомен *.loca.lt (бесплатно, пока запущен скрипт).
 *
 * Запуск из папки web: npm run demo:share
 */
import { spawn, spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import localtunnel from 'localtunnel'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

console.log('Сборка production…\n')
const built = spawnSync('npm', ['run', 'build'], { cwd: root, stdio: 'inherit', shell: true })
if (built.status !== 0) process.exit(built.status ?? 1)

console.log('\nЗапуск превью на порту 4173…\n')
const vite = spawn('npm', ['run', 'preview:public'], {
  cwd: root,
  stdio: 'inherit',
  shell: true,
})

await new Promise((r) => setTimeout(r, 5000))

let tunnel
try {
  tunnel = await localtunnel({ port: 4173 })
} catch (e) {
  console.error('Не удалось открыть туннель:', e)
  vite.kill('SIGINT')
  process.exit(1)
}

console.log('\n══════════════════════════════════════════════════════')
console.log('  ВРЕМЕННАЯ ССЫЛКА НА ДЕМО (откройте в браузере):')
console.log('  ' + tunnel.url)
console.log('══════════════════════════════════════════════════════')
console.log('  Остановка: Ctrl+C в этом окне.')
console.log('  Иногда localtunnel показывает страницу с кнопкой —')
console.log('  нажмите Continue, это защита от ботов.\n')

function shutdown() {
  try {
    tunnel.close()
  } catch {
    /* ignore */
  }
  vite.kill('SIGINT')
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
vite.on('exit', () => {
  try {
    tunnel.close()
  } catch {
    /* ignore */
  }
  process.exit(0)
})

tunnel.on('close', () => {
  vite.kill('SIGINT')
})
