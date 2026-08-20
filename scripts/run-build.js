const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
process.chdir(root);

const KEEP_FLAT = new Set([
  'index.html',
  '404.html',
  'hero-a.html',
  'hero-b.html',
  'hero-c.html',
]);

async function writeBoth(rel, data) {
  const rootPath = path.join(root, rel);
  const distPath = path.join(dist, rel);
  await fs.promises.mkdir(path.dirname(rootPath), { recursive: true });
  await fs.promises.mkdir(path.dirname(distPath), { recursive: true });
  await fs.promises.writeFile(rootPath, data, 'utf8');
  await fs.promises.writeFile(distPath, data, 'utf8');
}

async function cleanStaleFlatHtml(dir) {
  const entries = await fs.promises.readdir(dir);
  let removed = 0;
  for (const name of entries) {
    if (!name.endsWith('.html')) continue;
    if (KEEP_FLAT.has(name)) continue;
    if (name.startsWith('google') && name.endsWith('.html')) continue;
    const base = name.slice(0, -5);
    const folderIndex = path.join(dir, base, 'index.html');
    if (!fs.existsSync(folderIndex)) continue;
    await fs.promises.unlink(path.join(dir, name));
    removed++;
  }
  return removed;
}

const io = {
  readFile: (f) => fs.promises.readFile(path.join(root, f), 'utf8'),
  saveFile: (f, data) => writeBoth(f, data),
  ls: (d) => fs.promises.readdir(path.join(root, d)),
  log: (...args) => console.log(...args),
};

require('./gen-search-index').main();

eval(fs.readFileSync(path.join(root, 'src/build.js'), 'utf8'));

const version = '20260820x';
GPSBUILD.run(version, io).then(async (n) => {
  const assets = ['assets/site.js', 'assets/site.css', 'assets/ui.css', 'assets/search-index.json', '.htaccess'];
  for (const a of assets) {
    const src = path.join(root, a);
    if (!fs.existsSync(src)) continue;
    const data = await fs.promises.readFile(src);
    const dest = path.join(dist, a);
    await fs.promises.mkdir(path.dirname(dest), { recursive: true });
    await fs.promises.writeFile(dest, data);
  }
  const r1 = await cleanStaleFlatHtml(root);
  const r2 = await cleanStaleFlatHtml(dist);
  console.log('Build complete:', n, 'pages; removed', r1 + r2, 'stale flat .html files');
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
