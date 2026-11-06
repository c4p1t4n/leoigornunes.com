// npm run novo -- "Título do artigo"
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const title = process.argv.slice(2).join(' ').trim();
if (!title) {
  console.error('Uso: npm run novo -- "Título do artigo"');
  process.exit(1);
}

const slug = title
  .normalize('NFD')
  .replace(/[̀-ͯ]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');
const date = new Date().toLocaleDateString('sv'); // YYYY-MM-DD, data local
const path = `src/content/artigos/${slug}.md`;

if (existsSync(path)) {
  console.error(`Já existe: ${path}`);
  process.exit(1);
}

writeFileSync(
  path,
  readFileSync('templates/artigo.md', 'utf8')
    .replace('{{title}}', title.replaceAll('"', '\\"'))
    .replace('{{date}}', date),
);
console.log(`Criado: ${path}`);
