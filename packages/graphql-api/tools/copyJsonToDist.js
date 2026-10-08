import fs from 'fs';
import path from 'path';

const srcRoot = path.resolve(import.meta.dirname, '../src');
const distRoot = path.resolve(import.meta.dirname, '../dist');

function copyJsonFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      copyJsonFiles(fullPath);
      continue;
    }
    if (!entry.name.endsWith('.json')) continue;
    const rel = path.relative(srcRoot, fullPath);
    const dest = path.join(distRoot, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(fullPath, dest);
    console.log(`copied ${rel}`);
  }
}

if (!fs.existsSync(srcRoot)) {
  console.error('src directory not found');
  process.exit(1);
}
if (!fs.existsSync(distRoot)) {
  console.error('dist directory not found; run tsc first');
  process.exit(1);
}

copyJsonFiles(srcRoot);
