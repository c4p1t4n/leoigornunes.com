import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'artigos'>;

const byDateDesc = (a: Post, b: Post) =>
  b.data.date.getTime() - a.data.date.getTime();

/** Produção: sem rascunhos. Sempre: sem artigos com data futura. Ordem: mais recente primeiro. */
export async function getPublishedPosts(): Promise<Post[]> {
  const now = Date.now();
  const posts = await getCollection(
    'artigos',
    ({ data }) =>
      data.date.getTime() <= now && (!import.meta.env.PROD || !data.draft),
  );
  return posts.sort(byDateDesc);
}

/** Kicker = primeira tag. */
export const kicker = (post: Post) => post.data.tags[0];

/** Manchete: `featured` mais recente; senão o mais recente. */
export const getHeadline = (posts: Post[]) =>
  posts.find((p) => p.data.featured) ?? posts[0];

/** Tags com contagem, mais usadas primeiro. */
export function getTagCounts(posts: Post[]) {
  const counts = new Map<string, number>();
  for (const p of posts)
    for (const t of p.data.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

/** Até 3 artigos com mais tags em comum; desempate por data. */
export function getRelated(post: Post, posts: Post[], limit = 3) {
  const shared = (p: Post) =>
    p.data.tags.filter((t) => post.data.tags.includes(t)).length;
  return posts
    .filter((p) => p.id !== post.id && shared(p) > 0)
    .sort((a, b) => shared(b) - shared(a) || byDateDesc(a, b))
    .slice(0, limit);
}

/** Tempo de leitura em minutos (~200 palavras/min), a partir do markdown cru. */
export const readingTime = (post: Post) =>
  Math.max(
    1,
    Math.ceil((post.body ?? '').split(/\s+/).filter(Boolean).length / 200),
  );

/** Ano → mês (decrescentes) para a página de arquivo. */
export function groupByMonth(posts: Post[]) {
  const years = new Map<number, Map<number, Post[]>>();
  for (const p of posts) {
    const y = p.data.date.getUTCFullYear();
    const m = p.data.date.getUTCMonth();
    const months = years.get(y) ?? new Map<number, Post[]>();
    months.set(m, [...(months.get(m) ?? []), p]);
    years.set(y, months);
  }
  return [...years]
    .sort((a, b) => b[0] - a[0])
    .map(([year, months]) => ({
      year,
      months: [...months]
        .sort((a, b) => b[0] - a[0])
        .map(([month, posts]) => ({ month, posts })),
    }));
}

/** Anterior = mais antigo, próximo = mais novo (posts já ordenados do mais novo ao mais antigo). */
export function getAdjacent(post: Post, posts: Post[]) {
  const i = posts.findIndex((p) => p.id === post.id);
  return { newer: posts[i - 1], older: posts[i + 1] };
}
