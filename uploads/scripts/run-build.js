const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
process.chdir(root);

const io = {
  readFile: (f) => fs.promises.readFile(path.join(root, f), 'utf8'),
  saveFile: (f, data) => fs.promises.writeFile(path.join(root, f), data, 'utf8'),
  ls: (d) => fs.promises.readdir(path.join(root, d)),
  log: (...args) => console.log(...args),
};

eval(fs.readFileSync(path.join(root, 'src/build.js'), 'utf8'));

const version = '20260818s';
GPSBUILD.run(version, io).then((n) => {
  console.log('Build complete:', n, 'pages');
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
