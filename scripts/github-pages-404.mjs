/**
 * GitHub Pages использует один 404.html в корне сайта.
 * Для /repo/matrix/tasks иначе открывается дашборд группы.
 * Запуск из CI: node scripts/github-pages-404.mjs <repo-name> <dist-dir>
 */
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

const repo = process.argv[2]
const distDir = process.argv[3]
if (!repo || !distDir) {
  console.error('Usage: node github-pages-404.mjs <repo-name> <dist-dir>')
  process.exit(1)
}

const html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <title>Перенаправление…</title>
  <script>
    (function () {
      var repo = ${JSON.stringify(repo)};
      var path = location.pathname;
      var prefix = '/' + repo;
      var matrixPrefix = prefix + '/matrix';
      if (path === matrixPrefix || path.indexOf(matrixPrefix + '/') === 0) {
        var rest = path.slice(matrixPrefix.length) || '/';
        if (rest !== '/' && rest !== '') {
          sessionStorage.setItem('matrix-spa-path', rest + location.search + location.hash);
        }
        location.replace(matrixPrefix + '/index.html');
        return;
      }
      var rest = path.slice(prefix.length) || '/';
      if (rest !== '/' && rest !== '' && rest !== '/index.html') {
        sessionStorage.setItem('agro-spa-path', rest + location.search + location.hash);
      }
      location.replace(prefix + '/index.html');
    })();
  </script>
</head>
<body></body>
</html>
`

writeFileSync(join(distDir, '404.html'), html, 'utf8')
console.log('Wrote', join(distDir, '404.html'), 'for repo', repo)
