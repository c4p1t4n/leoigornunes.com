# leoigornunes.com

Blog pessoal estático em [Astro](https://astro.build). Especificação completa em [PLAN.md](PLAN.md).

## Comandos

| Comando                    | O que faz                                                                       |
| -------------------------- | ------------------------------------------------------------------------------- |
| `npm run dev`              | Pré-visualização em `localhost:4321` (mostra rascunhos)                         |
| `npm run build`            | `astro check` + build de produção em `dist/`                                    |
| `npm run novo -- "Título"` | Cria `src/content/artigos/titulo.md` com frontmatter                            |
| `npm run brand`            | Regenera logo, favicon, apple-touch e OG a partir de `design/logo-original.png` |
| `npm run format`           | Prettier                                                                        |

## Publicar um artigo

Push na `main` → GitHub Actions faz o build e publica em ~2 min.

**Pelo computador**

```bash
npm run novo -- "Título do artigo"   # cria o .md com frontmatter
npm run dev                          # opcional: pré-visualizar
git add . && git commit -m "artigo: título do artigo" && git push
```

**Sem ambiente local (navegador ou app do GitHub)**

1. Abra `src/content/artigos/` no repositório.
2. _Add file → Create new file_ (ou _Upload files_ com um `.md` pronto).
3. Cole o frontmatter de [templates/artigo.md](templates/artigo.md), escreva e faça _Commit changes_ na `main`.

**Regras do frontmatter** (o build **falha** se não bater; o site anterior continua no ar e o GitHub avisa por e-mail):

- `title`, `description` (até 300 caracteres), `date` e `tags` (ao menos uma) são obrigatórios.
- `draft: true` esconde em produção. `date` futura agenda: o artigo aparece no primeiro deploy depois da data (o cron roda todo dia às 06:00 de Brasília).
- Artigo com imagens: use uma pasta (`meu-artigo/index.md` + `capa.jpg`) com `cover: ./capa.jpg` e `coverAlt`. Capa raster vira a imagem de compartilhamento (OG).

## Configuração única

### 1. Repositório no GitHub

1. Crie o repositório **público** `c4p1t4n/leoigornunes.com` (vazio, sem README).
2. No terminal, dentro desta pasta:

```bash
git remote add origin git@github.com:c4p1t4n/leoigornunes.com.git
git add .
git commit -m "site: primeira versão"
git push -u origin main
```

3. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
4. **Settings → Actions → General → Workflow permissions:** o padrão serve (o workflow já declara `pages: write` e `id-token: write`).

O primeiro push dispara o workflow [deploy.yml](.github/workflows/deploy.yml). Enquanto o domínio não aponta para o GitHub, o site responde em `https://c4p1t4n.github.io/leoigornunes.com/` (sem estilo, porque o site foi feito para a raiz do domínio próprio).

### 2. Verificar o domínio (evita sequestro)

1. No GitHub: foto de perfil → **Settings** (da **conta**, não do repositório) → **Pages** → **Add a domain** → `leoigornunes.com`.
2. O GitHub mostra um registro **TXT** (`_github-pages-challenge-c4p1t4n` com um valor). Crie-o no DNS (passo 4) e clique em **Verify**.

### 3. Domínio personalizado

**Repositório → Settings → Pages → Custom domain:** `leoigornunes.com` → Save. Depois que o certificado sair (minutos a algumas horas), marque **Enforce HTTPS**.

> Com deploy por Actions o GitHub não cria arquivo `CNAME`; o domínio vem desta configuração. O `public/CNAME` do projeto é inofensivo e vai junto no build.

### 4. DNS na Hostinger

**Antes de mexer:** anote/printe todos os registros atuais. **Não apague** `MX`, `TXT` (SPF, DKIM, DMARC) nem `CNAME` de e-mail (`autodiscover`, `autoconfig`, `*._domainkey`) se o domínio tiver e-mail.

Onde: hPanel → **Domains** → seu domínio → **DNS / Nameservers** → aba **DNS records** (os nameservers precisam ser os da Hostinger). Campos: _Type_, _Name_, _Value_, _TTL_.

**Remova** só o que aponta para a hospedagem/parking atual: registros `A` e `AAAA` em `@` e o `CNAME`/`A` de `www`. (Se houver um site/construtor da Hostinger ligado ao domínio, desconecte-o.)

**Crie:**

| Type  | Name                              | Value                                |
| ----- | --------------------------------- | ------------------------------------ |
| A     | `@`                               | `185.199.108.153`                    |
| A     | `@`                               | `185.199.109.153`                    |
| A     | `@`                               | `185.199.110.153`                    |
| A     | `@`                               | `185.199.111.153`                    |
| AAAA  | `@`                               | `2606:50c0:8000::153`                |
| AAAA  | `@`                               | `2606:50c0:8001::153`                |
| AAAA  | `@`                               | `2606:50c0:8002::153`                |
| AAAA  | `@`                               | `2606:50c0:8003::153`                |
| CNAME | `www`                             | `c4p1t4n.github.io`                  |
| TXT   | `_github-pages-challenge-c4p1t4n` | valor exibido pelo GitHub no passo 2 |

Não use DNS curinga (`*`). Confira a propagação (até 24 h):

```bash
dig +short leoigornunes.com A
dig +short www.leoigornunes.com CNAME
```

Ordem segura: **verificar o domínio (2) → configurar o domínio no repositório (3) → trocar A/AAAA/CNAME (4) → Enforce HTTPS**.

### 5. Site antigo

Se o domínio já tinha páginas indexadas, mapeie as URLs antigas e crie redirecionamentos com a opção `redirects` do `astro.config.mjs` (o GitHub Pages não faz redirect de servidor; o Astro gera páginas de redirecionamento). Conteúdo que valha manter: converta para `.md`.

## Quando algo falha

- **Build vermelho no GitHub (aba Actions):** abra o job `build`; a mensagem aponta o arquivo e o campo do frontmatter. Corrija e dê push; o site anterior segue no ar.
- **Artigo não apareceu:** confira `draft: false` e se a `date` não é futura (UTC). Dê um _Run workflow_ manual na aba Actions.
- **O cron parou:** o GitHub desativa workflows agendados após 60 dias sem atividade no repositório. Qualquer push (ou reativar em Actions) resolve.
- **HTTPS não aparece:** o certificado pode levar até 24 h depois do DNS correto; remova e salve de novo o domínio em Settings → Pages.
