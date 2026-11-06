# CLAUDE.md

Blog estático Astro 7 + TypeScript strict + CSS puro. **Fonte da verdade: [PLAN.md](PLAN.md)**; execute uma fase por vez e pare para revisão ao fim de cada uma.

## Convenções

- Conteúdo em `src/content/artigos/` (`.md` ou `pasta/index.md`); schema em `src/content.config.ts` (contrato, o build falha se não bater).
- Slug = nome do arquivo/pasta (ou `slug` no frontmatter). URL: `/artigos/[slug]/`.
- Tags são normalizadas no schema (`src/lib/tags.ts`); rótulos em `src/config/site.ts` (`tagLabels`). Kicker = primeira tag.
- Consultas de posts só via `src/lib/posts.ts` (rascunho some em produção; data futura some sempre).
- Zero JS por padrão; JS só para tema, filtro de tags, cópia de código, busca.
- Sem dependências de CSS/UI; sem chamadas a domínios de terceiros. Fontes via `@fontsource`.
- One Piece: paleta/clima + chapéu de palha genérico no corvo do logo (decisão do Leo, substitui a regra do PLAN §4.1). Nada de Jolly Roger/caveira, personagens, fontes ou arte da obra.
- Markdown: processador padrão do Astro 7 (Sätteri, GFM nativo), sem remark/rehype. Plugins hast em `src/lib/markdown-plugins.ts` (âncoras nos títulos, links externos), ligados em `astro.config.mjs`. `shikiConfig` (tema duplo) precisa ficar em `markdown`, não dentro de `satteri()`. Tempo de leitura: `readingTime()` em `posts.ts`.
- Datas sempre em UTC (`src/lib/format.ts`); `date:` do frontmatter é meia-noite UTC.
- Páginas/rotas e componentes seguem a seção 9 do PLAN; `social` com `TODO` em `site.ts` some do site (não gera link quebrado).
- Em `.astro`, o compilador remove a quebra de linha entre elementos inline: espaçar com `gap` (flex) ou `{' '}`, nunca com whitespace.
- Identidade: o logo é o selo de `design/logo-original.png` (corvo de chapéu de palha sobre livros, fundo preto). `npm run brand` gera `src/assets/logo.png` (cantos transparentes), favicon.ico, apple-touch-icon e og-default.png. No site use `<Logo />` (imagem otimizada pelo Astro; `alt=""` quando estiver dentro de link com aria-label).
- Tema: `color-scheme` + `light-dark()` em `tokens.css`; `--gold` nunca como cor de texto no claro.
- SEO: metadados (canonical, OG, Twitter, JSON-LD) vêm de props do `BaseLayout`; helpers em `src/lib/seo.ts`. OG do artigo = capa raster recortada em 1200×630; capa SVG ou sem capa → `og-default.png`. A 404 tem `noindex`.
- Performance: fontes críticas com preload em `BaseLayout` (evita layout shift na troca de fonte). Alvos de toque ≥ 24px (`.kicker` tem área extra por padding/margin negativa). Um título por nível: listas de artigos aceitam `level` (h2 sob h1).
- Idioma: PT-BR. Mensagens de commit: `artigo: título` para conteúdo.

## Verificação

`npm run build` precisa passar (inclui `astro check`).
