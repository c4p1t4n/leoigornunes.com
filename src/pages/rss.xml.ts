import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { site } from '../config/site';
import { getPublishedPosts } from '../lib/posts';

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();
  const feedUrl = new URL('/rss.xml', context.site).href;
  return rss({
    title: site.name,
    description: site.tagline,
    site: context.site!,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    // idioma + atom:link rel=self (recomendado pelo validador do W3C)
    customData: `<language>pt-br</language><atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>`,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.date,
      link: `/artigos/${p.id}/`,
      categories: p.data.tags,
    })),
  });
}
