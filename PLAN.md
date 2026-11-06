# PLAN.md — leoigornunes.com

> Plano de implementação do site pessoal/blog do Leo Igor Nunes.
> **Para o Claude Code:** leia este arquivo inteiro antes de começar. Execute **uma fase por vez** (seção 12), pare ao fim de cada fase, mostre o resultado e espere aprovação antes de seguir. Se algo da seção 14 (decisões em aberto) bloquear o trabalho, pergunte; caso contrário use o valor padrão indicado.

---

## 1. Objetivo

Um blog pessoal estático, rápido e simples, onde:

- cada artigo é um arquivo **`.md`** com frontmatter;
- o site **lê esses arquivos e gera as páginas sozinho** (home, artigo, tags, arquivo);
- o leitor **filtra por tags**;
- ao dar **`git push`** (ou subir o `.md` pela interface web do GitHub), uma **GitHub Action publica automaticamente** em `https://leoigornunes.com`.

Estrutura editorial inspirada no **Brazil Journal** (home com cara de jornal) e na organização do **AkitaOnRails** (listagem por data, #tags, arquivo). Identidade visual com paleta **libertária + One Piece** e logo de **corvo**.

### Princípios

1. **Simples antes de tudo.** Sem CMS, sem banco, sem backend, sem login.
2. **O `.md` é a fonte da verdade.** Escrever um artigo = criar um arquivo.
3. **Zero JS por padrão.** JavaScript só onde agrega (tema claro/escuro, filtro de tags, busca opcional).
4. **Build quebrado não publica.** Frontmatter inválido falha o build e o site anterior continua no ar.

---

## 2. Stack (decisões tomadas)

| Camada                 | Escolha                                                                             | Motivo                                                                                       |
| ---------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Gerador                | **Astro** (versão estável atual, 7.x) em modo estático (SSG)                        | Markdown nativo, Content Collections com schema tipado (Zod), zero JS por padrão, TypeScript |
| Linguagem              | TypeScript (strict)                                                                 | —                                                                                            |
| Estilo                 | **CSS puro** com custom properties (tokens) + estilos escopados do Astro            | Sem dependência de framework CSS; fácil de manter                                            |
| Markdown               | Pipeline padrão do Astro (remark/rehype) + GFM                                      | Tabelas, listas de tarefa, notas de rodapé já vêm prontas                                    |
| Código                 | Shiki (embutido no Astro), tema duplo claro/escuro                                  | —                                                                                            |
| Fontes                 | `@fontsource/*` (self-hosted)                                                       | Sem chamada externa ao Google Fonts                                                          |
| Feeds/SEO              | `@astrojs/rss`, `@astrojs/sitemap`                                                  | —                                                                                            |
| Busca (opcional)       | Pagefind (índice estático gerado no build)                                          | Busca tipo `Ctrl K` sem servidor                                                             |
| Hospedagem             | **GitHub Pages**                                                                    | Grátis, HTTPS automático, domínio próprio                                                    |
| CI/CD                  | **GitHub Actions** com a action oficial `withastro/action` + `actions/deploy-pages` | Push → build → deploy                                                                        |
| Gerenciador de pacotes | npm                                                                                 | Mais simples; commitar o `package-lock.json`                                                 |

Alternativa de hospedagem (não usar agora, só registrar): Cloudflare Pages/Workers ou Vercel, ambos com deploy por push. Trocar depois é trivial porque o output é estático.

Usar a sintaxe atual de Content Collections: arquivo `src/content.config.ts`, loader `glob()` de `astro/loaders`, `z` de `astro/zod`. Conferir na documentação oficial do Astro no momento da implementação.

---

## 3. Referências — o que pegar de cada uma

### Brazil Journal → a **home**

- Barra superior fina com links secundários.
- **Masthead** com o nome/logo em destaque.
- **Menu de seções** logo abaixo (aqui: tags de destaque).
- **Manchete**: um artigo grande com imagem, título serifado forte e o _kicker_ (a tag em caixa alta, acima do título).
- Coluna de **secundárias** ao lado: kicker + título + miniatura.
- Feed "Todas as notícias" mais abaixo e um link para ver mais.
- CTA de assinatura e rodapé com redes sociais e links institucionais.

### AkitaOnRails → a **organização**

- Menu enxuto: Blog, Sobre, Arquivo.
- Cada item da listagem: **data · título · resumo de 1–2 frases · #tags**.
- Listagem **agrupada por mês** com contagem de artigos.
- Bloco lateral "Temas" com as tags mais usadas + "Todas as tags →".
- Página de **Arquivo**, **RSS**, e busca com atalho `Ctrl K`.

---

## 4. Identidade visual

### 4.1 Conceito

"Jornal impresso + bandeira." Base editorial sóbria (papel, tinta, serifa) com acentos de **preto e dourado** (bandeira libertária) e **vermelho e azul-marinho** (paleta do bando do chapéu de palha). O fundo claro em tom de **pergaminho** é um aceno discreto aos cartazes de recompensa de One Piece.

> **Regra de IP:** One Piece entra **apenas como inspiração de paleta e clima**. Não usar Jolly Roger, personagens, chapéu de palha desenhado, fontes ou qualquer elemento gráfico da obra. O logo é um corvo **original**.

### 4.2 Paleta (tokens)

Modo claro:

| Token       | Hex       | Uso                                                                                                             |
| ----------- | --------- | --------------------------------------------------------------------------------------------------------------- |
| `--ink`     | `#111014` | Texto principal, masthead, barra superior (preto corvo)                                                         |
| `--paper`   | `#F5EFE3` | Fundo (pergaminho)                                                                                              |
| `--paper-2` | `#ECE4D3` | Fundo de cards, blocos de código inline, hover                                                                  |
| `--gold`    | `#E3B23C` | **Só preenchimentos e detalhes**: filetes, sublinhado de link no hover, olho do corvo, badges com texto `--ink` |
| `--red`     | `#A3201A` | Kickers, tags, destaques de texto                                                                               |
| `--navy`    | `#1B2A47` | Links, botões, títulos secundários                                                                              |
| `--muted`   | `#5E574C` | Metadados (data, tempo de leitura)                                                                              |
| `--rule`    | `#D8CDB8` | Linhas divisórias                                                                                               |

Modo escuro:

| Token             | Hex                                      |
| ----------------- | ---------------------------------------- |
| `--ink` (texto)   | `#EDE6D8`                                |
| `--paper` (fundo) | `#111014`                                |
| `--paper-2`       | `#1C1A20`                                |
| `--gold`          | `#E3B23C` (pode ser usado em texto aqui) |
| `--red`           | `#E2574C`                                |
| `--navy` → links  | `#8FB4E8`                                |
| `--muted`         | `#A39C8E`                                |
| `--rule`          | `#2C2A31`                                |

Regras de contraste (WCAG AA):

- `--gold` **nunca** é cor de texto sobre `--paper` (contraste ~1,7:1). Sobre fundo escuro, pode.
- `--red`, `--navy` e `--muted` sobre `--paper` passam AA (≥ 4,5:1).
- Foco de teclado: outline de 2px `--gold` com offset.

Implementação: tokens em `:root`, sobrescritos em `@media (prefers-color-scheme: dark)` e em `[data-theme="dark"]` / `[data-theme="light"]` para o toggle manual (preferência salva em `localStorage`, com `try/catch`).

### 4.3 Tipografia

| Papel                        | Fonte                          | Detalhes                                                |
| ---------------------------- | ------------------------------ | ------------------------------------------------------- |
| Masthead e manchetes         | **Playfair Display** (700/900) | Títulos grandes, estilo jornal                          |
| Corpo dos artigos            | **Source Serif 4**             | 19px, `line-height: 1.7`, largura máx. ~68ch            |
| UI, kickers, metadados, menu | **Inter**                      | Kickers em caixa alta, `letter-spacing: .08em`, 12–13px |
| Código                       | **JetBrains Mono**             | 15px                                                    |

Escala sugerida (mobile → desktop com `clamp()`): manchete 2.25→3.5rem; título de artigo 2→3rem; H2 1.5→1.875rem; card 1.125→1.375rem.

### 4.4 Logo — corvo

- **Silhueta de corvo de perfil, olhando para a direita**, desenho original, geométrico/flat (facetas retas ou contorno limpo), legível a 16px.
- Único detalhe de cor: **olho em `--gold`**. Corpo em `currentColor` para inverter sozinho no modo escuro.
- Não decalcar nem imitar logos de corvo existentes.
- Variações a entregar em `public/`:
  - `logo.svg` (corvo + wordmark "LEO IGOR NUNES" em Playfair Display 900)
  - `logo-mark.svg` (só o corvo)
  - `favicon.svg` + `favicon.ico` (32px) + `apple-touch-icon.png` (180px)
  - `og-default.png` (1200×630: fundo `--ink`, corvo + nome em `--paper`, filete `--gold`)
- Variante compacta opcional: monograma **L.N.** para o favicon.
- O Claude Code gera uma primeira versão em SVG; refinamento posterior pode ser feito à mão ou por designer.

### 4.5 Elementos de linguagem visual

- Filete duplo abaixo do masthead (1px `--ink` + 3px `--gold`), como cabeçalho de jornal.
- Divisórias finas `--rule` entre itens das listas.
- Kicker sempre em `--red`, caixa alta, acima do título.
- Tags exibidas como `#tag` (estilo Akita) nas listagens e como chips nas páginas de filtro.
- **Cards sem imagem precisam ficar bonitos** (versão tipográfica): a maioria dos artigos pode não ter capa.
- Easter egg opcional na 404: texto original no clima de "tesouro perdido".

---

## 5. Rotas e páginas

| Rota                 | Conteúdo                                                                                   |
| -------------------- | ------------------------------------------------------------------------------------------ |
| `/`                  | Home estilo jornal (seção 7.1)                                                             |
| `/artigos/[slug]/`   | Página do artigo                                                                           |
| `/tags/`             | Todas as tags com contagem                                                                 |
| `/tags/[tag]/`       | Artigos de uma tag (**o filtro principal**, funciona sem JS e tem URL compartilhável)      |
| `/arquivo/`          | Todos os artigos agrupados por ano → mês, com barra de chips para filtrar por tag          |
| `/sobre/`            | Página "Sobre", gerada de `src/content/paginas/sobre.md`                                   |
| `/rss.xml`           | Feed RSS                                                                                   |
| `/sitemap-index.xml` | Sitemap                                                                                    |
| `/404`               | Página não encontrada                                                                      |
| `/styleguide/`       | **Só em dev**: cores, tipografia e componentes para revisão visual (não vai para produção) |

---

## 6. Modelo de conteúdo

### 6.1 Onde ficam os artigos

```
src/content/artigos/
├─ meu-primeiro-artigo.md            # forma simples: um arquivo
└─ artigo-com-imagens/               # forma com imagens: uma pasta
   ├─ index.md
   └─ capa.jpg
```

- O **slug** vem do nome do arquivo ou da pasta (`artigo-com-imagens/index.md` → `artigo-com-imagens`). Implementar com `generateId` no loader `glob()` se necessário.
- Opcionalmente, um campo `slug` no frontmatter sobrescreve.

### 6.2 Frontmatter

```yaml
---
title: 'Por que sistemas de trading são orientados a eventos'
description: 'Resumo de 1–2 frases. Aparece na listagem, no RSS e no SEO.'
date: 2026-11-05
updated: 2026-11-10 # opcional
tags: [tecnologia, mercado-financeiro, arquitetura]
cover: ./capa.jpg # opcional (só na forma de pasta)
coverAlt: 'Descrição da imagem' # obrigatório se houver cover
featured: false # true = candidato à manchete da home
draft: false # true = não aparece em produção
---
Texto em Markdown...
```

### 6.3 Schema (contrato — o build falha se não bater)

```ts
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const artigos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/artigos' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(1),
        description: z.string().min(1).max(300),
        date: z.coerce.date(),
        updated: z.coerce.date().optional(),
        tags: z.array(z.string()).min(1),
        cover: image().optional(),
        coverAlt: z.string().optional(),
        featured: z.boolean().default(false),
        draft: z.boolean().default(false),
        slug: z.string().optional(),
      })
      .refine((d) => !d.cover || !!d.coverAlt, {
        message: 'coverAlt é obrigatório quando há cover',
      }),
});

const paginas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/paginas' }),
  schema: z.object({ title: z.string(), description: z.string().optional() }),
});

export const collections = { artigos, paginas };
```

### 6.4 Regras de negócio (em `src/lib/posts.ts`)

- `getPublishedPosts()`: exclui `draft: true` **em produção** (em dev mostra, com selo "RASCUNHO") e exclui artigos com `date` no futuro. Ordena por data desc.
- **Tags normalizadas**: minúsculas, sem acento, kebab-case (`"Mercado Financeiro"` → `mercado-financeiro`). Rótulo de exibição vem de um mapa em `src/config/site.ts` (`tagLabels`), com fallback para title case.
- **Kicker** = primeira tag do artigo.
- **Tempo de leitura**: plugin remark simples (~200 palavras/min), exposto no frontmatter computado.
- **Manchete da home**: artigo `featured` mais recente; se não houver, o mais recente.
- **Artigos relacionados**: até 3, por número de tags em comum, desempate por data.

### 6.5 Recursos de Markdown

- GFM (tabelas, task lists, notas de rodapé, autolinks).
- Âncoras nos títulos (`rehype-slug` + `rehype-autolink-headings`).
- Links externos com `target="_blank" rel="noopener noreferrer"`.
- Blocos de código com Shiki (tema claro/escuro) e botão "copiar" (JS mínimo).
- Sumário (TOC) automático na lateral para artigos com 3+ H2.
- Imagens no corpo otimizadas pelo Astro quando estão na pasta do artigo.

---

## 7. Layout das páginas

### 7.1 Home (Brazil Journal)

```
┌──────────────────────────────────────────────────────────────┐
│ barra fina (--ink): LinkedIn · GitHub · RSS         ☀/☾      │
├──────────────────────────────────────────────────────────────┤
│                 [corvo]  LEO IGOR NUNES                      │
│                 tagline curta                                │
│ ════════════════════════════════════════════ (filete duplo)  │
│ Tecnologia  Mercado Financeiro  Economia  Carreira  Opinião  │
│                                   Arquivo · Sobre · [busca]  │
├───────────────────────────────────────┬──────────────────────┤
│ KICKER                                │ KICKER               │
│ Manchete grande em Playfair           │ Secundária 1  [thumb]│
│ Linha fina (description)              │──────────────────────│
│ data · 7 min                          │ Secundária 2  [thumb]│
│ [capa 16:9 — opcional]                │──────────────────────│
│                                       │ Secundária 3  [thumb]│
├───────────────────────────────────────┴──────────────────────┤
│ ÚLTIMOS ARTIGOS                       │ TEMAS                │
│ 05 nov  Título do artigo              │ #tecnologia (12)     │
│         Resumo em 1–2 linhas          │ #carreira (8)        │
│         #tag #tag                     │ ...                  │
│ ───────────────────────               │ Todas as tags →      │
│ (12 itens)                            │──────────────────────│
│ Ver todos no arquivo →                │ Sobre o autor (mini) │
│                                       │ RSS / LinkedIn       │
├───────────────────────────────────────┴──────────────────────┤
│ rodapé: logo mono · links · © 2026 · feito com Astro         │
└──────────────────────────────────────────────────────────────┘
```

- Grid desktop: 8/4 colunas. Mobile: tudo em coluna, menu de tags vira faixa de chips com scroll horizontal (sem scroll horizontal da página).
- Secundárias = os 3 artigos seguintes à manchete.
- "Últimos artigos" = do 5º em diante, 12 itens, formato Akita.

### 7.2 Artigo

- Kicker(s) → título (Playfair) → linha fina (description) → meta: data, "atualizado em", tempo de leitura.
- Capa opcional (16:9, `<Image>` do Astro, `loading="eager"` só aqui).
- Corpo em Source Serif 4, 68ch, centralizado; TOC fixo à direita no desktop (se houver).
- Rodapé do artigo: tags em chips, compartilhar (LinkedIn, X, copiar link — só links, sem SDKs), anterior/próximo, artigos relacionados (3).

### 7.3 Tags

- `/tags/`: lista de chips com contagem, ordenável por "mais usadas" (padrão) e "A–Z".
- `/tags/[tag]/`: título `#tag`, contagem, listagem formato Akita, e as demais tags como chips para trocar de filtro.

### 7.4 Arquivo

- Agrupado por **ano → mês** com contagem ("Novembro 2026 · 4 artigos"), igual ao Akita.
- Barra de chips de tags no topo: **com JS**, filtra a lista na própria página e sincroniza `?tag=` na URL (multi-seleção opcional); **sem JS**, cada chip é link para `/tags/[tag]/`. Script vanilla, < 2 KB.

### 7.5 Sobre e 404

- `/sobre/` renderiza `src/content/paginas/sobre.md` com o layout de artigo (sem data/tags).
- 404 com o corvo, mensagem curta e links para home e arquivo.

### 7.6 Acessibilidade e responsividade

- `lang="pt-BR"`, landmarks semânticos (`header`, `nav`, `main`, `article`, `aside`, `footer`), link "pular para o conteúdo".
- Alt obrigatório em capas (garantido pelo schema).
- Testar em 375px, 768px e 1280px.

---

## 8. SEO e metadados

- `<title>`, `description`, canonical, Open Graph e Twitter Card em todas as páginas.
- OG image do artigo = capa (se houver) ou `og-default.png`.
- JSON-LD `BlogPosting` nos artigos e `Person`/`WebSite` na home.
- RSS com título, resumo, data, tags e link; `<link rel="alternate">` no `<head>`.
- Sitemap automático; `robots.txt` apontando para ele.
- Sem trackers na v1.

---

## 9. Estrutura de pastas

```
leoigornunes.com/
├─ .github/
│  └─ workflows/
│     └─ deploy.yml
├─ public/
│  ├─ CNAME                      # "leoigornunes.com"
│  ├─ robots.txt
│  ├─ favicon.svg  favicon.ico  apple-touch-icon.png
│  ├─ logo.svg  logo-mark.svg
│  └─ og-default.png
├─ scripts/
│  └─ novo-artigo.mjs            # npm run novo -- "Título"
├─ templates/
│  └─ artigo.md                  # modelo de frontmatter para copiar
├─ src/
│  ├─ content/
│  │  ├─ artigos/                # ← AQUI ENTRAM OS .md
│  │  └─ paginas/
│  │     └─ sobre.md
│  ├─ content.config.ts
│  ├─ config/
│  │  └─ site.ts                 # nome, tagline, autor, redes, featuredTags, tagLabels
│  ├─ components/
│  │  ├─ TopBar.astro  Masthead.astro  NavTags.astro  Footer.astro
│  │  ├─ HeroStory.astro  SecondaryStory.astro  PostListItem.astro
│  │  ├─ TagChip.astro  TagCloud.astro  Sidebar.astro  AuthorCard.astro
│  │  ├─ ThemeToggle.astro  Toc.astro  RelatedPosts.astro  ShareLinks.astro
│  │  └─ Logo.astro
│  ├─ layouts/
│  │  ├─ BaseLayout.astro        # head, SEO, tema, header, footer
│  │  └─ PostLayout.astro
│  ├─ lib/
│  │  ├─ posts.ts                # consultas, ordenação, agrupamento, relacionados
│  │  ├─ tags.ts                 # normalização e rótulos
│  │  └─ reading-time.ts         # plugin remark
│  ├─ pages/
│  │  ├─ index.astro
│  │  ├─ artigos/[slug].astro
│  │  ├─ tags/index.astro
│  │  ├─ tags/[tag].astro
│  │  ├─ arquivo.astro
│  │  ├─ sobre.astro
│  │  ├─ styleguide.astro        # só em dev
│  │  ├─ rss.xml.ts
│  │  └─ 404.astro
│  └─ styles/
│     ├─ tokens.css
│     ├─ global.css
│     └─ prose.css
├─ astro.config.mjs              # site: 'https://leoigornunes.com' (sem base)
├─ package.json
├─ README.md                     # como publicar (seção 10.3)
└─ CLAUDE.md                     # convenções do projeto para sessões futuras
```

`src/config/site.ts` (exemplo):

```ts
export const site = {
  name: 'Leo Igor Nunes',
  tagline: 'TODO: frase curta do masthead',
  url: 'https://leoigornunes.com',
  author: { name: 'Leo Igor Nunes', bio: 'TODO', avatar: '/avatar.jpg' },
  social: {
    linkedin: 'https://www.linkedin.com/in/TODO',
    github: 'https://github.com/TODO',
  },
  featuredTags: [
    'tecnologia',
    'mercado-financeiro',
    'economia',
    'carreira',
    'opiniao',
  ],
  tagLabels: {
    aws: 'AWS',
    'mercado-financeiro': 'Mercado Financeiro',
    opiniao: 'Opinião',
  },
  postsPerHome: 12,
};
```

---

## 10. Publicação automática

### 10.1 Workflow `.github/workflows/deploy.yml`

Base (copiar a versão mais recente das actions da documentação oficial do Astro, "Deploy to GitHub Pages", no momento da implementação):

```yaml
name: Deploy

on:
  push:
    branches: [main]
  workflow_dispatch: # botão "Run workflow" manual
  schedule:
    - cron: '0 9 * * *' # 06:00 de Brasília: publica artigos com data futura (agendados)

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build
        uses: withastro/action@v3 # usar a major mais recente indicada na doc
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Comportamento esperado:

- Push na `main` → build → deploy em ~1–2 min.
- Frontmatter inválido → **build falha**, GitHub manda e-mail, **o site anterior continua no ar**.
- O cron diário faz artigos com `date` futura aparecerem sozinhos no dia certo.

### 10.2 Configuração no GitHub

1. Repositório público (ou privado em plano que permita Pages).
2. **Settings → Pages → Source: GitHub Actions.**
3. **Custom domain:** `leoigornunes.com` → marcar **Enforce HTTPS** quando liberar.
4. **Verificar o domínio** na conta (Settings da conta → Pages → Add domain → registro TXT no DNS) para evitar sequestro do domínio.

### 10.3 Fluxo de publicação do Leo (vai para o README)

**Pelo computador**

```bash
npm run novo -- "Título do artigo"   # cria src/content/artigos/titulo-do-artigo.md com frontmatter
npm run dev                          # opcional: pré-visualizar em localhost:4321
git add . && git commit -m "artigo: título do artigo" && git push
```

**Sem ambiente local (navegador ou app do GitHub)**

1. Abrir `src/content/artigos/` no GitHub.
2. _Add file → Create new file_ (ou _Upload files_ com um `.md` pronto).
3. Colar o frontmatter do `templates/artigo.md`, escrever, _Commit changes_ na `main`.
4. Em ~2 min está no ar.

**Rascunho:** `draft: true` ou trabalhar numa branch; só vai ao ar quando estiver na `main` com `draft: false`.

---

## 11. Domínio `leoigornunes.com` (migração para o site próprio)

1. **Antes de mexer:** anotar todos os registros DNS atuais. **Não apagar registros `MX`/`TXT` de e-mail**, se houver e-mail no domínio.
2. Remover os registros `A`/`CNAME` que apontam para a plataforma atual.
3. Criar no provedor de DNS (conferir na doc do GitHub Pages no momento):
   - `A` em `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `AAAA` em `@` → `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
   - `CNAME` em `www` → `<usuario-github>.github.io`
4. `public/CNAME` com `leoigornunes.com`; `astro.config.mjs` com `site: 'https://leoigornunes.com'` e **sem** `base`.
5. Esperar propagação e emissão do certificado HTTPS (minutos a algumas horas).
6. Se o site antigo tinha URLs indexadas, mapear e criar redirecionamentos com a opção `redirects` do `astro.config.mjs` (GitHub Pages não tem redirect de servidor; o Astro gera páginas de redirecionamento). Conteúdo antigo que valha manter → converter para `.md`.

---

## 12. Fases de implementação (Claude Code)

> Ao fim de cada fase: rodar `npm run build`, listar o que foi feito e **parar para revisão**.

### Fase 0 — Setup

- Criar projeto Astro (template mínimo, TypeScript strict), npm, Prettier com plugin Astro.
- `astro.config.mjs` com `site`, integrações de sitemap.
- `.gitignore`, `README.md` inicial, `CLAUDE.md` resumindo convenções deste plano.
- **Aceite:** `npm run dev` e `npm run build` passam.

### Fase 1 — Conteúdo

- `src/content.config.ts` (seção 6.3), `src/lib/posts.ts`, `src/lib/tags.ts`, plugin de tempo de leitura.
- 6 artigos de exemplo cobrindo: com capa (pasta), sem capa (arquivo), com bloco de código, com tabela, um `featured`, um `draft`, um com data futura.
- `templates/artigo.md` e `scripts/novo-artigo.mjs` (`npm run novo -- "Título"` gera slug sem acentos e data de hoje).
- **Aceite:** build passa; rascunho e artigo futuro não aparecem no build de produção; remover o `title` de um artigo faz o build **falhar** com mensagem clara.

### Fase 2 — Design system

- `tokens.css` (seção 4.2), `global.css`, `prose.css`, fontes via `@fontsource`.
- Tema claro/escuro com toggle (sem flash na carga: script inline mínimo no `<head>`).
- Logo do corvo e favicons (seção 4.4).
- `/styleguide/` só em dev mostrando paleta, tipografia, kicker, chips, cards com e sem imagem.
- **Aceite:** styleguide revisado e aprovado pelo Leo; contraste AA nos dois temas.

### Fase 3 — Páginas

- `BaseLayout`, `PostLayout`, componentes da seção 9.
- Home (7.1), artigo (7.2), tags (7.3), arquivo com filtro de chips (7.4), sobre e 404 (7.5).
- **Aceite:** navegação completa entre todas as rotas; filtro por tag funcionando com e sem JS; sem scroll horizontal em 375px; nenhum link quebrado.

### Fase 4 — SEO e feeds

- Meta tags, OG, canonical, JSON-LD, RSS, sitemap, robots.
- **Aceite:** RSS válido; `og:image` correto em home e artigos; Lighthouse ≥ 95 em Performance, Acessibilidade, Boas práticas e SEO.

### Fase 5 — Deploy

- `.github/workflows/deploy.yml`, `public/CNAME`, README com o fluxo da seção 10.3 e passos de DNS da seção 11.
- **Aceite:** push com artigo novo publica sozinho; push com frontmatter inválido falha sem derrubar o site.

### Fase 6 — Extras (opcional, um por vez)

- Busca com Pagefind e atalho `Ctrl K`.
- TOC lateral e botão "copiar" nos blocos de código (se não entraram na Fase 3).
- Artigos relacionados e anterior/próximo (se não entraram na Fase 3).
- Workflow `check.yml` em pull requests (`astro check` + build) para revisar artigos via PR.

---

## 13. Requisitos não funcionais

- JS total enviado < 10 KB (sem contar Pagefind).
- Imagens via `<Image>` do Astro (AVIF/WebP, `loading="lazy"` fora da dobra).
- Build local < 30 s com até 200 artigos.
- Nenhuma chamada a domínios de terceiros na carga da página.

## Fora do escopo (v1)

CMS visual, comentários, newsletter com backend, login, versão em inglês, MDX, analytics, fórmulas matemáticas (KaTeX — candidato a v2), imagens OG geradas automaticamente por artigo.

---

## 14. Decisões em aberto (padrão entre parênteses)

1. **Usuário do GitHub** e nome do repositório (repo `leoigornunes.com`).
2. **Onde o domínio está registrado** e se há **e-mail** nele (verificar antes de mexer no DNS).
3. **Tags de destaque no menu** (`tecnologia, mercado-financeiro, economia, carreira, opiniao`) — alternativa: usar as linhas editoriais do conteúdo do LinkedIn/Instagram como seções.
4. **Nome no masthead** ("LEO IGOR NUNES") e **tagline** (TODO).
5. **Formato da URL** (`/artigos/[slug]/`).
6. **Idioma** (só PT-BR na v1).

---

## 15. Prompt inicial para o Claude Code

```
Leia o PLAN.md na raiz do repositório. Ele é a especificação deste projeto.
Execute somente a Fase 0 e a Fase 1. Siga as decisões já tomadas no plano;
para itens da seção 14 use o valor padrão, a menos que bloqueie o trabalho.
Ao terminar, rode o build, me mostre o que foi criado e pare para eu revisar
antes da Fase 2.
```

Prompts das fases seguintes: "Siga para a Fase N do PLAN.md e pare ao final para revisão."
